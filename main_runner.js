const { Client } = require("@notionhq/client");
const { NotionToMarkdown } = require("notion-to-md");
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Initialize Notion client
const notion = new Client({
    auth: process.env.NOTION_API_KEY,
});

// Initialize NotionToMarkdown
const n2m = new NotionToMarkdown({
    notionClient: notion,
    config: {
        separateChildPage: true,
    }
});

/**
 * Process a Notion page and its subpages
 * @param {string} pageId - The ID of the Notion page
 * @param {string} baseDir - The base directory to save the markdown files
 * @param {number} depth - The current depth of recursion (for logging purposes)
 * @param {Set} processedPages - Set of already processed page IDs
 */
async function processNotionPage(pageId, baseDir, depth = 0, processedPages = new Set()) {
    if (processedPages.has(pageId)) {
        return; // Skip if page has already been processed
    }
    processedPages.add(pageId);

    // Retrieve the page details
    const page = await notion.pages.retrieve({ page_id: pageId });
    
    // Safely extract the page title
    let pageTitle = "Untitled";
    if (page.properties.title && 
        Array.isArray(page.properties.title.title) && 
        page.properties.title.title.length > 0 &&
        page.properties.title.title[0].plain_text) {
        pageTitle = page.properties.title.title[0].plain_text;
    }
    
    console.log(`${'  '.repeat(depth)}Processing: ${pageTitle}`);

    // Convert page content to markdown
    const mdblocks = await n2m.pageToMarkdown(pageId);
    const mdString = n2m.toMarkdownString(mdblocks);

    // Sanitize the title for use as a filename or directory name
    const sanitizedTitle = pageTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    // Fetch child pages
    const childPages = await notion.blocks.children.list({
        block_id: pageId,
        filter: {
            property: 'type',
            value: 'child_page'
        }
    });

    if (childPages.results.length > 0) {
        // Create a directory for this page if it has subpages
        const pageDir = path.join(baseDir, sanitizedTitle);
        if (!fs.existsSync(pageDir)) {
            fs.mkdirSync(pageDir, { recursive: true });
        }

        // Prepare content for index.md, including links to child pages
        let indexContent = `# ${pageTitle}\n\n${mdString.parent}\n\n## Child Pages\n\n`;
        
        for (const childPage of childPages.results) {
            const childTitle = childPage.child_page.title || "Untitled Child Page";
            const childSanitizedTitle = childTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            indexContent += `- [${childTitle}](./${childSanitizedTitle}.md)\n`;
            console.log(`${'  '.repeat(depth + 1)}Child page: ${childTitle}`);
        }

        // Write the main page content with child page links
        const mainFilePath = path.join(pageDir, `index.md`);
        fs.writeFileSync(mainFilePath, indexContent);
        console.log(`${'  '.repeat(depth)}Created ${mainFilePath}`);

        // Process child pages
        for (const childPage of childPages.results) {
            await processNotionPage(childPage.id, pageDir, depth + 1, processedPages);
        }
    } else {
        // Write the page content as a single .md file if it has no subpages
        const filePath = path.join(baseDir, `${sanitizedTitle}.md`);
        fs.writeFileSync(filePath, `# ${pageTitle}\n\n${mdString.parent}`);
        console.log(`${'  '.repeat(depth)}Created ${filePath}`);
    }
}


function setupGit(baseDir) {
    // Check if we're in a Git repository
    try {
        execSync('git rev-parse --is-inside-work-tree', { cwd: baseDir, stdio: 'ignore' });
    } catch (error) {
        // If not in a Git repository, initialize one
        execSync('git init', { cwd: baseDir });
    }

    // Ensure we're on the main branch
    try {
        execSync('git checkout main', { cwd: baseDir });
    } catch (error) {
        execSync('git checkout -b main', { cwd: baseDir });
    }
}

// Modify the commitAndPush function
async function commitAndPush(baseDir) {
    try {
        setupGit(baseDir);  // Ensure repo and branch setup

        // Add all files in the base directory
        execSync('git add .', { cwd: baseDir });

        // Commit changes (only if there are changes to commit)
        try {
            execSync('git commit -m "Update Notion notes"', { cwd: baseDir });
        } catch (error) {
            console.log('No changes to commit');
            return;
        }

        // Set the remote URL using the GITHUB_TOKEN
        const repoUrl = `https://x-access-token:${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_REPOSITORY}.git`;
        execSync(`git remote set-url origin ${repoUrl}`, { cwd: baseDir });

        // Push to GitHub
        execSync('git push origin main', { cwd: baseDir });

        console.log('Successfully committed and pushed to GitHub');
    } catch (error) {
        console.error('Error during Git operations:', error.message);
    }
}



/**
 * Retrieve all accessible Notion pages
 * @returns {Promise<Array>} Array of accessible Notion pages
 */
async function getAllAccessiblePages() {
    let pages = [];
    let hasMore = true;
    let startCursor = undefined;

    while (hasMore) {
        const response = await notion.search({
            filter: {
                value: 'page',
                property: 'object'
            },
            start_cursor: startCursor,
            page_size: 100,  // maximum allowed by Notion API
        });

        pages = pages.concat(response.results);
        hasMore = response.has_more;
        startCursor = response.next_cursor;
    }

    return pages;
}

// Main execution
(async () => {
    try {
        // Set up the base directory for Notion notes
        const baseDir = process.env.GITHUB_WORKSPACE || path.join(__dirname, 'notion_notes');
        if (!fs.existsSync(baseDir)) {
            fs.mkdirSync(baseDir, { recursive: true });
        }

        // Retrieve all accessible Notion pages
        const pages = await getAllAccessiblePages();
        console.log(`Found ${pages.length} accessible pages`);

        // Process each page
        const processedPages = new Set();
        for (const page of pages) {
            await processNotionPage(page.id, baseDir, 0, processedPages);
        }

        // Commit and push all changes to GitHub
        await commitAndPush(baseDir);

    } catch (error) {
        console.error('Error:', error.message);
    }
})();

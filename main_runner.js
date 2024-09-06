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
 */
async function processNotionPage(pageId, baseDir, depth = 0) {
    // Retrieve the page details
    const page = await notion.pages.retrieve({ page_id: pageId });
    const pageTitle = page.properties.title.title[0].plain_text;
    console.log(`${'  '.repeat(depth)}Processing: ${pageTitle}`);

    // Convert page content to markdown
    const mdblocks = await n2m.pageToMarkdown(pageId);
    const mdString = n2m.toMarkdownString(mdblocks);

    // Sanitize the title for use as a filename or directory name
    const sanitizedTitle = pageTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    // Check if the page has child pages
    const hasChildPages = mdblocks.some(block => block.type === 'child_page');

    if (hasChildPages) {
        // Create a directory for this page if it has subpages
        const pageDir = path.join(baseDir, sanitizedTitle);
        if (!fs.existsSync(pageDir)) {
            fs.mkdirSync(pageDir, { recursive: true });
        }

        // Write the main page content
        const mainFilePath = path.join(pageDir, `${sanitizedTitle}.md`);
        fs.writeFileSync(mainFilePath, `# ${pageTitle}\n\n${mdString.parent}`);
        console.log(`${'  '.repeat(depth)}Created ${mainFilePath}`);

        // Process child pages
        for (const block of mdblocks) {
            if (block.type === 'child_page') {
                const childPageId = block.blockId;
                await processNotionPage(childPageId, pageDir, depth + 1);
            }
        }
    } else {
        // Write the page content as a single .md file if it has no subpages
        const filePath = path.join(baseDir, `${sanitizedTitle}.md`);
        fs.writeFileSync(filePath, `# ${pageTitle}\n\n${mdString.parent}`);
        console.log(`${'  '.repeat(depth)}Created ${filePath}`);
    }
}

/**
 * Commit changes and push to GitHub
 * @param {string} baseDir - The base directory of the Git repository
 */
async function commitAndPush(baseDir) {
    try {
        // Check if the directory is already a Git repository
        const isGitRepo = fs.existsSync(path.join(baseDir, '.git'));

        if (!isGitRepo) {
            // Initialize git repository if not already initialized
            execSync('git init', { cwd: baseDir });
        }

        // Add all files in the base directory
        execSync('git add .', { cwd: baseDir });

        // Commit changes
        execSync('git commit -m "Update Notion notes"', { cwd: baseDir });

        // Push to GitHub (assuming the remote is already set up)
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
        const baseDir = path.join(__dirname, 'notion_notes');
        if (!fs.existsSync(baseDir)) {
            fs.mkdirSync(baseDir);
        }

        // Retrieve all accessible Notion pages
        const pages = await getAllAccessiblePages();
        console.log(`Found ${pages.length} accessible pages`);

        // Process each page
        for (const page of pages) {
            await processNotionPage(page.id, baseDir);
        }

        // Commit and push all changes to GitHub
        await commitAndPush(baseDir);

    } catch (error) {
        console.error('Error:', error.message);
    }
})();

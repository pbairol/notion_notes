const { Client } = require("@notionhq/client");
const { NotionToMarkdown } = require("notion-to-md");
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const notion = new Client({
    auth: process.env.NOTION_API_KEY,
});

const n2m = new NotionToMarkdown({
    notionClient: notion,
    config: {
        separateChildPage: true,
    }
});

async function processNotionPage(pageId, baseDir, depth = 0) {
    const page = await notion.pages.retrieve({ page_id: pageId });
    const pageTitle = page.properties.title.title[0].plain_text;
    console.log(`${'  '.repeat(depth)}Processing: ${pageTitle}`);

    const mdblocks = await n2m.pageToMarkdown(pageId);
    const mdString = n2m.toMarkdownString(mdblocks);

    // Create a directory for this page if it doesn't exist
    const pageDir = path.join(baseDir, pageTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase());
    if (!fs.existsSync(pageDir)) {
        fs.mkdirSync(pageDir, { recursive: true });
    }

    // Write main README file for this page
    const mainReadmePath = path.join(pageDir, 'README.md');
    fs.writeFileSync(mainReadmePath, `# ${pageTitle}\n\n${mdString.parent}`);
    console.log(`${'  '.repeat(depth)}Created ${pageTitle}/README.md`);

    // Process child pages
    for (const block of mdblocks) {
        if (block.type === 'child_page') {
            const childPageId = block.blockId;
            await processNotionPage(childPageId, pageDir, depth + 1);
        }
    }
}

async function commitAndPush(baseDir) {
    try {
        // Initialize git repository if not already initialized
        execSync('git init', { cwd: baseDir });

        // Add all files in the base directory
        execSync('git add .', { cwd: baseDir });

        // Commit changes
        execSync('git commit -m "Update README files from Notion"', { cwd: baseDir });

        // Push to GitHub (assuming the remote is already set up)
        execSync('git push origin main', { cwd: baseDir });

        console.log('Successfully committed and pushed to GitHub');
    } catch (error) {
        console.error('Error during Git operations:', error.message);
    }
}

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

(async () => {
    try {
        const baseDir = path.join(__dirname, 'notion_notes');
        if (!fs.existsSync(baseDir)) {
            fs.mkdirSync(baseDir);
        }

        const pages = await getAllAccessiblePages();
        console.log(`Found ${pages.length} accessible pages`);

        for (const page of pages) {
            await processNotionPage(page.id, baseDir);
        }

        // Commit and push all changes to GitHub
        await commitAndPush(baseDir);

    } catch (error) {
        console.error('Error:', error.message);
    }
})();

const { Client } = require("@notionhq/client");
const { NotionToMarkdown } = require("notion-to-md");
const fs = require('fs');
const path = require('path');


// or
// import {NotionToMarkdown} from "notion-to-md";

const notion = new Client({
    auth: "secret_Yg3cnSOJdaXSPVKFJ3ZdAzJw2wfl7mc2IEJwLSB4Tm5", // internal integration token
});

// passing notion client to the option
// passing notion client to the option
const n2m = new NotionToMarkdown({
    notionClient: notion,
    config: {
        separateChildPage: true, // default: false
    }
});


(async () => {

    const pageId = "bf7ee61531b3410abc53aa5f0b8520cf"; // page's hash
    const page = await notion.pages.retrieve({ page_id: pageId });
    const pageTitle = page.properties.title.title[0].plain_text;

    console.log(pageTitle)
    const mdblocks = await n2m.pageToMarkdown(pageId);
    const mdString = n2m.toMarkdownString(mdblocks);

    // Split the markdown string into sections for each child page
    const childPages = mdblocks.filter(block => block.type === 'child_page');
    // const sections = mdString.split(/(?=## )/); // Assuming child pages are marked with '##' headers
    for (const [title, content] of Object.entries(mdString)) {
        // Create a valid filename by replacing spaces with underscores and removing special characters
        const filename = title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.md';
        // Write the content to the file
        fs.writeFileSync(path.join(__dirname, filename), content);
        console.log(`Created file: ${filename}`);
    }

})();
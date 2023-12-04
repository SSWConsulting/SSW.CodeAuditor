const expect = require('expect.js')
const HTMLHint = require("htmlhint").default;
const { runBrokenLinkCheck, readCsv } = require("../../utils")
const { htmlHintConfig, fetchHtml } = require("../../api");
const { addCustomHtmlRule } = require("../../customHtmlRules");

let testUrls = "http://127.0.0.1:5001/sswlinkauditor-c1131/asia-east2/api/testing/randomizeHtmlPages/content";

before(async () => {
  await addCustomHtmlRule();
});

describe(`Test CodeAuditor Run`, () => {
  it('Test CodeAuditor run', async () => {
    // Scanning broken links
    const [result, error] = runBrokenLinkCheck(testUrls);
    if (error) {
      console.log(`Error scanning broken links: ${error}`);
    }
    const scanResults = await readCsv("./all_links.csv");
    
    // Check HTML Errors/Warnings
    let html = await fetchHtml(testUrls);
    const htmlHintResult = HTMLHint.verify(html, htmlHintConfig);

    expect(scanResults.length).not.to.be(0);
    expect(htmlHintResult.length).not.to.be(0);
  }).timeout(10000)
})

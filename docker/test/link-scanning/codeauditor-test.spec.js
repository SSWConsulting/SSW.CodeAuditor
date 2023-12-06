const expect = require('expect.js')
const HTMLHint = require("htmlhint").default;
const { runBrokenLinkCheck, readCsv } = require("../../utils")
const { htmlHintConfig, fetchHtml } = require("../../api");
const { addCustomHtmlRule } = require("../../customHtmlRules");

let testUrls = "https://asia-east2-sswlinkauditor-c1131.cloudfunctions.net/api/testing/statichtmlpage";

describe(`Test CodeAuditor Run`, () => {
  it('Test CodeAuditor run', async () => {
    // Test Scanning links
    const [result, error] = runBrokenLinkCheck(testUrls);
    if (error) {
      console.log(`Error scanning broken links: ${error}`);
    }
    const scanResults = await readCsv("./all_links.csv");
    
    // Test Checking HTML Errors/Warnings
    let html = await fetchHtml(testUrls);
    const htmlHintResult = HTMLHint.verify(html, htmlHintConfig);

    expect(scanResults.length).to.be(5);
    expect(htmlHintResult.length).to.be(22);
  }).timeout(10000)
})

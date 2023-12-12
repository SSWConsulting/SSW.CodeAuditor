const expect = require('expect.js')
const { runBrokenLinkCheck, readCsv } = require("../../utils")

let testUrls = "https://asia-east2-sswlinkauditor-c1131.cloudfunctions.net/api/testing/statichtmlpage";

describe(`Test reading csv output from link scan`, () => {
  it('Reading links scanned csv', async () => {
    const [result, error] = runBrokenLinkCheck(testUrls);
    if (error) {
      console.log(`Error scanning broken links: ${error}`);
    }
    
    let csvScanresults = await readCsv("./all_links.csv");
    
    expect(csvScanresults.length).not.to.be(0);
  })
})

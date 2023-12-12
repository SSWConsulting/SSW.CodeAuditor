const expect = require('expect.js')
const { runBrokenLinkCheck } = require("../../utils")

let testUrls = "https://asia-east2-sswlinkauditor-c1131.cloudfunctions.net/api/testing/statichtmlpage";

describe(`Test Scanning for Broken Links`, () => {
  it('Scanning broken links', async () => {
    const [result, error] = runBrokenLinkCheck(testUrls);
    if (error) {
      console.log(`Error scanning broken links: ${error}`);
    }
    expect(result.length).not.to.be(0);
  })
})

const expect = require('expect.js')
const { runLighthouseReport } = require("../../utils")
const fs = require("fs");

let testUrls = "https://asia-east2-sswlinkauditor-c1131.cloudfunctions.net/api/testing/statichtmlpage";

describe(`Test running Lighthouse Audit`, () => {
  it('Running Lighthouse Audit', async () => {
    const LIGHTHOUSEFOLDER = "./lhr.json";

    await runLighthouseReport(testUrls);

    const lhr = JSON.parse(fs.readFileSync(LIGHTHOUSEFOLDER).toString());

    expect(lhr.length).not.to.be(0);
  }).timeout(100000)
})
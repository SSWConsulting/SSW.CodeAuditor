const expect = require('expect.js')
const { runArtilleryLoadTest } = require("../../utils")
const fs = require("fs");

let testUrls = "https://asia-east2-sswlinkauditor-c1131.cloudfunctions.net/api/testing/statichtmlpage";

describe(`Test running Artillery Load Test`, () => {
  it('Running Artillery load test', async () => {
    const ARTILLERYFOLDER = "./artilleryOut.json";

    runArtilleryLoadTest(testUrls, writeLog)   
    
    const atr = JSON.parse(fs.readFileSync(ARTILLERYFOLDER).toString());
    
    expect(atr.length).not.to.be(0);
  })
})

let _args = {};

const writeLog = (...msg) => _args.debug && console.log(...msg);

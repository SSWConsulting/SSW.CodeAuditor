const expect = require('expect.js')
const HTMLHint = require("htmlhint").default;
const { runBrokenLinkCheck, readCsv } = require("../../utils")
const { htmlHintConfig, fetchHtml } = require("../../api");
const { addCustomHtmlRule } = require("../../customHtmlRules");

let testUrls = ["http://127.0.0.1:5001/sswlinkauditor-c1131/asia-east2/api/testing/randomizeHtmlPages/sprint"]; 

// for (let i = 0; i < 10; i++) {
//   testUrls.push(`https://localhost:7230/Pages/${Math.floor(Math.random() * 100) + 1}`);
// }

before(async () => {
  await addCustomHtmlRule();
});

describe(`Test CodeAuditor Run`, () => {
  testUrls.forEach(url => {
    it('Test CodeAuditor run', async () => {
      const [result, error] = runBrokenLinkCheck(url);
      
      if (error) {
        console.log(`Error scanning broken links: ${error}`);
      }
  
      const scanResults = await readCsv("./all_links.csv");
      
      let html = await fetchHtml(url);

      console.log(html)

      const htmlHintResult = HTMLHint.verify(html, htmlHintConfig);

      // console.log(scanResults)
      console.log(htmlHintResult)
  
      expect(scanResults.length).not.to.be(0);
      // expect(htmlHintResult.length).not.to.be(0)
    })
  })
})

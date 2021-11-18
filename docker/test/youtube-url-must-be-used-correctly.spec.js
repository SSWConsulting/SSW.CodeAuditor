const expect = require("expect.js");
const HTMLHint = require("htmlhint").default;

const ruldId = "youtube-url-must-be-used-correctly";

const ruleOptions = {};

const { addCustomHtmlRule } = require("../customHtmlRules");

ruleOptions[ruldId] = true;

describe(`Rules: ${ruldId}`, () => {
  addCustomHtmlRule();
  it("Youtube URLs with embed link should result in an error", () => {
    const code = '<a href="https://www.youtube.com/embed/zpTPQ34U8rc" />';
    const messages = HTMLHint.verify(code, ruleOptions);
    expect(messages.length).to.be(1);
  });

  it("Correct Youtube URL should not result in any error", () => {
    const code = '<a href="https://www.youtube.com/watch?v=OccRyzAS4Vc" />';
    const messages = HTMLHint.verify(code, ruleOptions);
    expect(messages.length).to.be(0);
  });
});

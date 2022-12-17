const expect = require("expect.js");
const HTMLHint = require("htmlhint").default;

const ruldId = "detect-absolute-references-url-path-correctly";

const ruleOptions = {};

const { addCustomHtmlRule } = require("../customHtmlRules");

ruleOptions[ruldId] = true;

describe(`Rules: ${ruldId}`, () => {
  addCustomHtmlRule();
  it("Bad example should result in an error", () => {
    const code = '<a href="https://ssw.com.au/rules/when-you-use-mentions-in-a-pbi/" />';
    const messages = HTMLHint.verify(code, ruleOptions);
    expect(messages.length).to.be(1);
  });

  it("Good example should not result in an error", () => {
    const code = '<a href="/rules/when-you-use-mentions-in-a-pbi/" />';
    const messages = HTMLHint.verify(code, ruleOptions);
    expect(messages.length).to.be(0);
  });
});

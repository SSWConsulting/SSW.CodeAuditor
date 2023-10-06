const expect = require("expect.js");
const HTMLHint = require("htmlhint").default;

const ruleId = "aka-must-be-spelt-correctly";

const ruleOptions = {};

const { addCustomHtmlRule } = require("../customHtmlRules");

ruleOptions[ruleId] = true;

describe(`Rules: ${ruleId}`, () => {
  addCustomHtmlRule();
  it("aka used correctly should not result in an error", () => {
    const code = "<p>aka</p>";
    const messages = HTMLHint.verify(code, ruleOptions);
    expect(messages.length).to.be(0);
  });

  it("aka used incorrectly should result in an error", () => {
    const code = "<p>a.k.a A.K.A AKA</p>";
    const messages = HTMLHint.verify(code, ruleOptions);
    expect(messages.length).to.be(3);
  });

  ["meta", "link", "script", "svg"].forEach((tag) => {
    it(`aka in a <${tag}> tag should not result in an error`, () => {
      const code = `<${tag}>a.k.a A.K.A AKA</${tag}>`;
      const messages = HTMLHint.verify(code, ruleOptions);
      expect(messages.length).to.be(0);
    });
  });
});
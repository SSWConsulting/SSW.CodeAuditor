const expect = require("expect.js");
const HTMLHint = require("htmlhint").default;

const ruleId = "common-spelling-mistakes";

const ruleOptions = {};

const { addCustomHtmlRule } = require("../customHtmlRules");

ruleOptions[ruleId] = true;

describe(`Rules: ${ruleId}`, () => {
  addCustomHtmlRule();
  it("terms used correctly should not result in an error", () => {
    const code = "<p>aka email cannot website username taskbar</p>";
    const messages = HTMLHint.verify(code, ruleOptions);
    expect(messages.length).to.be(0);
  });

  it("terms used incorrectly should result in an error", () => {
    const code = "<p>a.k.a A.K.A AKA e-mail EMail can not web site user name task bar</p>";
    const messages = HTMLHint.verify(code, ruleOptions);
    expect(messages.length).to.be(9);
  });

  ["meta", "link", "script", "svg"].forEach((tag) => {
    it(`incorrect terms in a <${tag}> tag should not result in an error`, () => {
      const code = `<${tag}>a.k.a A.K.A AKA e-mail EMail can not web site user name task bar</${tag}>`;
      const messages = HTMLHint.verify(code, ruleOptions);
      expect(messages.length).to.be(0);
    });
  });
});
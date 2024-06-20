const expect = require("expect.js");
const { HTMLHint } = require("htmlhint");

const ruleId = "auth-terms-spelling-mistakes";

const ruleOptions = {};

ruleOptions[ruleId] = true;

describe(`Rules: ${ruleId}`, () => {
  it("terms used correctly should not result in an error", () => {
    const code = "<p>sign in, sign up, register</p>";
    const messages = HTMLHint.verify(code, ruleOptions);
    expect(messages.length).to.be(0);
  });

  it("terms used incorrectly should result in an error", () => {
    const code = "<p> log on, logon, log in, Log on, Logon, Log in</p>";
    const messages = HTMLHint.verify(code, ruleOptions);
    expect(messages.length).to.be(6);
  });

  ["meta", "link", "script", "svg"].forEach((tag) => {
    it(`incorrect terms in a <${tag}> tag should not result in an error`, () => {
      const code = `<${tag}>log on, logon, log in</${tag}>`;
      const messages = HTMLHint.verify(code, ruleOptions);
      expect(messages.length).to.be(0);
    });
  });
});
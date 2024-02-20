const expect = require("expect.js");
const HTMLHint = require("htmlhint").default;

const ruleId = "common-spelling-mistakes";

const ruleOptions = {};

ruleOptions[ruleId] = true;

describe(`Rules: ${ruleId}`, () => {
  it("terms used correctly should not result in an error", () => {
    const code = "<p>aka email cannot website username taskbar</p>";
    const messages = HTMLHint.verify(code, ruleOptions);
    expect(messages.length).to.be(0);
  });

  it("terms used incorrectly should result in an error", () => {
    const code = "<p>e-mail EMail can not web site user name task bar</p>";
    const messages = HTMLHint.verify(code, ruleOptions);
    expect(messages.length).to.be(6);
  });

  it("terms used incorrectly should result in an error", () => {
    const code = "<p>can notice, can note</p>";
    const messages = HTMLHint.verify(code, ruleOptions);
    expect(messages.length).to.be(0);
  });

  it("long string contains the character should not result in an error", () => {
    const code = `<div>wgARCAAKABQDASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAIDBAX/xAAUAQE</div>`;
    const messages = HTMLHint.verify(code, ruleOptions);
    expect(messages.length).to.be(0);
  });

  ["meta", "link", "script", "svg"].forEach((tag) => {
    it(`incorrect terms in a <${tag}> tag should not result in an error`, () => {
      const code = `<${tag}>a.k.a A.K.A AKA e-mail EMail can not web site user name task bar</${tag}>`;
      const messages = HTMLHint.verify(code, ruleOptions);
      expect(messages.length).to.be(0);
    });
  });
});
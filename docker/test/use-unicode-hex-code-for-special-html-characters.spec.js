const expect = require("expect.js");
const HTMLHint = require("htmlhint").default;

const ruldId = "use-unicode-hex-code-for-special-html-characters";

const ruleOptions = {};

const { addCustomHtmlRule } = require("../customHtmlRules");

ruleOptions[ruldId] = true;

before(async () => {
  await addCustomHtmlRule();
});

describe(`Rules: ${ruldId}`, () => {
  it("Non code tag with special char should result in an error", () => {
    const code = '<span>aaa>bbb<ccc</span>';
    const messages = HTMLHint.verify(code, ruleOptions);
    expect(messages.length).to.be(2);
  });

  it("Non code tag without special char should not result in any error", () => {
    const code = '<span>aaa&gt;bbb&lt;ccc</span>';
    const messages = HTMLHint.verify(code, ruleOptions);
    expect(messages.length).to.be(0);
  });

  it("Code tag with special char should not result in an error", () => {
    const code = '<code>aaa>bbb<ccc</code>';
    const messages = HTMLHint.verify(code, ruleOptions);
    expect(messages.length).to.be(0);
  });

  it("Code tag without special char should not result in any error", () => {
    const code = '<code>aaa&gt;bbb&lt;ccc</code>';
    const messages = HTMLHint.verify(code, ruleOptions);
    expect(messages.length).to.be(0);
  });
});

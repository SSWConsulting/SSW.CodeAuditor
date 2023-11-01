const expect = require("expect.js");
const HTMLHint = require("htmlhint").default;

const ruldId = "figure-must-use-the-right-code";

const ruleOptions = {};

const { addCustomHtmlRule } = require("../customHtmlRules");

ruleOptions[ruldId] = true;

before(async () => {
  await addCustomHtmlRule();
});

describe(`Rules: ${ruldId}`, () => {
  it("Figures not wrapped in figcaption must result in an error", () => {
    const code = "<p>Figure: Caption</p>";
    const messages = HTMLHint.verify(code, ruleOptions);
    expect(messages.length).to.be(1);
  });

  it("Figures not wrapped in figcaption must result in an error", () => {
    const code = "<dd>Figure: Caption</dd> ";
    const messages = HTMLHint.verify(code, ruleOptions);
    expect(messages.length).to.be(1);
  });

  it("Figures wrapped in figcaption must not result in an error", () => {
    const code = "<figcaption>Figure: Caption</figcaption>";
    const messages = HTMLHint.verify(code, ruleOptions);
    expect(messages.length).to.be(0);
  });

  it("Figures wrapped in style tag should be ignored and must not result in an error", () => {
    const code = "<style>Figure: Caption</style>";
    const messages = HTMLHint.verify(code, ruleOptions);
    expect(messages.length).to.be(0);
  });
});

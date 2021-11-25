const expect = require("expect.js");
const HTMLHint = require("htmlhint").default;

const ruldId = "figure-must-use-the-right-code";

const ruleOptions = {};

const { addCustomHtmlRule } = require("../customHtmlRules");

ruleOptions[ruldId] = true;

describe(`Rules: ${ruldId}`, () => {
  addCustomHtmlRule();
  it("Figures not wrapped in figcaption must result in an error", () => {
    const code = " <p>Figure: Caption</p>";
    const messages = HTMLHint.verify(code, ruleOptions);
    expect(messages.length).to.be(1);
  });

  it("Figures wrapped in figcaption must not result in an error", () => {
    const code = "<figcaption>Figure: Caption</figcaption>";
    const messages = HTMLHint.verify(code, ruleOptions);
    expect(messages.length).to.be(0);
  });
});

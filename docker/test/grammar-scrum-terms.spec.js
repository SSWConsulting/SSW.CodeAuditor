const expect = require("expect.js");
const HTMLHint = require("htmlhint").default;

const ruldId = "grammar-scrum-terms";

const ruleOptions = {};

const { addCustomHtmlRule } = require("../customHtmlRules");

ruleOptions[ruldId] = true;

describe(`Rules: ${ruldId}`, () => {
  addCustomHtmlRule();
  it("Scrum terms that are cased correctly should not result in an error", () => {
    const code =
      "<p>Scrum, Sprint, Product Owner, Scrum Master, Product Backlog, Sprint Review, Sprint Planning, Sprint Retrospective, Sprint Retro, Specification Review, Spec Review</p>";
    const messages = HTMLHint.verify(code, ruleOptions);
    expect(messages.length).to.be(0);
  });

  it("Scrum terms that are cased correctly should result in an error", () => {
    const code =
      "<p>scrum, sprint, product owner, scrum master, product backlog, sprint review, sprint planning, sprint retrospective, sprint retro, specification review, spec review</p>";
    const messages = HTMLHint.verify(code, ruleOptions);
    expect(messages.length).to.be(11);
  });
});

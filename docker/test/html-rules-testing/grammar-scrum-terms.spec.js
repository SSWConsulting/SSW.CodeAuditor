const expect = require("expect.js");
const HTMLHint = require("htmlhint").default;

const ruldId = "grammar-scrum-terms";

const ruleOptions = {};

ruleOptions[ruldId] = true;

describe(`Rules: ${ruldId}`, () => {
  it("Scrum terms that are cased correctly should not result in an error", () => {
    const code =
      "<p>Scrum, Sprint, Product Owner, Scrum Master, Product Backlog, Sprint Review, Sprint Planning, Sprint Retrospective, Sprint Retro, Specification Review, Spec Review</p>";
    const messages = HTMLHint.verify(code, ruleOptions);
    expect(messages.length).to.be(0);
  });

  it("Scrum terms that are cased incorrectly should result in an error", () => {
    const code =
      "<p>scrum, sprint, product owner, scrum master, product backlog, sprint review, sprint planning, sprint retrospective, sprint retro, specification review, spec review</p>";
    const messages = HTMLHint.verify(code, ruleOptions);
    expect(messages.length).to.be(11);
  });

  it("long string contains the character should not result in an error", () => {
    const code = `<div>blahblahsprintblahblah</div>`;
    const messages = HTMLHint.verify(code, ruleOptions);
    expect(messages.length).to.be(0);
  });

  it("Incorrect Scrum terms in <a> tag should not result in an error", () => {
    const code =
      "<a href='sprint'>scrum, sprint, product owner</a>";
    const messages = HTMLHint.verify(code, ruleOptions);
    expect(messages.length).to.be(0);
  });

  ["a", "meta", "link", "script", "svg"].forEach((tag) => {
    it(`incorrect terms in a <${tag}> tag should not result in an error`, () => {
      const code = `<${tag}>scrum, sprint, product owner, scrum master, product backlog, sprint review, sprint planning, sprint retrospective, sprint retro, specification review, spec review</${tag}>`;
      const messages = HTMLHint.verify(code, ruleOptions);
      expect(messages.length).to.be(0);
    });
  });
});
const expect = require("expect.js");
const HTMLHint = require("htmlhint").default;

const ruleId = "phone-numbers-without-links";

const ruleOptions = {};

const { addCustomHtmlRule } = require("../customHtmlRules");

ruleOptions[ruleId] = true;

const phoneNumbers = [
  "(213) 373-4253",
  "(213)373-4253",
  "213-373-4253",
  "213.373.4253",
  "2133734253",
  "+12133734253",
  "121-33734253",
  "+61 2 9953 3000",
  "+61299533000",
  "+61 402 123 456"
];

describe(`Rules: ${ruleId}`, () => {
  addCustomHtmlRule();

  phoneNumbers.forEach((phone) => {
    it(`text containing "${phone}" without hyperlink should error`, () => {
      const code =
      `<div>
        <p>Call me here: ${phone}</p>
      </div>`;
      const messages = HTMLHint.verify(code, ruleOptions);
      expect(messages.length).to.be(1);
      expect(messages[0].line).to.be(2);
    });
  });

  phoneNumbers.forEach((phone) => {
    it(`link containing "${phone}" without hyperlink should error`, () => {
      const code = `<a>${phone}</a>`;
      const messages = HTMLHint.verify(code, ruleOptions);
      expect(messages.length).to.be(1);
      expect(messages[0].line).to.be(1);
    });
  });

  phoneNumbers.forEach((phone) => {
    it(`link containing "${phone}" with hyperlink should not error`, () => {
      const code = `<a href=\"tel:${phone}\">${phone}</a>`;
      const messages = HTMLHint.verify(code, ruleOptions);
      expect(messages.length).to.be(0);
    });
  });
});
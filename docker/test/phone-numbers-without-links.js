const expect = require("expect.js");
const HTMLHint = require("htmlhint").default;

const ruleId = "phone-numbers-without-links";

const ruleOptions = {};

const { addCustomHtmlRule } = require("../customHtmlRules");

ruleOptions[ruleId] = true;

const phoneNumbers = [
  "+61 2 9953 3000",
  "+61299533000",
  "+61 402 123 456",
  "13 00 00",
  "1800 160 401",
  "02 5550 4321",
  "+33 3 67 39 05 39"
];

const nonPhoneNumbers = [
  "2023.05.31.02",
  "123.456.7890",
  "1234.567.890",
  "20231024.16"
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
    it(`text containing "${phone}" in a non-text tag should not error`, () => {
      const code = `<style>${phone}</style><script>${phone}</script>`;
      const messages = HTMLHint.verify(code, ruleOptions);
      expect(messages.length).to.be(0);
    });
  });

  nonPhoneNumbers.forEach((phone) => {
    it(`text containing non-phone number "${phone}" without hyperlink should not error`, () => {
      const code =
      `<div>
        <p>${phone}</p>
      </div>`;
      const messages = HTMLHint.verify(code, ruleOptions);
      expect(messages.length).to.be(0);
    });
  });

  nonPhoneNumbers.forEach((phone) => {
    it(`text containing non-phone number "${phone}" in a non-text tag should not error`, () => {
      const code = `<style>${phone}</style><script>${phone}</script>`;
      const messages = HTMLHint.verify(code, ruleOptions);
      expect(messages.length).to.be(0);
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
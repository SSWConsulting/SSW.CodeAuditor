const expect = require('expect.js')
const HTMLHint = require("htmlhint").default;

const ruldId = 'page-must-not-show-email-addresses'

const ruleOptions = {}

const {addCustomHtmlRule} = require('../customHtmlRules')

ruleOptions[ruldId] = true

before(async () => {
  await addCustomHtmlRule();
});

describe(`Rules: ${ruldId}`, () => {
  it('Page that does not show email addresses should not result in an error', () => {
    const code = '<a href="...">email address</a>'
    const messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
  })

  it('Page that shows email address should result in an error', () => {
    const code = '<a href="...">tomisawesome@gmail.com</a>'
    const messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
  })

  it('Page that shows email address should result in an error', () => {
    const code = '<p>tomisawesome@gmail.com</p>'
    const messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
  })

  it('href that shows email address should result in an error', () => {
    const code = '<a href="tomisawesome@gmail.com">some email</a>'
    const messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
  })
})

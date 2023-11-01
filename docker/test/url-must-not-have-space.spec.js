const expect = require('expect.js')
const HTMLHint = require("htmlhint").default;

const ruldId = 'url-must-not-have-space'

const ruleOptions = {}

const {addCustomHtmlRule} = require('../customHtmlRules')

ruleOptions[ruldId] = true

before(async () => {
  await addCustomHtmlRule();
});

describe(`Rules: ${ruldId}`, () => {
  it('URL without space should not result in an error', () => {
    const code = '<a href="www.ssw.com.au/Thisisarule" />'
    const messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
  })

  it('URL with space should result in an error', () => {
    const code = '<a href="www.ssw.com.au/This is a rule" />'
    const messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
  })
})

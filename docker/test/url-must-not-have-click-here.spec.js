const expect = require('expect.js')
const HTMLHint = require("htmlhint").default;

const ruldId = 'url-must-not-have-click-here'

const ruleOptions = {}

const {addCustomHtmlRule} = require('../customHtmlRules')

ruleOptions[ruldId] = true

describe(`Rules: ${ruldId}`, () => {
  addCustomHtmlRule();
  it('URL text without words click here should not result in an error', () => {
    const code = '<a href="www.ssw.com.au/Thisisarule">Not Click Here</a>'
    const messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
  })

  it('URL text with words click here should result in an error', () => {
    const code = '<a href="www.ssw.com.au/Thisisarule">Click Here</a>'
    const messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
  })
})

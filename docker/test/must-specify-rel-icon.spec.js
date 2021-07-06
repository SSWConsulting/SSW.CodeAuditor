const expect = require('expect.js')
const HTMLHint = require("htmlhint").default;

const ruldId = 'must-specify-rel-icon'

const ruleOptions = {}

const {addCustomHtmlRule} = require('../customHtmlRules')

ruleOptions[ruldId] = true

describe(`Rules: ${ruldId}`, () => {
  addCustomHtmlRule();
  it('Page that specifies rel icon should not result in an error', () => {
    const code = '<link rel="icon" />'
    const messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
  })

  it('Page that does not specify rel icon should result in an error', () => {
    const code = '<link rel="shortcut" />'
    const messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
  })
})

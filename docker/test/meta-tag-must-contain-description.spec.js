const expect = require('expect.js')
const HTMLHint = require("htmlhint").default;

const ruldId = 'meta-tag-must-contain-description'

const ruleOptions = {}

const {addCustomHtmlRule} = require('../customHtmlRules')

ruleOptions[ruldId] = true

describe(`Rules: ${ruldId}`, () => {
  addCustomHtmlRule();
  it('Meta tags with description should not result in an error', () => {
    const code = '<meta name="description" content="...">'
    const messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
  })

  it('Meta tags without description should result in an error', () => {
    const code = '<meta name="something" content="...">'
    const messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
  })
})

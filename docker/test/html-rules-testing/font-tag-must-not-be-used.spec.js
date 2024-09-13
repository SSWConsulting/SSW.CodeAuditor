const expect = require('expect.js')
const { HTMLHint } = require("htmlhint");

const ruldId = 'font-tag-must-not-be-used'

const ruleOptions = {}

ruleOptions[ruldId] = true

describe(`Rules: ${ruldId}`, () => {
  it('Anything that is not font tag should not result in an error', () => {
    const code = '<p color="red">Text</p>'
    const messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
  })

  it('Anything that is not font tag should not result in an error', () => {
    const code = '<span color="red">Text</span>'
    const messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
  })

  it('Font tag should result in an error', () => {
    const code = '<font color="red">Text</font>'
    const messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
  })
})

const expect = require('expect.js')
const { HTMLHint } = require("htmlhint");

const ruldId = 'anchor-names-must-be-valid'

const ruleOptions = {}

ruleOptions[ruldId] = true

describe(`Rules: ${ruldId}`, () => {
  it('Anchor name starts with letter and contains no space should not result in an error', () => {
    const code = '<a name="ThisisAnchor">Anchor</a>'
    const messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
  })

  it('Anchor name starts with # should result in an error', () => {
    const code = '<a name="#Anchor">Anchor</a>'
    const messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
  })

  it('Anchor name starts with number should result in an error', () => {
    const code = '<a name="123Anchor">Anchor</a>'
    const messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
  })

  it('Anchor name that has space should result in an error', () => {
    const code = '<a name="This is Anchor">Anchor</a>'
    const messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
  })
})

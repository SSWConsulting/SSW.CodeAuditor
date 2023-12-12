const expect = require('expect.js')
const HTMLHint = require("htmlhint").default;

const ruldId = 'link-must-not-show-unc'

const ruleOptions = {}

ruleOptions[ruldId] = true

describe(`Rules: ${ruldId}`, () => {
  it('Href that does not show UNC should not result in an error', () => {
    const code = '<a href="/ssw">somelink</a>'
    const messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
  })

  it('Href that shows UNC should result in an error', () => {
    const code = '<a href="\\hippo/ssw">somelink</a>'
    const messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
  })
})

const expect = require('expect.js')
const HTMLHint = require("htmlhint").default;

const ruldId = 'link-must-be-descriptive'

const ruleOptions = {}

ruleOptions[ruldId] = true

var badLinkTerms = [
  "click here",
  "read this",
  "more",
  "link",
  "this",
  "here",
  "http://",
  "https://",
  "www.",
]

describe(`Rules: ${ruldId}`, () => {
  it('Descriptive URL should not result in an error', () => {
    const code = '<a href="www.ssw.com.au">ssw.com.au</a>'
    const messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
  })

  badLinkTerms.forEach(term => {
    it('Non-descriptive URLs should result in an error', () => {
      const code = `<a href="www.ssw.com.au">${term}</a>`
      const messages = HTMLHint.verify(code, ruleOptions)
      expect(messages.length).to.be(1)
    })
  })
})

const expect = require('expect.js')
const HTMLHint = require("htmlhint").default;

const ruldId = 'meta-tag-must-not-redirect'

const ruleOptions = {}

const {addCustomHtmlRule} = require('../customHtmlRules')

ruleOptions[ruldId] = true

before(async () => {
  await addCustomHtmlRule();
});

describe(`Rules: ${ruldId}`, () => {
  it('Meta tags that does not refresh should not result in an error', () => {
    const code = '<meta name="description" />'
    const messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
  })

  it('Meta tags that refresh should result in an error', () => {
    const code = '<meta http-equiv="refresh" content="5" />'
    const messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
  })
})

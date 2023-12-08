const expect = require('expect.js')
const HTMLHint = require("htmlhint").default;

const ruldId = 'code-block-missing-language'

const ruleOptions = {}

ruleOptions[ruldId] = true

describe(`Rules: ${ruldId}`, () => {
  it('Code block with data language specifier should not result in an error', () => {
    const code = '<pre data-language="javascript">Some Code</pre>'
    const messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
  })

  it('Code block with class language specifier should not result in an error', () => {
    const code = '<pre class="language-xml">Some Code</pre>'
    const messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
  })

  it('Code block without class language specifier should not result in an error', () => {
    const code = '<pre class="">Some Code</pre>'
    const messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
  })

  it('Code block without data language specifier should result in an error', () => {
    const code = '<pre data-language="">Some Code</pre>'
    const messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
  })
})

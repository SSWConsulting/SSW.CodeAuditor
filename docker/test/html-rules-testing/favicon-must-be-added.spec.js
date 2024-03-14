const expect = require('expect.js')
const HTMLHint = require("htmlhint").default;

const ruldId = 'favicon-must-be-added'

const ruleOptions = {}

ruleOptions[ruldId] = true

describe(`Rules: ${ruldId}`, () => {
  it('Page that includes favicon must not be reported', () => {
    const code = 
      `<head>
        <title>Page Title</title>
        <link rel="shortcut icon" href="/images/favicon.ico" type="image/x-icon" />
      </head>`
    const messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(0)
  })

  it('Page without favicon must be reported', () => {
    const code = 
      `<head>
        <title>Page Title</title>
        <link rel="shortcut" href="/images/favicon.ico" type="image/x-icon" />
      </head>`
    const messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
  })

  it('Page without favicon must be reported', () => {
    const code = 
    `<head>
      <title>Page Title</title>
      <link href="/images/favicon.ico" type="image/x-icon" />
    </head>`
    const messages = HTMLHint.verify(code, ruleOptions)
    expect(messages.length).to.be(1)
  })
})

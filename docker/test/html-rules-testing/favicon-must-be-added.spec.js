const expect = require('expect.js')
const HTMLHint = require("htmlhint").default; 
const { handleNoFavIcon } = require("../../utils")


const ruldId = 'favicon-must-be-added'

const ruleOptions = {}

ruleOptions[ruldId] = true

describe(`Rules: ${ruldId}`, () => {
  it('Page that includes favicon must not be reported', () => {
    const code = 
      `<head>
        <title>Page Title</title>
        <link rel="first" />
        <link rel="second" />
        <link rel="shortcut icon" href="/images/favicon.ico" type="image/x-icon" />
      </head>`
    let messages = [HTMLHint.verify(code, ruleOptions)]
    handleNoFavIcon(messages)
    expect(messages[0].length).to.be(0)
  })

  it('Page without favicon must be reported', () => {
    const code = 
      `<head>
        <title>Page Title</title>
        <link rel="first" />
        <link rel="second" />
        <link rel="shortcut" href="/images/favicon.ico" type="image/x-icon" />
      </head>`
      let messages = [HTMLHint.verify(code, ruleOptions)]
      handleNoFavIcon(messages)
      expect(messages[0].length).to.be(3)
  })

  it('Page without favicon must be reported', () => {
    const code = 
    `<head>
      <title>Page Title</title>
      <link href="/images/favicon.ico" type="image/x-icon" />
    </head>`
    let messages = [HTMLHint.verify(code, ruleOptions)]
    handleNoFavIcon(messages)
    expect(messages[0].length).to.be(1)
  })
})

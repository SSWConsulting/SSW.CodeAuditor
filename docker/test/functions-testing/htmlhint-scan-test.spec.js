const expect = require('expect.js')
const HTMLHint = require("htmlhint").default;
const { htmlHintConfig } = require("../../api");

const testHTML = `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Test Sites</title>
			<link rel="stylesheet" href="/styles/main.css">
		</head>
		<body>
			<h1>Testing Page!!!</h1>
			<h1>Links to test scraping function:</h1>
			<ul>
				<li><a href="https://htmlhint.com">HTML Hint</a></li>
				<li><a href="https://github.com">GitHub</a></li>
				<li><a href="https://ssw.com.au/">SSW</a></li>
			</ul>
			<h1>Sample misspelling terms to test HTML scanning function: </h1>
			<p>scrum, sprint, product owner, scrum master, product backlog, sprint review, sprint planning, sprint retrospective, sprint retro, specification review, spec review</p>
			<p>a.k.a A.K.A AKA e-mail EMail can not web site user name task bar</p>
		</body>
		</html>
	  `;

describe(`Test HTMLHint Scanning`, () => {
  it('Scanning for bad HTML', async () => {

    const htmlHintResult = HTMLHint.verify(testHTML, htmlHintConfig);

    expect(htmlHintResult.length).to.be(22);
  })
})

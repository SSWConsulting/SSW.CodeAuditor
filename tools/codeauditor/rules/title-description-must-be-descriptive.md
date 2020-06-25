---
id: 'ssw89'
title: 'The title tags need to be descriptive'
ruleUrl: 'http://www.ssw.com.au/ssw/CodeAuditor/'
ruleType: Script
fileFilter: '*.html;*.htm;*.aspx;*.asp'
shouldExists: false
isError: false
searchIn: 'content'
script: |
    const $ = cheerio.load(code, {
        xmlMode: true,
        withStartIndices: true,
    });

    function getText(node) {
        if (node.type === 'text') {
            return node.data;
        } else {
            if (node.childNodes) {
                return getText(node.childNodes[0]);
            }
        }
    }

    let errors = Array.from($('title,description'))
        .map((x) => {
            const text = getText(x);
            if (text.split(' ').length <= 3) {
                return code.substring(0, x.startIndex).split('\n').length;
            }
        })
        .filter((x) => !!x).join(',');
        
    module.exports = errors;
---

## The title and description tags need to be descriptive

For SEO, make sure your `title` and `description` tag must be descriptive (at least 3 words)

Examples of **incorrect** code for this rule:

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>My App</title>
	</head>
	<body></body>
</html>
```

Examples of **correct** code for this rule:

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>My really cool website which scan websites</title>
	</head>
	<body></body>
</html>
```

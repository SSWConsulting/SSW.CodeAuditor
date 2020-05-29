---
id: 'ssw88'
name: 'Disallow Null Comparisons (no-eq-null)'
ruleUrl: 'https://eslint.org/docs/rules/no-eq-null'
ruleType: Script
fileFilter: '*.js;*.ts'
shouldExists: false
isError: true
searchIn: 'content'
script: |
    const ast = tsParser(code, {
        loc: true,
    });

    let tnodes = [];
    esWalk(ast, (n) => tnodes.push(n));
    let errors = tnodes
        .filter(
            (n) =>
                n.type === 'BinaryExpression' &&
                (n.operator === '==' || n.operator === '!=') &&
                n.right.raw === 'null'
        )
        .map((n) => n.loc.start.line)
    .join(',');

    module.exports = errors;
---

## Rule Details

For SEO, make sure your title, description, h1 and h2 must be descriptive (at least 3 words)

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

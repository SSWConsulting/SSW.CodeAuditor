---
id: 'ssw88'
title: 'Disallow Null Comparisons (no-eq-null)'
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

## Disallow Null Comparisons (no-eq-null)

Comparing to `null` without a type-checking operator (`==` or `!=`), can have unintended results as the comparison will evaluate to true when comparing to not just a `null`, but also an `undefined` value.

```javascript
if (foo == null) {
  bar();
}

while (qux != null) {
  baz();
}
```

Examples of **correct** code for this rule:

```javascript
if (foo === null) {
  bar();
}

while (qux !== null) {
  baz();
}
```

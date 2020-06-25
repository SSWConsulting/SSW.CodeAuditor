---
id: 'ssw9'
title: 'Use triple equals instead of double equals'
ruleUrl: 'https://eslint.org/docs/rules/eqeqeq'
ruleType: Script
fileFilter: '*.js;*.ts'
shouldExists: false
isError: false
searchIn: 'content'
script: |
    const ast = tsParser(code, {
        loc: true,
    });

    let tnodes = [];
    esWalk(ast, (n) => tnodes.push(n));
    let errors = tnodes
        .filter((n) => n.type === 'BinaryExpression' && 
            (n.operator === '==' || n.operator === '!='))
        .map((n) => n.loc.start.line)
        .join(',');

    module.exports = errors;
---

## Use triple equals instead of double equalsv

This rule is aimed at eliminating the type-unsafe equality operators.

Examples of **incorrect** code for this rule:

```javascript
a == b
foo == true
bananas != 1
value == undefined
typeof foo == 'undefined'
'hello' != 'world'
0 == 0
true == true
foo == null
```

Examples of **correct** code for this rule:

```javascript
a === b
foo === true
bananas !== 1
value === undefined
typeof foo === 'undefined'
'hello' !== 'world'
0 === 0
true === true
foo === null
```

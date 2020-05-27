---
id: 'ssw26'
name: 'No empty catch blocks'
ruleUrl: 'https://eslint.org/docs/rules/no-empty'
ruleType: Regex
fileFilter: '*.cs;*.js;*.ts;*.xml'
shouldExists: false
isError: true
searchIn: 'content'
regex: "{(\\s|//.*)*}"
---

## Rule Details

This rule disallows empty `block` statements. This rule ignores block statements which contain a comment (for example, in an empty catch or finally block of a try statement to indicate that execution should continue regardless of errors).

Examples of **incorrect** code for this rule:

```csharp
try {
    doSomething();
} catch(ex) {

} finally {

}
```

Examples of **correct** code for this rule:

```csharp
try {
    doSomething();
} catch (ex) {
    doSomethingWhenError();
}
```

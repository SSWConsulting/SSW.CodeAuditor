---
id: 'ssw26'
name: 'Use String.Empty instead of ""'
ruleUrl: 'http://www.ssw.com.au/ssw/CodeAuditor/'
ruleType: Regex
fileFilter: '*.cs;*.js'
shouldExists: false
isError: true
searchIn: 'content'
regex: "catch\\s*\\(.*\\)\\s*{(\\s|//.*)*}"
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

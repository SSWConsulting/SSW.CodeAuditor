---
id: "ssw88"
name: "No catching specific Exceptions"
ruleUrl: "https://eslint.org/docs/rules/no-empty"
ruleType: Regex
fileFilter: "*.{cs,ts,js}"
shouldExists: false
isError: false
searchIn: "content"
regex: "catch\\s*\\(\\s*Exception\\s+"
---

## Rule Details
You should avoid catching generic exception, instead let it bubble up.

Examples of **incorrect** code for this rule:

``` csharp
try {
    doSomething();
} catch(Exception ex) {
    // some logic
} 
````
Examples of **correct** code for this rule:

``` csharp
try {
    doSomething();
} catch(IOException ex) {
    // some logic
} 
```

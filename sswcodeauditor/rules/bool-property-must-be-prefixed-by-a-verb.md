---
id: 'ssw26'
name: 'Boolean Properties must be prefixed by a verb'
ruleUrl: 'http://www.ssw.com.au/ssw/CodeAuditor/'
ruleType: Regex
fileFilter: '*.cs'
shouldExists: false
isError: true
searchIn: 'content'
regex: "(bool\\s*\\b(?!(?:Is|Has|Supports|Allow|Accept|Use|Visible|Available|Check|Exists|Can|Should|Success)|(?=\\b\\w*ed\\b)\\w*)(\\w+)\\s*(?:\\[\\])?\\s*\\{.*?\\})"
---

## Rule Details

Boolean properties should start with a verb

Examples of **correct** code for this rule:

```csharp
public bool Home { get; set; }
```

Examples of **correct** code for this rule:

```csharp
public bool HasHome { get; set; }
```

<script>
    import * as marked from "marked";

  const addingCustomRule = `
  # How to Add Custom HTML Hint Rules
  #### 1. Go to our GitHub and clone the project at https://github.com/SSWConsulting/SSW.CodeAuditor
  #### 2. Have a look at [HtmlHint Rules](https://github.com/htmlhint/HTMLHint/tree/master/src/core/rules) to view sample existing rules
  #### 3. In your local repo, go to \`\`\` docker/customHtmlRules.js \`\`\`
  #### 4. Add your custom Rule under \`\`\`// Add new custom rule below\`\`\` using the following template:  
  \`\`\` js
  HTMLHint.addRule({
        id: "your-custom-rule-id",
        description: "Your custom rule description",
        init: function (parser, reporter) {
          // Your rule logic
        }
      })
  \`\`\`
  **IMPORTANT:** <br />
  Use \`\`\` reporter.warn \`\`\` if you want to report your custom rule violation as a **warning** <br />
  Use \`\`\` reporter.error \`\`\` if you want to report your custom rule violation as a **error**

  #### 5. Go to \`\`\`docker/api.js\`\`\`: On the last export named \`\`\`htmlHintConfig\`\`\`, add your new custom rule id to the list using the following format:
  \`\`\` js
  exports.htmlHintConfig = {
    your-custom-rule-id: true,
    ...
    }
  \`\`\`
  #### 6. Go to \`\`\`constants/rules.js\`\`\` On the last export named \`\`\`customHtmlHintRules\`\`\` add your new custom rule id to the list using the following format:
  \`\`\` js
  export const customHtmlHintRules = [
   { rule: "your-custom-rule-id" },	
   ...
  ];
  \`\`\`
  #### 7. Make a Pull Request and have it checked by CodeAuditor Team`;
</script>

<article class="markdown-body">
  {@html marked.parse(addingCustomRule)}
</article>
<article class="markdown-body mt-8">
  <h3>Video - How To Add, Test and Deploy Custom HTML Rules (For Devs):</h3>
  <div>
    <iframe class="max-w-full" width="560" height="315" src="https://www.youtube.com/embed/iduwnyzdcFo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
  </div>
</article>
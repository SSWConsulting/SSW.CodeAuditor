const HTMLHint = require("htmlhint").default;

exports.addCustomHtmlRule = () => {
    // Custom rule to find code block with no language specifier
    HTMLHint.addRule({
        id: "code-block-missing-language",
        description: "Code blocks must contain a language specifier.",
        init: function (parser, reporter) {
          var self = this;

          parser.addListener("tagstart", function (event) {
            var tagName = event.tagName.toLowerCase(),
              mapAttrs = parser.getMapAttrs(event.attrs),
              col = event.col + tagName.length + 1;
            if (tagName === "pre" || tagName === "code") {
              if (
                !("class" in mapAttrs) ||
                !mapAttrs["class"].includes("language")
              ) {
                reporter.warn(
                  "Code blocks must contain a language specifier.",
                  event.line,
                  col,
                  self,
                  event.raw
                );
              }
            }
          });
        },
      });

      HTMLHint.addRule({
        id: "grammar-scrum-terms",
        description: "Checks case of common Agile Scrum terms that people get wrong.",
        init: function (parser, reporter) {
          var self = this;
  
          parser.addListener("text", function (event) {
            var scrumTerms = ["scrum", "sprint", "product owner", "scrum master", "product backlog", "sprint review", "sprint planning", "sprint retrospective"];
  
            if(event.raw) {
              let pageContent = event.raw;
  
              scrumTerms.forEach(i => {
                var contentIndex = pageContent.indexOf(i);

                if(contentIndex >= 0) {
                  var col = event.col + contentIndex - 1;  

                  reporter.warn(
                    "Incorrect Scrum term: '" + i + "'.",
                    event.line,
                    col,
                    self,
                    event.raw
                  );
                }
              });
            }
          });
        },
      });

    HTMLHint.addRule({
      id: "figure-format",
      description: "Checks if Figure statement is in correct format.",
      init: function (parser, reporter) {
        var self = this;

        parser.addListener("all", function (event) {
          if (event.tagName) {
            if (event.lastEvent.raw.startsWith('Figure:')) {
              console.log(event)
              if (
                !(event.tagName === "p" || event.tagName === "figcaption"
                || event.tagName === "a" || event.tagName === "div") 
                ) {
                  reporter.warn(
                    "Incorrect Figure Format.",
                    event.line,
                    event.col,
                    self,
                    event.raw
                  );
              } 
            }
          }
        });
      },
    });
    // Add new custom rule below 

}
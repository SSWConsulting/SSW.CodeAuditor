const HTMLHint = require("htmlhint").default;

exports.addCustomHtmlRule = () => {
    HTMLHint.addRule({
        id: "code-block-missing-language",
        description: "Code blocks must contain a language specifier.",
        init: function (parser, reporter) {
          var self = this;

          parser.addListener("tagstart", function (event) {
            var tagName = event.tagName.toLowerCase(),
              mapAttrs = parser.getMapAttrs(event.attrs),
              col = event.col + tagName.length + 1;
            if (tagName === "pre") {
              if (
                (!("class" in mapAttrs) ||
                !mapAttrs["class"].includes("language"))  &&
                (!("data-language" in mapAttrs) ||
                (mapAttrs["data-language"] === ""))
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
        id: "anchor-names-must-be-valid",
        description: "Anchor names must start with a letter, contain no space and must not start with #.",
        init: function (parser, reporter) {
          var self = this;

          parser.addListener("tagstart", function (event) {
            var tagName = event.tagName.toLowerCase(),
              mapAttrs = parser.getMapAttrs(event.attrs),
              col = event.col + tagName.length + 1;
            const re = /^[a-zA-Z]/; // start with a letter
            if (tagName === "a") {
              if (mapAttrs["name"]) {
                if (!(re.test(mapAttrs["name"])) || mapAttrs["name"].startsWith('#') || (mapAttrs["name"].indexOf(' ') >= 0)) {
                  reporter.warn(
                    "Anchor names must be valid.",
                    event.line,
                    col,
                    self,
                    event.raw
                  );
                }
              }
            }
          });
        },
      });
      
    HTMLHint.addRule({
        id: "meta-tag-must-not-redirect",
        description: "Checks Meta tags to not be used to refresh or redirect.",
        init: function (parser, reporter) {
          var self = this;
 
          parser.addListener("tagstart", function (event) {
            var tagName = event.tagName.toLowerCase(),
            mapAttrs = parser.getMapAttrs(event.attrs),
            col = event.col + tagName.length + 1;
            if (tagName === "meta") {
              if (
                (("http-equiv" in mapAttrs) &&
                mapAttrs["http-equiv"].includes("refresh")) 
              ) {
                reporter.warn(
                  "Meta tags should not be used to refresh or redirect.",
                  event.line,
                  col,
                  self,
                  event.raw
                );
              }
            }
          });
        }
      });

    HTMLHint.addRule({
        id: "font-tag-must-not-be-used",
        description: "Font tags must not be used.",
        init: function (parser, reporter) {
          var self = this;

          parser.addListener("tagstart", function (event) {
            var tagName = event.tagName.toLowerCase(),
            col = event.col + tagName.length + 1;
            if (tagName === "font") {
              reporter.warn(
                "Font tag must not be used.",
                event.line,
                col,
                self,
                event.raw
              );
            }
          });
        },
      });

    HTMLHint.addRule({
        id: "meta-tag-must-contain-description",
        description: "Pages must contain META description.",
        init: function (parser, reporter) {
          var self = this;
 
          parser.addListener("tagstart", function (event) {
            var tagName = event.tagName.toLowerCase(),
            mapAttrs = parser.getMapAttrs(event.attrs),
            col = event.col + tagName.length + 1;
            if (tagName === "meta") {
              if (mapAttrs["name"]) {
                if (!mapAttrs["name"].toLowerCase() === "description") {
                  reporter.warn(
                    "Pages must contain META description.",
                    event.line,
                    col,
                    self,
                    event.raw
                  );
                }
              }
            }
          });
        }
      });

    HTMLHint.addRule({
        id: "url-must-not-have-space",
        description: "URLs must not have space.",
        init: function (parser, reporter) {
          var self = this;

          parser.addListener("tagstart", function (event) {
            var tagName = event.tagName.toLowerCase(),
              mapAttrs = parser.getMapAttrs(event.attrs),
              col = event.col + tagName.length + 1;
            if (tagName === "a") {
              if (mapAttrs["href"]) {
                if (mapAttrs["href"].indexOf(' ') >= 0) {
                  reporter.warn(
                    "URLs must not have space.",
                    event.line,
                    col,
                    self,
                    event.raw
                  );
                }
              }
            }
          });
        },
      });

    HTMLHint.addRule({
        id: "url-must-not-have-click-here",
        description: "URLs must not use word click here.",
        init: function (parser, reporter) {
          var self = this;

          parser.addListener("all", function (event) {
            if (event.tagName === "a") {
              if (event.lastEvent.raw) {
                if (event.lastEvent.raw.toLowerCase() === "click here") {
                  reporter.warn(
                    "URLs must not use word click here.",
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

    HTMLHint.addRule({
        id: "page-must-not-show-email-addresses",
        description: "Page must not show email addresses.",
        init: function (parser, reporter) {
          var self = this;

          parser.addListener("text", function (event) {
            const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (event.raw) {
              if (re.test(event.raw.toLowerCase())) {
                reporter.warn(
                  "Page must not show email addresses.",
                  event.line,
                  event.col,
                  self,
                  event.raw
                );
              }
            }
          });
        },
      });

    HTMLHint.addRule({
        id: "link-must-not-show-unc",
        description: "Link must not show UNC.",
        init: function (parser, reporter) {
          var self = this;

          parser.addListener("tagstart", function (event) {
            var tagName = event.tagName.toLowerCase(),
              mapAttrs = parser.getMapAttrs(event.attrs),
              col = event.col + tagName.length + 1;
            if (tagName === 'a') {
              if (mapAttrs['href']) {
                if (mapAttrs['href'].startsWith('\\')) {
                  reporter.warn(
                    "URLs must not use word click here.",
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

    HTMLHint.addRule({
        id: "must-specify-rel-icon",
        description: "Page must specify rel icon.",
        init: function (parser, reporter) {
          var self = this;

          parser.addListener("tagstart", function (event) {
            var tagName = event.tagName.toLowerCase(),
              mapAttrs = parser.getMapAttrs(event.attrs),
              col = event.col + tagName.length + 1;
            if (tagName === 'link') {
              if (mapAttrs['rel']) {
                if (!mapAttrs['rel'].includes('icon')) {
                  reporter.warn(
                    "Page must specify rel icon.",
                    event.line,
                    col,
                    self,
                    event.raw
                  );
                }
              }
            }
          });
        },
      });

    HTMLHint.addRule({
        id: "page-must-have-doctype",
        description: "HTML pages must have DocType.",
        init: function (parser, reporter) {
          var self = this;

          parser.addListener("tagstart", function (event) {
            var tagName = event.tagName.toLowerCase(),
              col = event.col + tagName.length + 1;
            if (tagName === '!DOCTYPE') {
              reporter.warn(
                "HTML pages must have DocType.",
                event.line,
                col,
                self,
                event.raw
              );
            }
          });
        },
      });
    // Add new custom rule below 
}
const { getCustomHtmlRuleOptions } = require("./api");
const HTMLHint = require("htmlhint").default;
const findPhoneNumbersInText = require('libphonenumber-js').findPhoneNumbersInText;
const { customHtmlHintRules } = require("./rules");
const { CONSTANTS } = require("./utils")

exports.addCustomHtmlRule = async (apiToken, url) => {
  const customRuleOptions = apiToken && url ? await getCustomHtmlRuleOptions(apiToken, url) : [];

  HTMLHint.addRule({
    id: "code-block-missing-language",
    description: "Code blocks must contain a language specifier.",
    init: function (parser, reporter) {
      var self = this;

      parser.addListener("tagstart", (event) => {
        var tagName = event.tagName.toLowerCase(),
          mapAttrs = parser.getMapAttrs(event.attrs),
          col = event.col + tagName.length + 1;
        if (tagName === "pre") {
          if (
            (!("class" in mapAttrs) ||
              !mapAttrs["class"].includes("language")) &&
            (!("data-language" in mapAttrs) || mapAttrs["data-language"] === "")
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
    description:
      "Checks case of common Agile Scrum terms that people get wrong.",
    init: function (parser, reporter) {
      var self = this;

      parser.addListener("text", (event) => {
        var scrumTerms = [
          "scrum",
          "sprint",
          "product owner",
          "scrum master",
          "product backlog",
          "sprint review",
          "sprint planning",
          "sprint retrospective",
          "sprint retro",
          "specification review",
          "spec review"
        ];

        if (event.raw) {
          const pageContent = event.raw;
          if (event.lastEvent) {
            if (
              event.lastEvent.tagName !== "a" && 
              event.lastEvent.tagName !== "meta" && 
              event.lastEvent.tagName !== "link" && 
              event.lastEvent.tagName !== "script" && 
              event.lastEvent.tagName !== "svg" &&
              event.lastEvent.tagName !== "figcaption"
            ) {
              scrumTerms.forEach((i) => {
                var contentIndex = pageContent.indexOf(i);

                let regex = new RegExp("\\b" + i + "\\b");
                
                const col = event.col + contentIndex;

                if ((regex.test(pageContent))) {
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
          }
        }
      });
    },
  });

  HTMLHint.addRule({
    id: "anchor-names-must-be-valid",
    description:
      "Anchor names must start with a letter, contain no space and must not start with #.",
    init: function (parser, reporter) {
      var self = this;

      parser.addListener("tagstart", (event) => {
        var tagName = event.tagName.toLowerCase(),
          mapAttrs = parser.getMapAttrs(event.attrs),
          col = event.col + tagName.length + 1;
        const re = /^[a-zA-Z]/; // start with a letter
        if (tagName === "a") {
          if (mapAttrs["name"]) {
            if (
              !re.test(mapAttrs["name"]) ||
              mapAttrs["name"].startsWith("#") ||
              mapAttrs["name"].indexOf(" ") >= 0
            ) {
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

      parser.addListener("tagstart", (event) => {
        var tagName = event.tagName.toLowerCase(),
          mapAttrs = parser.getMapAttrs(event.attrs),
          col = event.col + tagName.length + 1;
        if (tagName === "meta") {
          if (
            "http-equiv" in mapAttrs &&
            mapAttrs["http-equiv"].includes("refresh")
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
    },
  });

  HTMLHint.addRule({
    id: "font-tag-must-not-be-used",
    description: "Font tags must not be used.",
    init: function (parser, reporter) {
      var self = this;

      parser.addListener("tagstart", (event) => {
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
    id: "url-must-not-have-space",
    description: "URLs must not have space.",
    init: function (parser, reporter) {
      var self = this;

      parser.addListener("tagstart", (event) => {
        var tagName = event.tagName.toLowerCase(),
          mapAttrs = parser.getMapAttrs(event.attrs),
          col = event.col + tagName.length + 1;
        if (tagName === "a") {
          if (mapAttrs["href"]) {
            if (mapAttrs["href"].indexOf(" ") >= 0) {
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
    id: "link-must-be-descriptive",
    description: "Links must be descriptive.",
    init: function (parser, reporter) {
      var self = this;

      var badLinkTerms = [
        "click here",
        "read this",
        "more",
        "link",
        "this",
        "here",
        "http://",
        "https://",
        "www.",
      ]

      parser.addListener("all", (event) => {
        if (event.tagName === "a") {
          if (event.lastEvent.raw) {
            badLinkTerms.forEach(term => {
              if (event.lastEvent.raw.toLowerCase() === term) {
                reporter.warn(
                  "Links must be descriptive.",
                  event.line,
                  event.col,
                  self,
                  event.raw
                );
              }
            })
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
      const re =/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      // All texts that contain email addresses should be reported
      parser.addListener("text", (event) => {
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

      // All href attributes that contain email addresses should be reported
      parser.addListener("tagstart", (event) => {
        var tagName = event.tagName.toLowerCase(),
          mapAttrs = parser.getMapAttrs(event.attrs),
          col = event.col + tagName.length + 1;
        if (tagName === "a") {
          if (mapAttrs["href"]) {
            if (re.test(mapAttrs["href"].toLowerCase())) {
              reporter.warn(
                "Page must not show email addresses.",
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
    id: "link-must-not-show-unc",
    description: "Link must not show UNC.",
    init: function (parser, reporter) {
      var self = this;

      parser.addListener("tagstart", (event) => {
        var tagName = event.tagName.toLowerCase(),
          mapAttrs = parser.getMapAttrs(event.attrs);
        if (tagName === "a") {
          if (mapAttrs["href"]) {
            if (mapAttrs["href"].startsWith("\\")) {
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
    id: "url-must-be-formatted-correctly",
    description: "URLs must be formatted correctly.",
    init: function (parser, reporter) {
      var self = this;

      parser.addListener("tagstart", (event) => {
        var tagName = event.tagName.toLowerCase(),
          mapAttrs = parser.getMapAttrs(event.attrs);
        if (tagName === "a") {
          if (mapAttrs["href"] && mapAttrs["href"] !== "/") {
            if (
              mapAttrs["href"].substr(mapAttrs["href"].length - 1) === "/" ||
              mapAttrs["href"].substr(mapAttrs["href"].length - 1) === "."
            ) {
              reporter.warn(
                "URLs must be formatted correctly.",
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

  // Rule disabled
  // HTMLHint.addRule({
  //   id: "youtube-url-must-be-used-correctly",
  //   description: "Youtube video url should be used correctly.",
  //   init: function (parser, reporter) {
  //     var self = this;

  //     parser.addListener("tagstart", (event) => {
  //       var tagName = event.tagName.toLowerCase(),
  //         mapAttrs = parser.getMapAttrs(event.attrs);
  //       if (tagName === "a") {
  //         if (mapAttrs["href"]) {
  //           if (mapAttrs["href"].includes("youtube.com/embed/")) {
  //             reporter.warn(
  //               "Youtube url must be used correctly.",
  //               event.line,
  //               event.col,
  //               self,
  //               event.raw
  //             );
  //           }
  //         }
  //       }
  //     });
  //   },
  // });

  HTMLHint.addRule({
    id: "figure-must-use-the-right-code",
    description:
      "Figures - Do you use the right HTML/CSS code to add images and captions.",
    init: function (parser, reporter) {
      var self = this;

      parser.addListener("all", (event) => {
        if (event) {
          if (event.raw && event.raw.includes("Figure:")) {
            if (event.lastEvent && event.lastEvent.tagName !== 'style' && event.lastEvent.tagName !== "figcaption") {
              reporter.warn(
                "Figures must use the right code.",
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
    id: "detect-absolute-references-url-path-correctly",
    description:
      "Detect absolute references URL path correctly.",
    init: function (parser, reporter) {
      var self = this;

      parser.addListener("tagstart", (event) => {
        var tagName = event.tagName.toLowerCase(),
        mapAttrs = parser.getMapAttrs(event.attrs);
        const ruleId = "detect-absolute-references-url-path-correctly";
        if (tagName === "a") {
          if (mapAttrs["href"]) {
            // Check if custom options exist in this rule
            let optionValue = '';
            if (customRuleOptions && customRuleOptions.length > 0 && customRuleOptions.filter(option => option.ruleId === ruleId).length > 0) {
              optionValue = customRuleOptions.find(option => option.ruleId === ruleId).optionValue
            }
            if (mapAttrs["href"].startsWith(optionValue.length > 0 ? optionValue : url)) {
              if (!mapAttrs["href"].startsWith("/")) {
              reporter.warn(
                "URLs must be formatted to direct to a url path correctly.",
                event.line,
                event.col,
                self,
                event.raw
              );  
              }
            }
          }
        }
      });
    },
  });

  HTMLHint.addRule({
    id: "use-unicode-hex-code-for-special-html-characters",
    description:
      "Content - Use Unicode Hex code for special HTML characters.",
    init: function (parser, reporter) {
      parser.addListener('text', (event) => {
        const raw = event.raw
        const reSpecChar = /([<>])|( \& )/g
        let match

        if (!(event.lastEvent.type === 'tagstart' && event.lastEvent.tagName === 'code')) {
          while ((match = reSpecChar.exec(raw))) {
            const fixedPos = parser.fixPos(event, match.index)
            reporter.error(
              `Special characters must be escaped : [ ${match[0]} ].`,
              fixedPos.line,
              fixedPos.col,
              this,
              event.raw
            )
          }
        }
      })
    },
  });

  HTMLHint.addRule({
    id: "common-spelling-mistakes",
    description:
      "Checks common spelling mistakes.",
    init: function (parser, reporter) {
      var self = this;

      parser.addListener("text", (event) => {
        const ruleId = "common-spelling-mistakes";
        let optionValue = customRuleOptions?.find(option => option.ruleId === ruleId)?.optionValue;
        let customOptions = [];
        const defaultValue = customHtmlHintRules?.find(rule => rule.rule === ruleId)?.customOptionDefaultValue || [];
        // Check if custom options exist in this rule
        if (optionValue?.length) {
          customOptions = optionValue.split(',').filter(i => i);
        }
        const spellings = customOptions.length ? optionValue : defaultValue;

        if (event.raw) {
          const pageContent = event.raw;
          if (event.lastEvent) {
            if (
              event.lastEvent.tagName !== "a" && 
              event.lastEvent.tagName !== "meta" && 
              event.lastEvent.tagName !== "link" && 
              event.lastEvent.tagName !== "script" && 
              event.lastEvent.tagName !== "svg" &&
              event.lastEvent.tagName !== "figcaption"
            ) {
              spellings.forEach((i) => {
                var contentIndex = pageContent.indexOf(i);

                let regex = new RegExp("\\b" + i + "\\b");
                
                const col = event.col + contentIndex;
                
                if ((regex.test(pageContent))) {
                  reporter.warn(
                    "Incorrect terms: '" + i + "'.",
                    event.line,
                    col,
                    self,
                    event.raw
                  );
                }
              });
            }
          }
        }
      });
    },
  });

  HTMLHint.addRule({
    id: "phone-numbers-without-links",
    description:
      "Checks for phone numbers that aren't in hyperlinks with a \"tel:\" prefix.",
      init: function (parser, reporter) {
        const self = this;
        const ruleId = "phone-numbers-without-links";
        let isInCodeBlock = false;
        let optionValue = '';
        const defaultValue = customHtmlHintRules?.find(rule => rule.rule === ruleId)?.customOptionDefaultValue || '';

        parser.addListener("tagstart", (event) => {
          // Check if custom options exist in this rule
          if (customRuleOptions && customRuleOptions.length > 0 && customRuleOptions.filter(option => option.ruleId === ruleId).length > 0) {
            optionValue = customRuleOptions.find(option => option.ruleId === ruleId).optionValue
          }
          const tagName = event.tagName.toLowerCase();
          if (tagName === "code") {
            isInCodeBlock = true;
          }
        });

        parser.addListener("tagend", (event) => {
          const tagName = event.tagName.toLowerCase();
          if (tagName === "code") {
            isInCodeBlock = false;
          }
        });

        parser.addListener("text", (event) => {
          // Replace "." and "/" characters to avoid false positives when parsing phone numbers
          const text = event.raw?.replace(/\.|\//g, "_");
          if (text && event.lastEvent) {
            const foundPhoneNumbers = findPhoneNumbersInText(text, optionValue.length > 0 ? optionValue : defaultValue);

            foundPhoneNumbers.forEach((phone) => {
              const pageContent = event.lastEvent.raw;
              if (pageContent && event.lastEvent.tagName) {
                const tagName = event.lastEvent.tagName.toLowerCase();
                const mapAttrs = parser.getMapAttrs(event.lastEvent.attrs);
                const href = mapAttrs["href"];
                const isLink = tagName === "a";
                const isTelLink = isLink && href && href.startsWith("tel:");
                
                if (!(isTelLink || isInCodeBlock)) {
                  reporter.warn(
                    "Phone number must be in a hyperlink.",
                    event.line,
                    event.col + phone.startsAt - 1,
                    self,
                    event.raw
                  );
                }
              }
            });
          }
        });
      },
  });

  HTMLHint.addRule({
    id: "auth-terms-spelling-mistakes",
    description:
      "Checks common authentication terms.",
    init: function (parser, reporter) {
      var self = this;

      parser.addListener("text", (event) => {
        const spellings = [
          'log on',
          'logon',
          'log in',
          'Log on',
          'Logon',
          'Log in',
        ];
        if (event.raw) {
          const pageContent = event.raw;
          if (event.lastEvent) {
            if (
              event.lastEvent.tagName !== "a" && 
              event.lastEvent.tagName !== "meta" && 
              event.lastEvent.tagName !== "link" && 
              event.lastEvent.tagName !== "script" && 
              event.lastEvent.tagName !== "svg" &&
              event.lastEvent.tagName !== "figcaption"
            ) {
              spellings.forEach((i) => {
                var contentIndex = pageContent.indexOf(i);

                let regex = new RegExp("\\b" + i + "\\b");
                
                const col = event.col + contentIndex;
                
                if ((regex.test(pageContent))) {
                  reporter.warn(
                    "Incorrect terms: '" + i + "'.",
                    event.line,
                    col,
                    self,
                    event.raw
                  );
                }
              });
            }
          }
        }
      });
    },
  });

  HTMLHint.addRule({
    id: "favicon-must-be-added",
    description:
      "Detect missing favicon in your website.",
    init: function (parser, reporter) {
      var self = this;

      let headBegin = false;
  
      parser.addListener("tagstart", (event) => {
        let tagName = event.tagName.toLowerCase(),
        mapAttrs = parser.getMapAttrs(event.attrs);
        if (tagName === 'head') {
          headBegin = true
        } 
        
        if (headBegin && tagName === 'link') {
          if (mapAttrs["rel"]) {
            if (mapAttrs["rel"].includes('icon')) {
              reporter.warn(
                CONSTANTS.FoundFavIconMsg,
                event.line,
                event.col,
                self,
                event.raw
              );
            } else {
              reporter.warn(
                CONSTANTS.NoFavIconMsg,
                event.line,
                event.col,
                self,
                event.raw
              );
            }
          } else {
            reporter.warn(
              CONSTANTS.NoFavIconMsg,
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
  // Add new custom rule below
};
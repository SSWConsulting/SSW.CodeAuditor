const HTMLHint = require("htmlhint").default;

exports.addCustomHtmlRule = () => {
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
          let pageContent = event.raw;

          scrumTerms.forEach((i) => {
            var contentIndex = pageContent.indexOf(i);

            if (contentIndex >= 0) {
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
    id: "url-must-not-have-click-here",
    description: "URLs must not use word click here.",
    init: function (parser, reporter) {
      var self = this;

      parser.addListener("all", (event) => {
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
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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
          if (mapAttrs["href"]) {
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

  HTMLHint.addRule({
    id: "youtube-url-must-be-used-correctly",
    description: "Youtube video url should be used correctly.",
    init: function (parser, reporter) {
      var self = this;

      parser.addListener("tagstart", (event) => {
        var tagName = event.tagName.toLowerCase(),
          mapAttrs = parser.getMapAttrs(event.attrs);
        if (tagName === "a") {
          if (mapAttrs["href"]) {
            if (mapAttrs["href"].includes("/embed/")) {
              reporter.warn(
                "Youtube url must be used correctly.",
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
    id: "figure-must-use-the-right-code",
    description:
      "Figures - Do you use the right HTML/CSS code to add images and captions.",
    init: function (parser, reporter) {
      var self = this;

      parser.addListener("all", (event) => {
        if (event) {
          if (event.raw && event.raw.includes("Figure:")) {
            if (event.lastEvent && event.lastEvent.tagName !== "figcaption") {
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
  // Add new custom rule below
};

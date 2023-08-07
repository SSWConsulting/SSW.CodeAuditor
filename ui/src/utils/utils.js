import {
  pipe,
  converge,
  zipWith,
  map,
  mergeAll,
  uniq,
  join,
  filter,
  head,
  keys,
  values,
  groupBy,
  flatten,
  tap,
  prop,
  when,
  propSatisfies,
  gt,
  takeLast,
  prepend,
  __,
} from "ramda";

export const truncate = (len) =>
  when(
    propSatisfies(gt(__, len), "length"),
    pipe(takeLast(len), prepend("…"), join(""))
  );

export function isValidEmail(value) {
  if (!value) return true;
  const pattern =
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return value && pattern.test(value);
}

export const newGuid = () => {
  const S4 = () =>
    (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-4" +
    S4().substr(0, 3) +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  ).toLowerCase();
};

export const CONSTS = {
  USERS: "users",
  API: __myapp.env.API,
  API2: __myapp.env.API2,
  DEPLOYMENTS_URL: __myapp.env.DEPLOYMENTS_URL,
  BlobURL: "https://codeauditorstorage.blob.core.windows.net",
  URLChecker: "https://urlchecker.blob.core.windows.net",
};

export const printTimeDiff = (took) =>
  Math.floor((took || 0) / 60)
    .toString()
    .padStart(0, "0") +
  "m " +
  Math.floor((took || 0) % 60)
    .toString()
    .padStart(2, "0") +
  "s";

export const updateQuery = (q) => {
  if (history.pushState) {
    var newurl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      "?" +
      q;
    window.history.pushState(
      {
        path: newurl,
      },
      "",
      newurl
    );
  }
};

export const getPerfScore = (value) => ({
  performanceScore: Math.round(value.performanceScore * 100),
  pwaScore: Math.round(value.pwaScore * 100),
  seoScore: Math.round(value.seoScore * 100),
  accessibilityScore: Math.round(value.accessibilityScore * 100),
  bestPracticesScore: Math.round(value.bestPracticesScore * 100),
  average: Math.round(
    ((value.performanceScore +
      value.seoScore +
      value.bestPracticesScore +
      value.accessibilityScore +
      value.pwaScore) /
      5) *
      100
  ),
});

export const getArtilleryResult = (value) => ({
  timestamp: value.timestamp,
  scenariosCreated: value.scenariosCreated,
  scenariosCompleted: value.scenariosCompleted,
  requestsCompleted: value.requestsCompleted,
  latencyMedian: value.latencyMedian,
  rpsCount: value.rpsCount,
});

export const getLoadThresholdResult = (value) => ({
  latencyMedian: value.latencyMedian,
  latencyP95: value.latencyP95,
  latencyP99: value.latencyP99,
  errors: value.errors,
});

export const isInIgnored = (url, list) => {
  function glob(pattern, input) {
    var re = new RegExp(
      pattern.replace(/([.?+^$[\]\\(){}|\/-])/g, "\\$1").replace(/\*/g, ".*")
    );
    return re.test(input);
  }
  const date = new Date();
  for (let index = 0; index < list.length; index++) {
    const item = list[index];
    const pattern = item.urlToIgnore;
    if (glob(pattern, url)) {
      const effectiveFrom = new Date(item.effectiveFrom);
      const timelapsed = (date - effectiveFrom) / 86400000;
      if (
        (item.ignoreDuration > 0 && timelapsed < item.ignoreDuration) ||
        item.ignoreDuration === -1
      ) {
        console.log("Remaing days", item.ignoreDuration - timelapsed);
        return true;
      }
    }
  }
  return null;
};

export const getHtmlIssuesDescriptions = pipe(
  JSON.parse,
  converge(
    zipWith((x, y) => ({
      error: x,
      count: y,
    })),
    [keys, values]
  ),
  map((x) => `"${x.error}" : ${x.count}`),
  join("\n")
);

export const getCodeIssuesDescriptions = pipe(
  converge(
    zipWith((x, y) => ({
      error: x,
      count: y,
    })),
    [keys, values]
  ),
  map((x) => `"${x.error}" : ${x.count}`),
  join("\n")
);

export const getHtmlErrorsByReason = pipe(
  map((x) => {
    return Object.keys(x.errors).reduce((pre, curr) => {
      pre = [
        ...pre,
        {
          error: curr,
          url: x.url,
          locations: x.errors[curr],
        },
      ];
      return pre;
    }, []);
  }),
  map(values),
  flatten,
  groupBy(prop("error")),
  converge(
    zipWith((k, v) => ({
      error: k,
      pages: v,
    })),
    [keys, values]
  )
);

export const getCodeSummary = (value) => {
  let summary = {};
  if (value.codeIssues) {
    const data = value.codeIssues ? JSON.parse(value.codeIssues) : null;
    summary = {
      ...summary,
      code: true,
      codeErrors: Object.keys(data).filter((x) => x.startsWith("Error - "))
        .length,
      codeWarnings: Object.keys(data).filter((x) => x.startsWith("Warn - "))
        .length,
      codeIssueList: "Code Issues:\n" + getCodeIssuesDescriptions(data),
    };
  }

  if (value.cloc) {
    const cloc = JSON.parse(value.cloc);
    summary = {
      ...summary,
      cloc: true,
      totalFiles: cloc.header.n_files,
      totalLines: cloc.header.n_lines,
    };
  }

  if (value.htmlIssuesList) {
    summary = {
      ...summary,
      html: true,
      htmlErrors: value.htmlErrors || 0,
      htmlWarnings: value.htmlWarnings || 0,
      htmlIssueList:
        "HTML Issues:\n" + getHtmlIssuesDescriptions(value.htmlIssuesList),
    };
  }
  return summary;
};
export const HTMLERRORS = [
  "attr-no-duplication",
  "attr-lowercase",
  "attr-value-double-quotes",
  "doctype-first",
  "id-unique",
  "src-not-empty",
  "tag-pair",
  "tagname-lowercase",
  "title-require",
];

export const getCodeErrorsByFile = pipe(
  groupBy(prop("file")),
  converge(
    zipWith((x, y) => ({
      url: x,
      errors: pipe(
        groupBy(prop("ruleFile")),
        converge(
          zipWith((x, y) => ({
            [x.replace(".md", "")]: pipe(map(prop("line")))(y),
          })),
          [keys, values]
        ),
        mergeAll
      )(y),
    })),
    [keys, values]
  )
);

export const getCodeErrorsByRule = pipe(
  groupBy(prop("ruleFile")),
  converge(
    zipWith((x, y) => ({
      error: x.replace(".md", ""),
      pages: pipe(
        groupBy(prop("file")),
        converge(
          zipWith((x, y) => ({
            error: x.replace(".md", ""),
            url: x,
            locations: y.map((l) => l.line),
          })),
          [keys, values]
        )
      )(y),
    })),
    [keys, values]
  )
);

export const getCodeErrorRules = pipe(
  groupBy(prop("error")),
  converge(
    zipWith((x, y) => ({
      type: x === "true" ? "Error" : "Warn",
      errors: pipe(groupBy(prop("ruleFile")), keys)(y),
    })),
    [keys, values]
  ),
  filter((x) => x.type === "Error"),
  head,
  prop("errors")
);

export const getHtmlHintIssues = pipe(
  map(prop("errors")),
  map(keys),
  flatten,
  uniq
);

export const getRuleLink = (errorKey) => {
  if (customHtmlHintRules.some((rule) => rule.rule === errorKey)) {
    var custom = customHtmlHintRules.find((item) => item.rule == errorKey);
    return custom.ruleLink;
  } else {
    return `https://htmlhint.com/docs/user-guide/rules/${errorKey}`;
  }
};

export const getDisplayText = (errorKey) => {
  if (customHtmlHintRules.some((item) => item.rule === errorKey)) {
    var customRule = customHtmlHintRules.find((item) => item.rule == errorKey);
    return customRule.displayName != ""
      ? customRule.displayName
      : customRule.rule;
  } else if (htmlHintRules.some((item) => item.rule == errorKey)) {
    var htmlHint = htmlHintRules.find((item) => item.rule == errorKey);
    return htmlHint.displayName != "" ? htmlHint.displayName : htmlHint.rule;
  } else {
    return errorKey;
  }
};

export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

export const convertSpecialCharUrl = (url) => {
  // Replace special characters in URL string
  const specialChars = {
    ':': '%3A',
    '/': '%2F'
  };
  return url.replace(/[:/]/g, m => specialChars[m]);
};

export const RuleType = {
  Warning: "Warning",
  Error: "Error",
};

export const historyChartType = {
  BadLinks: "BAD LINKS",
  WarningCode: "CODE WARNINGS",
  ErrorCode: "CODE ERRORS",
}

export const htmlHintRules = [
  {
    rule: "tagname-lowercase",
    displayName: "Tags - Tag names must be lowercase",
    ruleLink: "https://htmlhint.com/docs/user-guide/rules/tagname-lowercase",
    type: RuleType.Error
  },
  {
    rule: "tag-pair",
    displayName: "Tags - Tags must be paired",
    ruleLink: "https://htmlhint.com/docs/user-guide/rules/tag-pair",
    type: RuleType.Error
  },
  {
    rule: "empty-tag-not-self-closed",
    displayName: "Tags - Empty tags should not be closed by itself",
    ruleLink:
      "https://htmlhint.com/docs/user-guide/rules/empty-tag-not-self-closed",
    type: RuleType.Warning
  },
  {
    rule: "id-class-ad-disabled",
    displayName: "Tags - Id and class must not use the 'ad' keyword",
    ruleLink: "https://htmlhint.com/docs/user-guide/rules/id-class-ad-disabled",
    type: RuleType.Warning
  },
  {
    rule: "id-unique",
    displayName: "Tags - Id attributes must be unique",
    ruleLink: "https://htmlhint.com/docs/user-guide/rules/id-unique",
    type: RuleType.Error
  },
  {
    rule: "attr-lowercase",
    displayName: "Attributes - Attribute names must be lowercase",
    ruleLink: "https://htmlhint.com/docs/user-guide/rules/attr-lowercase",
    type: RuleType.Error
  },
  {
    rule: "attr-value-double-quotes",
    displayName: "Attributes - Attribute values must be in double quotes",
    ruleLink:
      "https://htmlhint.com/docs/user-guide/rules/attr-value-double-quotes",
    type: RuleType.Error
  },
  {
    rule: "attr-value-not-empty",
    displayName: "Attributes - All attributes must have values",
    ruleLink: "https://htmlhint.com/docs/user-guide/rules/attr-value-not-empty",
    type: RuleType.Warning
  },
  {
    rule: "attr-no-duplication",
    displayName: "Attributes - Element cannot contain duplicate attributes",
    ruleLink: "https://htmlhint.com/docs/user-guide/rules/attr-no-duplication",
    type: RuleType.Error
  },
  {
    rule: "attr-unsafe-chars",
    displayName: "Attributes - Attributes cannot contain unsafe characters",
    ruleLink: "https://htmlhint.com/docs/user-guide/rules/attr-unsafe-chars",
    type: RuleType.Warning
  },
  {
    rule: "doctype-first",
    displayName: "Header - DOCTYPE must be declared first",
    ruleLink: "https://htmlhint.com/docs/user-guide/rules/doctype-first",
    type: RuleType.Error
  },
  {
    rule: "title-require",
    displayName: "Header - Missing title tag",
    ruleLink: "https://htmlhint.com/docs/user-guide/rules/title-require",
    type: RuleType.Error
  },
  {
    rule: "doctype-html5",
    displayName: "Header - DOCTYPE must be HTML5",
    ruleLink: "https://htmlhint.com/docs/user-guide/rules/doctype-html5",
    type: RuleType.Warning
  },
  {
    rule: "head-script-disabled",
    displayName: "Syntax - Script tags cannot be used inside another tag",
    ruleLink: "https://htmlhint.com/docs/user-guide/rules/head-script-disabled",
    type: RuleType.Warning
  },
  {
    rule: "spec-char-escape",
    displayName: "Syntax - Special characters must be escaped",
    ruleLink: "https://htmlhint.com/docs/user-guide/rules/spec-char-escape",
    type: RuleType.Error
  },
  {
    rule: "style-disabled",
    displayName: "Syntax - Style tags should not be used outside of header",
    ruleLink: "https://htmlhint.com/docs/user-guide/rules/style-disabled",
    type: RuleType.Warning
  },
  {
    rule: "inline-style-disabled",
    displayName: "Syntax - Inline styling should not be used",
    ruleLink:
      "https://htmlhint.com/docs/user-guide/rules/inline-style-disabled",
    type: RuleType.Warning
  },
  {
    rule: "inline-script-disabled",
    displayName: "Syntax - Inline scripts should not be used",
    ruleLink:
      "https://htmlhint.com/docs/user-guide/rules/inline-script-disabled",
    type: RuleType.Warning
  },
  {
    rule: "alt-require",
    displayName: "Images - Missing alt attribute",
    ruleLink: "https://htmlhint.com/docs/user-guide/rules/alt-require",
    type: RuleType.Warning
  },
  {
    rule: "href-abs-or-rel",
    displayName: "Links - Href attribute must be either absolute or relative",
    ruleLink: "https://htmlhint.com/docs/user-guide/rules/href-abs-or-rel",
    type: RuleType.Warning
  },
  {
    rule: "src-not-empty",
    displayName: "Content - The image src attribute must have a value",
    ruleLink: "https://htmlhint.com/docs/user-guide/rules/src-not-empty",
    type: RuleType.Error
  },
];

export const customHtmlHintRules = [
  {
    rule: "code-block-missing-language",
    displayName: "Syntax - Code blocks must have a language",
    ruleLink: "https://www.ssw.com.au/rules/set-language-on-code-blocks",
    type: RuleType.Warning
  },
  // {
  //   rule: "youtube-url-must-be-used-correctly",
  //   displayName: "Syntax - YouTube videos must not be under an embed URL",
  //   ruleLink: "https://ssw.com.au/rules/optimize-videos-for-youtube/",
  //   type: RuleType.Warning
  // },
  {
    rule: "figure-must-use-the-right-code",
    displayName: "Syntax - Use the right HTML/CSS figure markup",
    ruleLink: "https://www.ssw.com.au/rules/use-the-right-html-figure-caption",
    type: RuleType.Warning
  },
  {
    rule: "font-tag-must-not-be-used",
    displayName: "Tags - Font tags must not be used",
    ruleLink:
      "https://www.ssw.com.au/rules/do-you-know-font-tags-are-no-longer-used",
    type: RuleType.Warning
  },
  {
    rule: "url-must-not-have-click-here",
    displayName: "Content - Do not use the words ‘click here’",
    ruleLink: "https://www.ssw.com.au/rules/relevant-words-on-links",
    type: RuleType.Warning
  },
  {
    rule: "grammar-scrum-terms",
    displayName: "Content - Use the correct Scrum terms",
    ruleLink: "https://www.ssw.com.au/rules/scrum-should-be-capitalized",
    type: RuleType.Warning
  },
  {
    rule: "page-must-not-show-email-addresses",
    displayName: "Content - Text must not display any email addresses",
    ruleLink:"https://www.ssw.com.au/rules/avoid-clear-text-email-addresses-in-web-pages",
    type: RuleType.Warning
  },
  {
    rule: "use-unicode-hex-code-for-special-html-characters",
    displayName: "Content - Use Unicode Hex code for special HTML characters",
    ruleLink: "https://ssw.com.au/rules/html-unicode-hex-codes/",
    type: RuleType.Error
  },
  {
    rule: "anchor-names-must-be-valid",
    displayName: "Links - Anchor links’ names must be valid",
    ruleLink: "https://www.ssw.com.au/rules/chose-efficient-anchor-names",
    type: RuleType.Warning
  },
  {
    rule: "url-must-be-formatted-correctly",
    displayName: "Links - URLs should not include full stop or slash at the end",
    ruleLink: "https://ssw.com.au/rules/no-full-stop-or-slash-at-the-end-of-urls/",
    type: RuleType.Warning
  },
  {
    rule: "detect-absolute-references-url-path-correctly",
    displayName: "Links - Avoid absolute internal URLs",
    ruleLink: "https://ssw.com.au/rules/avoid-absolute-internal-links/",
    type: RuleType.Warning
  },
  {
    rule: "url-must-not-have-space",
    displayName: "Links - URLs must not have space",
    ruleLink: "https://www.ssw.com.au/rules/use-dashes-in-urls",
    type: RuleType.Warning
  },
  {
    rule: "link-must-not-show-unc",
    displayName: "Links - URLs must not have UNC paths",
    ruleLink: "https://www.ssw.com.au/rules/urls-must-not-have-unc-paths/",
    type: RuleType.Warning
  },
  {
    rule: "meta-tag-must-not-redirect",
    displayName: "Header - Must not refresh or redirect",
    ruleLink: "https://rules.sonarsource.com/html/RSPEC-1094",
    type: RuleType.Warning
  },
  // Add new rule id below
];

export const PresetType = {
  Whitelist: "Whitelist",
  Blacklist: "Blacklist",
};

export const rulePresets = [
  { 
    name: 'Select All',
    type: PresetType.Blacklist,
    rules: []
  },
  {
    name: 'React project',
    type: PresetType.Blacklist,
    rules: []
  },
];
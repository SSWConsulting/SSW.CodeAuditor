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
  prop,
  when,
  propSatisfies,
  gt,
  takeLast,
  prepend,
  __,
} from "ramda";
import { customHtmlHintRules, htmlHintRules } from "../../../constants/rules.js";

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
  return getMatchingIgnoredRules(url, list).length > 0;
};

export const getMatchingIgnoredRules = (url, list) => {
  const date = new Date();
  return list.filter((item) => {
    const pattern = item.urlToIgnore;
    if (globMatchUrl(pattern, url)) {
      const effectiveFrom = new Date(item.effectiveFrom);
      const timeElapsed = (date - effectiveFrom) / 86400000;
      return (item.ignoreDuration > 0 && timeElapsed < item.ignoreDuration) || item.ignoreDuration === -1;
    }
  });
};

export const globMatchUrl = (pattern, input) => {
  var re = new RegExp(
    pattern.replace(/([.?+^$[\]\\(){}|\/-])/g, "\\$1").replace(/\*/g, ".*")
  );
  return re.test(input);
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

export const revertSpecialCharUrl = (url) => {
  // Replace special characters in URL string
  const specialChars = {
    '%3A' : ':',
    '%2F' : '/'
  };
 return url.replace(/%3A|%2F/gi, (matched) => specialChars[matched]);
};

export const historyChartType = {
  BadLinks: "BAD LINKS",
  WarningCode: "CODE WARNINGS",
  ErrorCode: "CODE ERRORS",
}

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
    rules: [
      "attr-lowercase",
      "style-disabled",
      "head-script-disabled",
      "inline-style-disabled",
      "figure-must-use-the-right-code",
      "alt-require",
      "attr-value-not-empty",
      "spec-char-escape",
      "use-unicode-hex-code-for-special-html-characters"
    ]
  },
];
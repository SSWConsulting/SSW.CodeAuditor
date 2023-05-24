const fetch = require("node-fetch");
const slug = require("slug");
const endpoint = "https://asia-east2-sswlinkauditor-c1131.cloudfunctions.net";
const endpoint2 = "https://asia-northeast1-sswlinkauditor-c1131.cloudfunctions.net/api2";
//'http://localhost:5001/sswlinkauditor-c1131/asia-east2';

exports.postData = (api, buildId, data) => {
  return fetch(`${endpoint}/api/scanresult/${api}/${buildId || "-"}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  }).then((res) => {
    if (res.ok) {
      return res.text();
    } else {
      return res.text().then((t) => {
        throw Error(t);
      });
    }
  });
};

exports.getConfigs = (api) => {
  return fetch(`${endpoint}/api/config/${api}/ignore`).then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      throw Error("Failed to load config");
    }
  });
};

exports.fetchHtml = (url) => {
  return fetch(url).then((res) => {
    return res.text();
  });
};

exports.getPerfThreshold = (api, url) => {
  return fetch(`${endpoint}/api/config/${api}/perfthreshold/${slug(url)}`).then(
    (res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw Error("Failed to load perf threshold config");
      }
    }
  );
};

exports.getLoadThreshold = (api, url) => {
  return fetch(`${endpoint}/api/config/${api}/loadthreshold/${slug(url)}`).then(
    (res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw Error("Failed to load artillery threshold config");
      }
    }
  );
};

exports.getHTMLHintRules = (api, url) => {
  return fetch(`${endpoint2}/config/${api}/htmlhintrules/${slug(url)}`).then(
    (res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw Error("Failed to load html hint rules config");
      }
    }
  );
};

exports.addHTMLHintRulesForScan = (api, url, runId, selectedRules) => {
  return fetch(`${endpoint}/api/config/${api}/addhtmlhintruleseachrun`, {
    method: "PUT",
    body: JSON.stringify({
      url,
      runId,
      selectedRules
    }),
    headers: { "Content-Type": "application/json" },
  }).then((res) => {
    if (res.ok) {
      return res.text();
    } else {
      throw Error("Failed to upload custom htmlhint rules");
    }
  });
};

exports.htmlHintConfig = {
  "grammar-scrum-terms": true,
  "code-block-missing-language": true,
  "tagname-lowercase": true,
  "attr-lowercase": true,
  "attr-value-double-quotes": true,
  "attr-value-not-empty": true,
  "attr-no-duplication": true,
  "doctype-first": true,
  "tag-pair": true,
  "empty-tag-not-self-closed": true,
  "spec-char-escape": true,
  "id-unique": true,
  "src-not-empty": true,
  "title-require": true,
  "alt-require": true,
  "doctype-html5": true,
  "style-disabled": true,
  "inline-style-disabled": true,
  "inline-script-disabled": true,
  "id-class-ad-disabled": true,
  "href-abs-or-rel": true,
  "attr-unsafe-chars": true,
  "head-script-disabled": true,
  "anchor-names-must-be-valid": true,
  "meta-tag-must-not-redirect": true,
  "font-tag-must-not-be-used": true,
  "url-must-not-have-space": true,
  "url-must-not-have-click-here": true,
  "page-must-not-show-email-addresses": true,
  "link-must-not-show-unc": true,
  "url-must-be-formatted-correctly": true,
  "youtube-url-must-be-used-correctly": false,
  "figure-must-use-the-right-code": true,
  "detect-absolute-references-url-path-correctly": true,
  "use-unicode-hex-code-for-special-html-characters": true
};

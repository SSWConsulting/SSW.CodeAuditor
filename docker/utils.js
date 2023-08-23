const _replaceQuote = (s) => s.replace(/"/g, "");
const fs = require("fs");
const csv = require("csv-parser");
const chalk = require("chalk");
const minimatch = require("minimatch");
const boxen = require("boxen");
const { htmlHintConfig, fetchHtml, getHTMLHintRules } = require("./api");
const R = require("ramda");
const { execSync } = require("child_process");
const slug = require("slug");
const nodemailer = require("nodemailer");
const fns = require('date-fns');
const fetch = require('node-fetch');
const beautify_html = require('js-beautify').html;

exports.sendAlertEmail = async (email, emailConfig, scanSummary) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: emailConfig.ALERT_EMAIL,
      pass: emailConfig.ALERT_EMAIL_APP_PASS
    }
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from: 'foo@example.com', // sender address
    to: email, // list of receivers
    subject: `SSW CodeAuditor Scan Result - ${scanSummary.url}`, // Subject line
    html: `<h2 style="color: red">Hi there,</h2><p>This is the result from SSW CodeAuditor scan on ${scanSummary.url} on ${fns.format(new Date(scanSummary.buildDate), 'dd MMM yyyy, hh:mm aaaa')}</p><p>⏳ Duration: ${scanSummary.scanDuration} seconds</p><p>🚨 Broken Links: ${scanSummary.totalUnique404} / ${scanSummary.totalScanned} Bad links</p><p>⚠️ HTML Warnings: ${scanSummary.htmlWarnings}</p><p>❌ HTML Errors: ${scanSummary.htmlErrors}</p><p>See https://codeauditor.com/build/${scanSummary.runId} for full scan result</p><p>&#60;This is the automated alert email from SSW CodeAuditor&#62;</p>`, 
  });
}

const consoleBox = (text, color) =>
  console.log(
    boxen(chalk[color](text), {
      padding: 1,
      borderStyle: "single",
      borderColor: color,
    })
  );

exports.consoleBox = consoleBox;

exports.printTimeDiff = (t1, t2) => {
  var dif = t1 - t2;
  const took =
    Math.floor(dif / 1000 / 60)
      .toString()
      .padStart(2, "0") +
    ":" +
    Math.floor((dif / 1000) % 60)
      .toString()
      .padStart(2, "0");
  return [took, Math.floor(dif / 1000)];
};

const diffInDaysToNow = (d) => Math.floor((new Date() - d) / 1000 / 86400);

exports.readCsv = (file) => {
  return new Promise((resolve) => {
    const results = [];
    fs.createReadStream(file)
      .pipe(csv({ separator: "\t" }))
      .on("data", (row) => {
        results.push(row);
      })
      .on("end", () => resolve(results));
  });
};

/**
 * @param {array} output - Array of issues identified by Github superlinter
 */
exports.formatSuperLinterOutput = (output) => {
  const f = R.pipe(
    // group by Language Type
    R.groupBy(R.prop("linter")),
    R.converge(
      R.zipWith((k, v) => ({
        [k]: R.pipe(
          // then group by the file
          R.groupBy(R.prop("file")),
          R.converge(
            R.zipWith((k, v) => ({
              // for each file, get the location separated by semi colon
              [k]: v.map((x) => x.location).join(";"),
            })),
            [R.keys, R.values]
          ),
          R.mergeAll
        )(v),
      })),
      [R.keys, R.values]
    ),
    R.mergeAll
  );

  return f(output);
};

/**
 *
 * Count number of line of codes in a codebase
 */
exports.countLineOfCodes = () => {
  try {
    const json = execSync(
      `./node_modules/.bin/cloc src --fullpath --not-match-d node_modules --json`
    ).toString();
    const d = JSON.parse(json);
    return [d, null];
  } catch (error) {
    return [null, error.message];
  }
};

/**
 * Run custom static code analysis using the provided rules folder and ignore files
 * @param {string} ignorefile
 * @param {string} rulesfolder
 */
exports.runCodeAuditor = (ignorefile, rulesfolder) => {
  try {
    const ignoreParams = ignorefile ? ` -I ./src/${ignorefile} ` : "";
    const rulesFolderParams = rulesfolder ? ` -R ./src/${rulesfolder} ` : "";
    const json = execSync(
      `./node_modules/.bin/sswcodeauditor ./src ${ignoreParams} ${rulesFolderParams} --json`
    ).toString();
    const d = JSON.parse(json);
    return [d, null];
  } catch (error) {
    return [null, error.message];
  }
};

/**
 * Send GET request and then perform HTML Hint check on it
 * @param {string} url - URL to scan
 */
const runHtmlHint = async (url, startUrl, tokenApi) => {
  const HTMLHint = require("htmlhint").default;

  if (tokenApi) {
    const result = await getHTMLHintRules(tokenApi, startUrl);
  
    if (result && result.selectedRules.length > 0) {
      const selectedHtmlConfig = result.selectedRules.split(",");
  
      const htmlRulesConfig = Object.keys(htmlHintConfig);
  
      // Turn off all the rules
      for (var i in htmlHintConfig) {
        htmlHintConfig[i] = false;
      }
  
      // Add only selected rules to htmlHintConfig
      htmlRulesConfig.forEach((x) => {
        selectedHtmlConfig.forEach((c) => {
          if (x === c) {
            htmlHintConfig[x] = true;
          }
        });
      });
    }
  }

  try {
    let html = await fetchHtml(url);
  
    html = beautify_html(html, { indent_size: 2, space_in_empty_paren: true });

    return R.pipe(
      (html) => HTMLHint.verify(html, htmlHintConfig),
      R.map((x) => {
        delete x.evidence;
        delete x.message;
        delete x.raw;
        const error = {
          ...x,
          ruleName: x.rule.id,
          url,
        };
        delete error.rule;
        return error;
      })
    )(html);
  } catch (error) {
    return null;
  }
};

/**
 * Return simplified JSON object representing all issues identified by HtmlHint
 * @param {Array} result - output array from HTMLHint
 */
const getHtmlHintDetails = (result) => {
  const getSummarizedErrors = R.pipe(
    R.flatten,
    R.filter((x) => !!x),
    R.groupBy((x) => x.ruleName),
    R.map((x) => ({
      type: x[0].type,
      count: x.length,
      example: x[0],
    }))
  );

  const getDetailsErrorsOnUrl = R.pipe(
    R.pipe(
      R.flatten,
      R.filter((x) => !!x),
      R.groupBy(R.prop("url"))
    ),
    R.converge(
      R.zipWith((k, v) => ({
        url: k,
        errors: R.pipe(
          R.map((e) => ({
            loc: `${e.line}:${e.col}`,
            errorType: e.ruleName,
          })),
          R.groupBy(R.prop("errorType")),
          R.converge(
            R.zipWith((k, v) => ({
              [k]: v.map((u) => u.loc),
            })),
            [R.keys, R.values]
          ),
          R.reduce((a, b) => {
            const key = Object.keys(b)[0];
            return {
              ...a,
              [key]: b[key],
            };
          }, {})
        )(v),
      })),
      [R.keys, R.values]
    )
  );

  return [getSummarizedErrors(result), getDetailsErrorsOnUrl(result)];
};

/**
 * Check for broken links
 * @param {string} url - URL to check for broken link
 * @param {number} maxthread - Number of concurrent threads
 */
exports.runBrokenLinkCheck = (url, maxthread) => {
  try {
    const comand = maxthread
      ? `./sswlinkauditor ${url} ${maxthread}`
      : `./sswlinkauditor ${url}`;
    return [execSync(comand, { maxBuffer: 20000 * 1024 }).toString(), null];
  } catch (error) {
    return [null, error.message];
  }
};

/**
 * run Artillery Load Test
 * @param {func} writeLog - logging method
 * @param {string} url - URL to run
 */
exports.runArtilleryLoadTest = (url, writeLog) => {
  writeLog(`start artillery`);
  try {
    const rs = execSync(
      `./node_modules/.bin/artillery quick -d 20 -r 10 -k -o artilleryOut.json "${url}"`
    ).toString();
    writeLog(`artillery check finished`, rs);
  } catch (e) {
    writeLog(`artillery check failed`, e);
  }
}

/**
 * run Lighthouse Report
 * @param {string} url 
 */
exports.runLighthouseReport = async (url) => {
  const categories = ["accessibility","best_practices","performance","SEO"]
  const lighthouseUrl = new URL(
    'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'
  )
  lighthouseUrl.searchParams.append('key', 'AIzaSyBGZtZ045o_LRrs3Wgk4MvrDabMqMjHFnQ')
  lighthouseUrl.searchParams.append('url', url)
  lighthouseUrl.searchParams.append('strategy', 'mobile')
  for (const category of categories) {
    lighthouseUrl.searchParams.append('category', category.toUpperCase())
  }
  const response = await fetch(lighthouseUrl)
  if (response.ok) {
    const data = await response.json()
    const lighthouseResult = data.lighthouseResult
    var json = JSON.stringify(lighthouseResult);
    if (lighthouseResult) {
      fs.writeFile('lhr.json', json, 'utf8', err => {
        if (err) {
          console.error(err);
        }
      });
    }
  }
}

/**
 * parse Lighthouse Report
 * @param {string} folder - lhr file
 * @param {func} writeLog - logging method
 */
exports.readLighthouseReport = (folder, writeLog) => {
  if (!fs.existsSync(folder)) {
    console.log(
      'ERROR => No lighthouse report found'
    );
    return [null, null];
  }

  writeLog(`Reading Lighthouse report files`);

  const lhr = JSON.parse(fs.readFileSync(`lhr.json`).toString());

  const lhrSummary = {
    performanceScore: lhr.categories.performance.score,
    accessibilityScore: lhr.categories.accessibility.score,
    bestPracticesScore: lhr.categories["best-practices"].score,
    seoScore: lhr.categories.seo.score,
  };
  return [lhr, lhrSummary];
};

/**
 * parse Artillery Report
 * @param {string} folder - Artillery report file
 * @param {func} writeLog - logging method
 */
exports.readArtilleryReport = (folder, writeLog) => {
  if (!fs.existsSync(folder)) {
    console.log("ERROR => No Artillery report found");
    return [null, null];
  }

  writeLog(`Reading Artillery report files`);

  const atr = JSON.parse(fs.readFileSync(`artilleryOut.json`).toString());

  const atrSummary = {
    timestamp: atr.aggregate.timestamp,
    scenariosCreated: atr.aggregate.scenariosCreated,
    scenariosCompleted: atr.aggregate.scenariosCompleted,
    requestsCompleted: atr.aggregate.requestsCompleted,
    rpsCount: atr.aggregate.rps.count,
    latencyMin: atr.aggregate.latency.min,
    latencyMax: atr.aggregate.latency.max,
    latencyMedian: atr.aggregate.latency.median,
    latencyP95: atr.aggregate.latency.p95,
    latencyP99: atr.aggregate.latency.p99,
    scenarioDurationMedian: atr.aggregate.scenarioDuration.median,
    scenarioDurationP95: atr.aggregate.scenarioDuration.p95,
    scenarioDurationP99: atr.aggregate.scenarioDuration.p99,
    errors: Object.keys(atr.aggregate.errors).length,
  };

  return [atr, atrSummary];
};

/**
 * Run HTML Hint on all successfull URLs
 * @param {string} startUrl - URL being scanned
 * @param {array} scannedUrls - list of all scanned URLs
 * @param {func} writeLog - write log function
 */
exports.runHtmlHint = async (startUrl, scannedUrls, writeLog, tokenApi) => {
  const __getGoodUrls = (allUrls) => {
    const all = allUrls
    .filter(
      (url) =>
      (url.Source || "").toLowerCase().indexOf(startUrl.toLowerCase()) >= 0 &&
      url.StatusCode === '200'
      )
      .map((x) => x.Source);
    return [...new Set(all)];
  };

  const allgoodLinks = __getGoodUrls(scannedUrls);
  writeLog(`running htmlhint on ${allgoodLinks.length} URLs`);

  const result = await Promise.all(
    allgoodLinks.map((x) => runHtmlHint(x, startUrl, tokenApi))
  );

  const [summary, details] = getHtmlHintDetails(result);
  writeLog("summary of html issues found", summary);
  writeLog("details of html issues", JSON.stringify(details, null, 2));
  return [summary, details];
};

/**
 * Get the list of broken links taking into account the configured White list
 * @param {string} startUrl - URL being scanned
 * @param {array} scannedUrls - list of all scanned URLs
 * @param {array} ignoredUrls - list of ignored URLs configured on the Portal
 * @param {func} writeLog - writelog function
 * @param {string} whitelist - CSV list of whitelist URLs provided via CLI
 */
exports.processBrokenLinks = (
  startUrl,
  scannedUrls,
  ignoredUrls,
  writeLog,
  whitelist
) => {
  const __getBadResults = (allUrls) =>
    allUrls
      .filter((url) => url["StatusCode"] === "404")
      .map((x) => ({
        src: x.Source || "",
        dst: x.Destination || "",
        link: x.Anchor || "",
        statuscode: x["StatusCode"] || "",
        statusmsg: x.Status || "",
      }));

  const __getUniqIgnoredUrls = (badUrls, whitelistedUrls) => {
    // check the scan URL, effective DATE and pattern match
    const isInIgnoredList = (url, ignoreOn) => {
      return (
        whitelistedUrls
          .filter(
            (ig) =>
              ig.ignoreOn === ignoreOn &&
              (+ig.ignoreDuration === -1 ||
                diffInDaysToNow(new Date(ig.effectiveFrom)) <
                  +ig.ignoreDuration)
          )
          .map((ig) => ig.urlToIgnore)
          .filter((ignorePattern) => minimatch(url, ignorePattern)).length > 0
      );
    };

    // return the URL only
    const all = badUrls
      .filter(
        (url) =>
          isInIgnoredList(url.dst, "all", whitelistedUrls) ||
          isInIgnoredList(url.dst, startUrl, whitelistedUrls)
      )
      .map((x) => x.dst);
    return [...new Set(all)];
  };

  let allBadUrls = __getBadResults(scannedUrls);
  let whiteListed = [];

  if (ignoredUrls && ignoredUrls.length > 0) {
    writeLog("There are whitelisted URLs configured in online");
    whiteListed = __getUniqIgnoredUrls(allBadUrls, ignoredUrls);
  }

  if (whitelist) {
    writeLog("Got the whitelist from command line");
    const whitelistList = whitelist.split(",");
    const inWhiteListFromArgs = (url) =>
      whitelistList.filter((ignorePattern) => minimatch(url, ignorePattern))
        .length > 0;

    const whiteListedArgs = allBadUrls
      .filter((u) => inWhiteListFromArgs(u.dst))
      .map((x) => x.dst);

    whiteListed = whiteListed.concat(whiteListedArgs);
  }
  return [allBadUrls, whiteListed];
};

const HTMLERRORS = [
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

const getLinkToBuild = (runId) =>
  runId
    ? `Report URL => https://codeauditor.com/build/${_replaceQuote(runId)}`
    : "";

const outputBadDataCsv = (records) => {
  const createCsvStringifier = require("csv-writer").createObjectCsvStringifier;

  const csvStringifier = createCsvStringifier({
    alwaysQuote: true,
    header: [
      {
        id: "src",
        title: "Source",
      },
      {
        id: "dst",
        title: "Destination",
      },
      {
        id: "link",
        title: "Anchor",
      },
      {
        id: "statuscode",
        title: "StatusCode",
      },
      {
        id: "statusmsg",
        title: "Status",
      },
    ],
  });
  console.log(`"Source","Destination","Anchor","StatusCode","Status"`);
  console.log(csvStringifier.stringifyRecords(records));
};

/**
 * Print to console the list of HTML hint issues found
 * @param {Array} htmlIssues - HtmlHint issues array
 */
const printHtmlIssuesToConsole = (htmlIssues) => {
  R.pipe(
    // restructure the output of the HTMLHint
    R.map(
      R.applySpec({
        url: R.prop("url"),
        errors: R.pipe(
          R.identity,
          R.pipe(
            R.prop("errors"),
            R.converge(
              R.zipWith((x, y) => ({
                error: x,
                locations: y,
              })),
              [R.keys, R.values]
            )
          )
        ),
      })
    ),
    R.tap(() => consoleBox("List of HTML Issues", "red")),
    R.pipe(
      R.forEach((x) => {
        console.log(`${x.url}`);
        R.pipe(
          R.prop("errors"),
          R.forEach((error) => {
            console.log(`${error.error}`);
            R.pipe(R.prop("locations"), R.forEach(console.log))(error);
            console.log("");
          })
        )(x);
      })
    )
  )(htmlIssues);
};

/**
 * Print all result to console
 * @param {array} scannedUrls - all scanned URLs
 * @param {array} lh - lighthouse data
 * @param {string} runId - Run Id
 * @param {object} reqThreshold - required perf threshold param
 * @param {object} reqLoadThres - required load threshold param
 * @param {array} badLinks - list of broken links
 * @param {array} ignored - list of matched ignore URLs
 * @param {object} htmlIssuesSummary - Html Issue Summary
 * @param {array} htmlIssues - Html Issues Details
 * @param {array} codeAuditorIssues - List of Code Auditor Issues
 * @param {string} duration - durations
 */
exports.printResultsToConsole = (
  scannedUrls,
  lh,
  runId,
  badLinks,
  ignored,
  htmlIssuesSummary,
  duration,
  atrSummary
) => {
  let lhScaled;

  if (lh) {
    // output Lighthouse Score Box
    lhScaled = {
      performanceScore: Math.round(lh.performanceScore * 100),
      seoScore: Math.round(lh.seoScore * 100),
      accessibilityScore: Math.round(lh.accessibilityScore * 100),
      bestPracticesScore: Math.round(lh.bestPracticesScore * 100),
      average: Math.round(
        ((lh.performanceScore +
          lh.seoScore +
          lh.bestPracticesScore +
          lh.accessibilityScore) /
          5) *
          100
      ),
    };

    let strAvg = "AVG: ";
    let strPerformance = "Performance: ";
    let strSeo = "SEO: ";
    let strBP = "Best practices: ";

    let avg = chalk(
      `${strAvg.padEnd(10)} ${lhScaled.average.toString().padStart(10)} / 100`
    );
    let performance = chalk(
      `${strPerformance.padEnd(10)} ${lhScaled.performanceScore
        .toString()
        .padStart(7)} / 100`
    );
    let seo = chalk(
      `${strSeo.padEnd(10)} ${lhScaled.seoScore.toString().padStart(10)} / 100`
    );
    let bestPractice = chalk(
      `${strBP.padEnd(10)} ${lhScaled.bestPracticesScore
        .toString()
        .padStart(4)} / 100`
    );

    consoleBox([avg, performance, bestPractice, seo], "green");
  }

  if (atrSummary) {
    // Output Artillery report
    let strTime = "Timestamp: ";
    let strScenCreated = "Scenarios Created: ";
    let strScenCompleted = "Scenarios Completed: ";
    let strReqCompleted = "Requests Completed: ";
    let strLatencyMedian = "Latency Median: ";
    let strLatencyMin = "Latency Min: ";
    let strLatencyMax = "Latency Max: ";
    let strLatencyP95 = "Latency P95: ";
    let strLatencyP99 = "Latency P99: ";
    let strRps = "RPS: ";
    let strScenarioDurationMedian = "Scenario Duration Median: ";
    let strScenarioDurationP95 = "Scenario Duration P95: ";
    let strScenarioDurationP99 = "Scenario Duration P99: ";
    let strErrors = "Errors: ";

    let timestamp = chalk(`${strTime} ${atrSummary.timestamp}`);
    let scenCreated = chalk(`${strScenCreated} ${atrSummary.scenariosCreated}`);
    let scenCompleted = chalk(
      `${strScenCompleted} ${atrSummary.scenariosCompleted}`
    );
    let reqCompleted = chalk(
      `${strReqCompleted} ${atrSummary.requestsCompleted}`
    );
    let latencyMax = chalk(`${strLatencyMax} ${atrSummary.latencyMax}`);
    let latencyMin = chalk(`${strLatencyMin} ${atrSummary.latencyMin}`);
    let latencyMedian = chalk(
      `${strLatencyMedian} ${atrSummary.latencyMedian}`
    );
    let latencyP95 = chalk(`${strLatencyP95} ${atrSummary.latencyP95}`);
    let latencyP99 = chalk(`${strLatencyP99} ${atrSummary.latencyP99}`);
    let rps = chalk(`${strRps} ${atrSummary.rpsCount}`);
    let scenarioDurationMedian = chalk(
      `${strScenarioDurationMedian} ${atrSummary.scenarioDurationMedian}`
    );
    let scenarioDurationP95 = chalk(
      `${strScenarioDurationP95} ${atrSummary.scenarioDurationP95}`
    );
    let scenarioDurationP99 = chalk(
      `${strScenarioDurationP99} ${atrSummary.scenarioDurationP99}`
    );
    let errors = chalk(`${strErrors} ${atrSummary.errors}`);

    consoleBox([
      timestamp,
      scenCreated,
      scenCompleted,
      reqCompleted,
      latencyMax,
      latencyMin,
      latencyMedian,
      latencyP95,
      latencyP99,
      rps,
      scenarioDurationMedian,
      scenarioDurationP95,
      scenarioDurationP99,
      errors,
    ], "green");
  }

  // output htmlhint summary
  const getSummaryText = R.pipe(
    R.converge(
      R.zipWith((x, y) => ({
        error: x,
        count: y.count,
      })),
      [R.keys, R.values]
    ),
    R.map(
      (x) =>
        `${x.error} ${HTMLERRORS.indexOf(x.error) >= 0 ? "(Error)" : ""}:${
          x.count
        }`
    ),
    R.join(", ")
  );

  const getHtmlHintErrors = R.pipe(
    R.keys,
    R.filter((x) => HTMLERRORS.indexOf(x) >= 0)
  );

  htmlIssuesSummary &&
    consoleBox("HtmlHint issues: " + getSummaryText(htmlIssuesSummary), "red");

  let htmlErrors = htmlIssuesSummary
    ? getHtmlHintErrors(htmlIssuesSummary)
    : [];

  // output broken links reports
  const _ignoreLbl = () =>
    `${ignored.length > 0 ? `, ${ignored.length} URLs in Ignored list` : ""}`;

  consoleBox(
    badLinks.length === 0
      ? `All ${chalk.green.bold.underline(
          scannedUrls.length
        )} links returned 200 OK [${duration}]${_ignoreLbl()}`
      : `Scanned ${scannedUrls.length}, found ${
          badLinks.length
        } Bad links [${duration}]${_ignoreLbl()}`,
    badLinks.length === 0 ? "green" : "red"
  );

  if (runId) {
    // pushed to cloud, no need to output the CSV
    consoleBox(getLinkToBuild(runId), "green");
  } else {
    badLinks.length && outputBadDataCsv(badLinks);

    // if (htmlIssues) {
    // 	printHtmlIssuesToConsole(htmlIssues);
    // }
  }
};

/**
 * Get Pass/Fail Evaluation
 * @param {array} atrSummary - Artillery data
 * @param {array} lh - lighthouse data
 * @param {array} badLinks - list of broken links
 * @param {array} codeAuditorIssues - List of Code Auditor Issues
 * @param {object} htmlIssuesSummary - Html Issue Summary
 * @param {object} reqThreshold - required perf threshold param
 * @param {object} reqLoadThres - required load threshold param
 */
exports.getFinalEval = (
  atrSummary,
  lh,
  badLinks,
  codeAuditorIssues,
  htmlIssuesSummary,
  reqThreshold,
  reqLoadThres
) => {
  let lhScaled;
  if (lh) {
    // output Lighthouse Score Box
    lhScaled = {
      performanceScore: Math.round(lh.performanceScore * 100),
      seoScore: Math.round(lh.seoScore * 100),
      accessibilityScore: Math.round(lh.accessibilityScore * 100),
      bestPracticesScore: Math.round(lh.bestPracticesScore * 100),
      average: Math.round(
        ((lh.performanceScore +
          lh.seoScore +
          lh.bestPracticesScore +
          lh.accessibilityScore) /
          5) *
          100
      ),
    };
  }

  // check if pass perf threshold or not
  let failedThreshold = false;
  if (reqThreshold) {
    if (
      (reqThreshold.performanceScore &&
        lhScaled.performanceScore < reqThreshold.performanceScore) ||
      (reqThreshold.accessibilityScore &&
        lhScaled.accessibilityScore < reqThreshold.accessibilityScore) ||
      (reqThreshold.bestPracticesScore &&
        lhScaled.bestPracticesScore < reqThreshold.bestPracticesScore) ||
      (reqThreshold.seoScore && lhScaled.seoScore < reqThreshold.seoScore) ||
      (reqThreshold.average && lhScaled.average < reqThreshold.average)
    ) {
      consoleBox(
        `!!! FAILED Required Threshold: AVG=${reqThreshold.average.toFixed(
          1
        )} Performance=${reqThreshold.performanceScore} Accessibility=${
          reqThreshold.accessibilityScore
        } Best practices=${reqThreshold.bestPracticesScore} SEO=${
          reqThreshold.seoScore
        }`,
        "red"
      );
      failedThreshold = true;
    }
  }

  // check if pass load test threshold or not
  let failedLoadThres = false;
  if (reqLoadThres) {
    if (
      (reqLoadThres.latencyMedian &&
        atrSummary.latencyMedian < reqLoadThres.latencyMedian) ||
      (reqLoadThres.latencyP95 &&
        atrSummary.latencyP95 < reqLoadThres.latencyP95) ||
      (reqLoadThres.latencyP99 &&
        atrSummary.latencyP99 < reqLoadThres.latencyP99) ||
      (reqLoadThres.errors && atrSummary.errors < reqLoadThres.errors)
    ) {
      consoleBox(`!!! FAILED Load Threshold`, "red");
      failedLoadThres = true;
    }
  }

  const getHtmlHintErrors = R.pipe(
    R.keys,
    R.filter((x) => HTMLERRORS.indexOf(x) >= 0)
  );

  let htmlErrors = htmlIssuesSummary
    ? getHtmlHintErrors(htmlIssuesSummary)
    : [];

  if (
    badLinks.length === 0 &&
    failedThreshold === true &&
    failedLoadThres === true &&
    codeAuditorIssues.filter((x) => !!x.error).length === 0 &&
    htmlErrors.length === 0
  ) {
    consoleBox(`No Errors Detected`, "green");
    return "PASS";
  }
  consoleBox(`Errors Detected`, "red");
  return "FAIL";
};

exports.convertSpecialCharUrl = (url) => {
  // Replace special characters in URL string
  const specialChars = {
    ':': '%3A',
    '/': '%2F'
  };
  return url.replace(/[:/]/g, m => specialChars[m]);
};
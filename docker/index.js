const chalk = require("chalk");
const yargs = require("yargs");
const {
  getConfigs,
  getPerfThreshold,
  postData,
  getLoadThreshold,
  addHTMLHintRulesForScan,
  getHTMLHintRules,
  getAlertEmailAddresses,
  getAlertEmailConfig,
  getAllScanSummaryFromUrl
} = require("./api");
const {
  printTimeDiff,
  readLighthouseReport,
  consoleBox,
  readCsv,
  printResultsToConsole,
  runBrokenLinkCheck,
  runHtmlHint,
  processBrokenLinks,
  getFinalEval,
  sendAlertEmail,
  runLighthouseReport,
  runK6LoadTest,
  readK6Results
} = require("./utils");
const { htmlHintConfig } = require("./api");
const { addCustomHtmlRule } = require("./customHtmlRules");

const LIGHTHOUSEFOLDER = "./lhr.json";
const K6RESULT = "./LoadTestResults.json";

const PACKAGE_CONFIG = require('./package-lock.json');

let _args = {};

const _getAgrs = () => {
  _args = yargs
    .usage("Usage: -url <url>")
    .option("url", {
      describe: "URL to scan",
      type: "string",
      demandOption: true,
    })
    .option("token", {
      alias: "t",
      describe: "Dashboard token (sign up at https://codeauditor.com/)",
      type: "string",
      demandOption: false,
    })
    .option("buildId", {
      describe: "Build/Run number, e.g. CI Build number",
      type: "string",
      demandOption: false,
    })
    .option("debug", {
      describe: "Turn on debug mode",
      type: "boolean",
      default: false,
    })
    .option("htmlhint", {
      describe: "Run html audit using htmlhint",
      type: "boolean",
      default: true,
    })
    .option("linkcheck", {
      describe: "Check for broken links",
      type: "boolean",
      default: true,
    })
    .option("whitelist", {
      describe: "List of URL glob pattern to Ignore in CSV format",
      type: "string",
      demandOption: false,
    })
    .option("ignorefile", {
      describe: "static Code Auditor ignore file",
      type: "string",
      demandOption: false,
    })
    .option("rules", {
      describe: "folder containing the rules to check",
      type: "string",
      demandOption: false,
    })
    .option("maxthread", {
      describe: "maximum number of concurrent requests for broken links check",
      type: "number",
      demandOption: false,
    })
    .option("lighthouse", {
      describe: "Include Lighthouse audit",
      type: "boolean",
      default: true,
    })
    .option("k6", {
      describe: "Include k6 load test",
      type: "boolean",
      default: true,
    })
    .option("disableUrlFormatter", {
      describe: "Disable formatting URLs",
      type: "boolean",
      default: false,
    })
    .option("private", {
      describe: "Upload scan results privately",
      type: "boolean",
      default: false,
    }).argv;
  return _args;
};

const main = async () => {
  const options = _getAgrs();
  const startTime = new Date();

  let _cloc;
  let _codeAuditor = [];

  // Standardize url string
  if (!options.disableUrlFormatter) {
    if (!options.url.startsWith("https://")) {
      options.url = "https://" + options.url;
    }  
    if (!options.url.endsWith("/")) {
      options.url = options.url + '/';
    }
  }

  // Lighthouse
  if (options.lighthouse) {
    writeLog(`start lighthouse`);
    await runLighthouseReport(options.url);
  }

  // k6 Load Test
  if (options.k6) {
    runK6LoadTest(options.url, writeLog)   
  }

  writeLog(
    chalk.yellowBright(
      `Scanning ${chalk.green(options.url)} ${
        options.maxthread ? ` with max thread of ${options.maxthread}` : ""
      }`
    )
  );

  // Linkauditor
  const [result, error] = runBrokenLinkCheck(options.url, options.maxthread);
  writeLog(`scan finished`, result);
  if (error) {
    console.error(`Error scanning broken links: ${error}`);
    process.exit(1);
  }

  // Process written files and upload via Firebase Function
  processAndUpload(
    options,
    startTime,
    "./all_links.csv",
    _cloc,
    _codeAuditor
  );
};

/**
 *
 * @param {*} args - command line options
 * @param {Date} startTime - start time
 * @param {string} file - file containing all scanned URLs
 * @param {*} cloc - Count Line of Code output
 * @param {*} codeAuditor - Static Code Analysis output
 */
const processAndUpload = async (
  args,
  startTime,
  file,
  cloc,
  codeAuditor
) => {
  let ignoredUrls;
  let perfThreshold;
  let loadThreshold;
  let lhrSummary;
  let lhr;
  let k6Report = {};
  let runId;
  let htmlIssuesSummary = null;
  let htmlIssues = null;
  let whiteListed = [];
  let allBadUrls = [];
  let badUrls = [];
  let selectedHtmlHintRules;

  const results = await readCsv(file);

  const [took, sec] = printTimeDiff(new Date(), startTime);

  writeLog(`Took ${sec} seconds`);

  if (args.lighthouse) {
    [lhr, lhrSummary] = readLighthouseReport(LIGHTHOUSEFOLDER, writeLog);
  }

  if (args.k6) {
    await readK6Results(K6RESULT, writeLog).then(val => {
      k6Report = val[0];
      k6ReportSummary = val[1];
    });
  }

  if (args.htmlhint) {
    if (args.token) {
      await addCustomHtmlRule(args.token, args.url);
    } else {
      await addCustomHtmlRule();
    };
    [htmlIssuesSummary, htmlIssues, selectedHtmlHintRules] = await runHtmlHint(
      args.url,
      results,
      writeLog,
      args.token
    );
  }

  if (args.token) {
    writeLog(`Retrieving config for token`, args.token);

    try {
      ignoredUrls = await getConfigs(args.token);
      writeLog(`Ignored URLs`, ignoredUrls);
    } catch (error) {
      console.error("failed to load settings");
    }

    if (args.lighthouse) {
      writeLog(`getting perf threshold for `, args.url);
      try {
        perfThreshold = await getPerfThreshold(args.token, args.url);
        perfThreshold && writeLog(`Performance Threshold`, perfThreshold);
      } catch (error) {
        console.error("failed to load perfthreshold");
      }
    }
  }

  let finalEval = getFinalEval(
    lhrSummary,
    badUrls,
    codeAuditor,
    htmlIssuesSummary,
    perfThreshold,
    loadThreshold
  );

  writeLog(`finalEval is: `, finalEval);

  if (args.linkcheck) {
    [allBadUrls, whiteListed] = processBrokenLinks(
      args.url,
      results,
      ignoredUrls,
      writeLog,
      args.whitelist
    );
    writeLog("Url found in WhiteList are", whiteListed);
    badUrls = allBadUrls.filter((x) => whiteListed.indexOf(x.dst) < 0);
  }

  if (args.token) {
    try {
      runId = await postData(args.token, args.buildId, {
        totalScanned: results.length,
        scanDuration: sec,
        url: args.url,
        badUrls,
        whiteListed,
        lhr,
        k6Report,
        cloc: cloc,
        code: codeAuditor,
        selectedHtmlHintRules,
        htmlIssuesSummary,
        htmlIssues,
        isPrivate: args.private,
        finalEval,
        buildVersion: PACKAGE_CONFIG.version,
      });
    } catch (error) {
      console.error(
        `Error: Unable to push data to dashboard service => ${error.message}`
      );
    }
  }

  // Upload selected HTMLHint Rules to the scan
  if (args.htmlhint && selectedHtmlHintRules?.length > 0 && args.token && runId) {
    const res = await addHTMLHintRulesForScan(args.token, args.url, runId, selectedHtmlHintRules)

    if (res) {
      console.log('Uploaded selected HTMLHint Rules successfully');
    } else {
      throw new Error("Failed to add custom html rules for each scan");
    }
  }

  printResultsToConsole(
    results,
    lhrSummary,
    k6ReportSummary,
    runId,
    badUrls,
    whiteListed,
    htmlIssuesSummary,
    took
  );

  // Send alert email to shared participants
  if (args.token) {
    const emailConfig = await getAlertEmailConfig(args.token)
    
    if (emailConfig) {
      const alertEmails = await getAlertEmailAddresses(args.token, args.url)
      
      if (alertEmails && alertEmails.length > 0) {

        // Get latest scan summary
        let res = await getAllScanSummaryFromUrl(args.token, args.url)
        let scanSummary = await res[0]

        alertEmails.forEach(item => sendAlertEmail(item.emailAddress, emailConfig, scanSummary))
      }
    } else {
      throw new Error("Fail to fetch alert email config")
    }
  }
};

const writeLog = (...msg) => _args.debug && console.log(...msg);

main();
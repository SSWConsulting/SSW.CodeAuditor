const fs = require("fs");
const { execSync } = require("child_process");
const chalk = require("chalk");
const yargs = require("yargs");
const {
  getConfigs,
  getPerfThreshold,
  postData,
  getLoadThreshold,
  addHTMLHintRulesForScan,
  getHTMLHintRules,
} = require("./api");
const {
  printTimeDiff,
  readLighthouseReport,
  readArtilleryReport,
  consoleBox,
  readCsv,
  printResultsToConsole,
  runCodeAuditor,
  countLineOfCodes,
  runBrokenLinkCheck,
  runHtmlHint,
  processBrokenLinks,
  getFinalEval,
} = require("./utils");

const { readGithubSuperLinter } = require("./parseSuperLinter");

const LIGHTHOUSEFOLDER = "./.lighthouseci/";
const ARTILLERYFOLDER = "./artilleryOut.json";

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
      default: false,
    })
    .option("artillery", {
      describe: "Include Artillery test",
      type: "boolean",
      default: true,
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
  let _superlinter = [];

  if (!options.url.startsWith("https://")) {
    options.url = "https://" + options.url;
  }

  // Static Code Analysis and CLOC - Not use (remove once approved from Anthony)
  // if (fs.readdirSync('./src').length > 0) {
  // 	writeLog(chalk.yellowBright(`Counting lines of codes`));
  // 	const [result, error] = countLineOfCodes(writeLog);
  // 	if (!error) {
  // 		_cloc = result;
  // 	}

  // 	const [resultCode, errorCode] = runCodeAuditor(
  // 		options.ignorefile,
  // 		options.rules
  // 	);
  // 	if (errorCode) {
  // 		writeLog(`Error running SSWCodeAuditor command: ${error}`);
  // 	}
  // 	writeLog(resultCode);

  // 	_codeAuditor = resultCode;
  // 	let codeSummary = '';
  // 	if (_codeAuditor) {
  // 		const errors = _codeAuditor.filter((x) => !!x.error);
  // 		const warns = _codeAuditor.filter((x) => !x.error);
  // 		codeSummary = ` Errors=${errors.length} Warnings=${warns.length}`;
  // 	}

  // 	// output the result
  // 	consoleBox(
  // 		`Codes: Files=${result.header.n_files} Lines=${result.header.n_lines}${codeSummary}`,
  // 		'green'
  // 	);
  // }

  // Github Superlinter - Not use (remove once approved from Anthony)
  // if (fs.existsSync('./src/superlinter.log')) {
  // 	writeLog(
  // 		`We have github SuperLinter output file at ./src/superlinter.log`
  // 	);
  // 	_superlinter = readGithubSuperLinter('./src/superlinter.log');
  // 	writeLog(`total number of issues found`, _superlinter.length);
  // }

  // Lighthouse
  if (
    options.lighthouse &&
    fs.existsSync("/etc/apt/sources.list.d/google.list")
  ) {
    writeLog(`start lighthouse`);
    try {
      const rs = execSync(
        `./node_modules/.bin/lhci collect --url="${options.url}" -n 1`
      ).toString();
      writeLog(`lighthouse check finished`, rs);
    } catch (e) {
      writeLog(`lighthouse check failed`, e);
    }
  }

  // Artillery
  if (options.artillery) {
    writeLog(`start artillery`);
    try {
      const rs = execSync(
        `./node_modules/.bin/artillery quick -d 20 -r 10 -k -o artilleryOut.json "${options.url}"`
      ).toString();
      writeLog(`artillery check finished`, rs);
    } catch (e) {
      writeLog(`artillery check failed`, e);
    }
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
    writeLog(`Error running command: ${error}`);
    process.exit(1);
  }

  // Process written files and upload via Firebase Function
  processAndUpload(
    options,
    startTime,
    "./all_links.csv",
    _cloc,
    _codeAuditor,
    _superlinter
  );
};

/**
 *
 * @param {*} args - command line options
 * @param {Date} startTime - start time
 * @param {string} file - file containing all scanned URLs
 * @param {*} cloc - Count Line of Code output
 * @param {*} codeAuditor - Static Code Analysis output
 * @param {*} superLinter - Super linter output
 */
const processAndUpload = async (
  args,
  startTime,
  file,
  cloc,
  codeAuditor,
  superLinter
) => {
  let ignoredUrls;
  let perfThreshold;
  let loadThreshold;
  let lhrSummary;
  let lhr;
  let atr;
  let atrSummary;
  let runId;
  let htmlIssuesSummary = null;
  let htmlIssues = null;
  let whiteListed = [];
  let allBadUrls = [];
  let badUrls = [];

  const results = await readCsv(file);

  const [took, sec] = printTimeDiff(new Date(), startTime);

  writeLog(`Took ${sec} seconds`);

  if (args.lighthouse) {
    [lhr, lhrSummary] = readLighthouseReport(LIGHTHOUSEFOLDER, writeLog);
  }

  if (args.artillery) {
    [atr, atrSummary] = readArtilleryReport(ARTILLERYFOLDER, writeLog);
  }

  const { addCustomHtmlRule } = require("./customHtmlRules");
  if (args.htmlhint) {
    addCustomHtmlRule();
    [htmlIssuesSummary, htmlIssues] = await runHtmlHint(
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

    if (args.artillery) {
      writeLog(`getting load test threshold for `, args.url);
      try {
        loadThreshold = await getLoadThreshold(args.token, args.url);
        loadThreshold && writeLog(`Load Test Threshold`, loadThreshold);
      } catch (error) {
        console.error("failed to load loadThreshold");
      }
    }
  }

  let finalEval = getFinalEval(
    atrSummary,
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
        atr,
        cloc: cloc,
        code: codeAuditor,
        htmlIssuesSummary,
        htmlIssues,
        isPrivate: args.private,
        finalEval,
        buildVersion: PACKAGE_CONFIG.version
      });
    } catch (error) {
      console.error(
        `Error: Unabled to push data to dashboard service => ${error.message}`
      );
    }
  }

    printResultsToConsole(
    results,
    lhrSummary,
    runId,
    badUrls,
    whiteListed,
    htmlIssuesSummary,
    took,
    atrSummary
  );

  // Upload selected HTMLHint Rules to the scan
  if (args.htmlhint && runId) {
    const result = await getHTMLHintRules(args.token, args.url);

    if (result) {
      const selectedRules = result.selectedRules;
      const res = await addHTMLHintRulesForScan(args.token, args.url, runId, selectedRules)
  
      if (res.ok) {
        console.log('Upload selected HTMLHint Rules successfully')
      } else {
        throw new Error("Failed to load");
      }
    }
  }
};

const writeLog = (...msg) => _args.debug && console.log(...msg);

main();
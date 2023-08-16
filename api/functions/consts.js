exports.CONSTANTS = {
	users: 'users',
	apiKey: 'apiKey',
	runs: 'runs',
	config: 'config',
};

exports.TABLE = {
	Scans: 'Scans',
	IgnoredUrls: 'IgnoredUrls',
	PerformanceThreshold: 'PerformanceThreshold',
	LoadThreshold: 'LoadThreshold',
	Subscriptions: 'Subscriptions',
	ScanResults: 'ScanResults',
	htmlhintrules: 'htmlhintrules',
	alertEmailAddresses: 'alertEmailAddresses',
};

// blob storage names cannot have uppercase or numbers
exports.BLOB = {
	lhr: 'lhr',
	atr: 'atr',
	htmlhint: 'htmlhint',
	codeAuditor: 'codeauditor',
};

exports.unscannableLinks = [
	{url: "https://learn.microsoft.com/en-us/"},
	{url: "https://support.google.com/"},
	{url: "https://twitter.com/"},
	{url: "https://marketplace.visualstudio.com/"},
	{url: "https://www.nuget.org/"},
	{url: "https://make.powerautomate.com"},
	{url: "https://www.microsoft.com/"},
	{url: "http://www.microsoft.com/"},
	{url: "https://answers.microsoft.com/"},
	{url: "https://admin.microsoft.com/"},
	{url: "https://ngrx.io"},
	{url: "https://twitter.com"},
	{url: "https://marketplace"},
	{url: "https://www.nuget.org/"},
	{url: "http://nuget.org"},
	{url: "https://t.co"},
	{url: "https://support.google.com"},
	{url: "https://playwright.dev"},
	{url: "https://www.theurlist.com/xamarinstreamers"},
	{url: "https://dev.botframework.com"},
	{url: "https://www.ssw.com.au/rules/rules-to-better-research-and-development/"},
	{url: "https://www.ato.gov.au/Business/Research-and-development-tax-incentive/"},
	{url: "https://learn.microsoft.com/en-us/assessments/?mode=home/"}
  ]
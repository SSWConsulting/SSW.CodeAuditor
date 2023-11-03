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
	UnscannableLinks: 'UnscannableLinks',
	HtmlRulesCustomOptions: 'HtmlRulesCustomOptions'
};

// blob storage names cannot have uppercase or numbers
exports.BLOB = {
	lhr: 'lhr',
	atr: 'atr',
	htmlhint: 'htmlhint',
	codeAuditor: 'codeauditor',
};

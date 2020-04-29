const fetch = require('node-fetch');
const slug = require('slug');
const endpoint =
	'https://asia-northeast1-sswlinkauditor-c1131.cloudfunctions.net';

exports.postData = (api, buildId, data) => {
	return fetch(`${endpoint}/api/scanresult/${api}/${buildId || '-'}`, {
		method: 'POST',
		body: JSON.stringify(data),
		headers: { 'Content-Type': 'application/json' },
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
			throw Error('Failed to load config');
		}
	});
};

exports.getPerfThreshold = (api, url) => {
	return fetch(
		`${endpoint}/api/config/${api}/perfthreshold/${slug(url)}`
	).then((res) => {
		if (res.ok) {
			return res.json();
		} else {
			throw Error('Failed to load config');
		}
	});
};

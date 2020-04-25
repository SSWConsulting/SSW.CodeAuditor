const csv = require('csv-parser');
const fs = require('fs');
const { execSync } = require('child_process');
const chalk = require('chalk');
const fetch = require('node-fetch');
const boxen = require('boxen');
const yargs = require('yargs');
const endpoint = 'https://us-central1-sswlinkauditor-c1131.cloudfunctions.net';

exports.postData = (api, buildId, data) => {
	const url = `${endpoint}/api/scanresult/${api}/${buildId || '-'}`;
	return fetch(url, {
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
	const url = `${endpoint}/api/config/${api}/ignore`;
	return fetch(url).then((res) => {
		if (res.ok) {
			return res.json();
		} else {
			throw Error('Failed to load config');
		}
	});
};

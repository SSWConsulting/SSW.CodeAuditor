const fetch = require('node-fetch');
const FormData = require('form-data');

const loginUsingFormData = (url, formData) => {
	const parseCookies = (cookie) =>
		cookie
			.map((entry) => {
				const parts = entry.split(';');
				const cookiePart = parts[0];
				return cookiePart;
			})
			.join(';');

	return new Promise((resolve, reject) => {
		const form = new FormData();
		Object.keys(formData).forEach((k) => {
			form.append(k, formData[k]);
		});

		form.submit(url, async (err, res) => {
			if (err) reject(err);

			if (res.headers['set-cookie']) {
				resolve(parseCookies(res.headers['set-cookie']));
			}
			resolve(null);
		});
	});
};

const test = async () => {
	const cookie = await loginUsingFormData(
		'https://ssw.sswtimepro.com/Account/LogOn',
		{
			Email: 'anthonynguyen@ssw.com.au',
			Password: 'PASSWORD',
		}
	);
	const timesheet = await fetch('https://ssw.sswtimepro.com/Timesheet', {
		headers: { Cookie: cookie },
	});
	const html = await timesheet.text();
	console.log(html);
};

test();

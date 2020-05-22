const puppeteer = require('puppeteer');
const html = require('html5parser');
const fetch = require('node-fetch');

async function getLinksViaFetch(url) {
	const resp = await fetch(url);
	const body = await resp.text();
	return parseLinks(url, body);
}

const getLinksViaPuppeteer = async (url) => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(url);
	const pageContent = await page.content();
	await browser.close();
	return parseLinks(url, pageContent);
};

function parseLinks(url, body) {
	const ast = html.parse(body);
	let links = [];
	html.walk(ast, {
		enter: (node) => {
			if (
				node.type === html.SyntaxKind.Tag &&
				['a', 'img', 'link', 'iframe'].indexOf(node.name) >= 0
			) {
				const href = node.attributes.find(
					(a) => ['href', 'src'].indexOf(a.name.value) >= 0
				);

				const text =
					node.body && node.body.find((x) => x.type === 'Text');

				links.push({
					linkType: node.name,
					srcUrl: url,
					url: href && href.value && href.value.value,
					anchor: ((text && text.value) || '').trim(),
				});
			}
		},
	});

	return links;
}

console.time('took');
getLinksViaFetch('https://azuregems.io/')
	.then((x) => {
		console.timeEnd('took');
		console.log('found urls:', x.length);
		return null;
	})
	.catch((e) => {
		console.log(e);
	});

import { serve } from 'https://deno.land/std@0.50.0/http/server.ts';
import * as html from 'https://cdn.pika.dev/html5parser@^1.1.2';
import { parse } from 'https://deno.land/std/flags/mod.ts';
import urlJoin from 'https://cdn.pika.dev/proper-url-join@^2.1.1';
import * as urlP from 'https://cdn.pika.dev/native-url@^0.2.6';
import { Application } from 'https://deno.land/x/oak/mod.ts';
import { Router } from 'https://deno.land/x/oak/mod.ts';

async function startWebServer(port) {
	const app = new Application();
	const router = new Router();

	app.use(router.routes());
	app.use(router.allowedMethods());
	app.use(({ response }) => {
		response.status = 404;
		response.body = { status: 'Not Found' };
	});

	router.get('/', ({ response }) => {
		response.body = 'Todo list rest api using deno runtime';
	});

	console.log(
		`Server is running in ${port} \nOpen: http://localhost:${port}`
	);
	await app.listen({ port });
}

function parseUrl(startUrl, url) {
	url = url.trim();
	if (url.indexOf('#') > 0) {
		url = url.split('#')[0];
	}

	if (url.indexOf('?') > 0) {
		url = url.split('?')[0];
	}

	if (url.indexOf('http') === 0) {
		return url;
	}

	const sUrl = urlP.parse(startUrl);
	if (url.indexOf('//') === 0) {
		return sUrl.protocol + url;
	} else if (url.indexOf('/') === 0) {
		return sUrl.protocol + '//' + sUrl.host + url;
	}

	return urlP.resolve(startUrl, url);
}

function isProtocolUrl(url) {
	const found = url.match(/^[a-z]+:[^\/\/]/g);
	return found && found.length > 0;
}

function isResourceFile(url) {
	const found = url.match(/.*\.(mht|jpg|png|css|js|ico|gif|svg|mp3|ttf)/g);
	return found && found.length > 0;
}

function startScan(url) {
	let allUrls = {};
	const startUrl = {
		linkType: 'a',
		url,
		srcUrl: '',
		anchor: '',
	};
	let start = new Date();

	let max = 1;
	let crawling = 1;

	const newUrlFound = (link) => {
		if (!link.url) {
			return;
		}

		if (
			isProtocolUrl(link.url) ||
			link.url.indexOf('#') === 0 ||
			link.url.indexOf('?') === 0
		) {
			return;
		}

		link.url = parseUrl(link.srcUrl, link.url);

		if (!(link.url in allUrls)) {
			allUrls[link.url] = { ...link };
			crawling++;
			if (crawling > max) {
				max = crawling;
			}
			if (
				link.url.indexOf(startUrl.url) === 0 &&
				link.linkType === 'a' &&
				!isResourceFile(link.url)
			) {
				crawl(link, newUrlFound, newUrlChecked, crawling);
			} else {
				check(link, newUrlChecked, crawling);
			}
		}
	};

	const newUrlChecked = (link) => {
		console.log('DONE', crawling, link.url, link.statusCode, link.status);
		crawling--;
		allUrls[link.url] = link;
	};

	crawl(startUrl, newUrlFound, newUrlChecked, crawling);

	return new Promise((resolve) => {
		const intv = setInterval(() => {
			if (crawling < 1) {
				clearInterval(intv);
				console.log('done');
				resolve({ max, links: Object.values(allUrls) });
			}
		}, 200);
	});
}

async function check(link, linkStat, crawler) {
	try {
		console.log('CHECK', crawler, link.url);
		const resp = await fetch(link.url, {
			method: 'HEAD',
		});
		linkStat({
			url: link.url,
			srcUrl: link.srcUrl,
			statusCode: resp.status,
			status: resp.status,
		});
	} catch (error) {
		linkStat({
			url: link.url,
			srcUrl: link.srcUrl,
			statusCode: '0',
			status: error.message,
		});
	}
}
async function crawl(link, newLink, linkStat, crawler) {
	try {
		console.log('CRAWL', crawler, link.url);
		const resp = await fetch(link.url);

		const body = await resp.text();

		// notify success first for this URL
		linkStat({
			url: link.url,
			srcUrl: link.srcUrl,
			statusCode: resp.status,
			status: resp.status,
		});

		const links = getLinks(link.url, body);
		links.forEach((url) => {
			newLink(url);
		});
	} catch (error) {
		linkStat({
			url: link.url,
			srcUrl: link.srcUrl,
			statusCode: '0',
			status: error.message,
		});
	}
}

function getLinks(url, body) {
	const ast = html.parse(body);
	let links = [];
	html.walk(ast, {
		enter: (node) => {
			if (
				node.type === html.SyntaxKind.Tag &&
				['a', 'img', 'link', 'iframe'].indexOf(node.name) >= 0
			) {
				const href = node.attributes?.find(
					(a) => ['href', 'src'].indexOf(a.name.value) >= 0
				);

				const text =
					node.body && node.body.find((x) => x.type === 'Text');

				links.push({
					linkType: node.name,
					srcUrl: url,
					url: href?.value?.value,
					anchor: (text?.value || '').trim(),
				});
			}
		},
	});

	return links;
}

function main() {
	const start = new Date();
	const { args } = Deno;
	const { url, port } = parse(args);
	if (!url) {
		console.log(`starting web server..`);
		startWebServer(8080);
	} else if (url) {
		startScan(url).then((res) => {
			const links = res.links;
			const took = new Date().getTime() - start.getTime();
			console.log(`took ${took / 1000} seconds`);
			console.log(
				`total scanned ${links.length}, max thread: ${res.max}`
			);
			const broken = links.filter(
				(x) => +x.statusCode < 200 || +x.statusCode > 300
			);
			console.log(`total broken ${broken.length}`);
			broken.forEach((l) => {
				console.log(`${l.srcUrl} -> ${l.url} -> ${l.statusCode}`);
			});
		});
	}
}

main();

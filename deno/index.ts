import { serve } from 'https://deno.land/std@0.50.0/http/server.ts';
import * as html from 'https://cdn.pika.dev/html5parser@^1.1.2';
import { parse } from 'https://deno.land/std/flags/mod.ts';
import urlJoin from 'https://cdn.pika.dev/proper-url-join@^2.1.1';
import * as urlP from 'https://cdn.pika.dev/native-url@^0.2.6';

interface Link {
	linkType: string;
	srcUrl: string;
	url: string;
	anchor: string;
}

interface LinkStatus {
	url: string;
	srcUrl: string;
	status: string;
	statusCode: string;
	anchor: string;
}

async function startWebServer(port: number) {
	const s = serve({ port });
	console.log('open => http://localhost:8000/');
	for await (const req of s) {
		if (req.url.indexOf('/scan?url=') >= 0) {
			const url = req.url.split('=')[1];
			const urls = await startScan(url);
			req.respond({ body: JSON.stringify(urls) });
		} else {
			req.respond({ body: 'Invalid Request' });
		}
	}
}

function parseUrl(startUrl: string, url: string): string {
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

function isProtocolUrl(url: string) {
	const regex = /^[a-z]+:[^\/\/]/g;
	const found = url.match(regex);
	return found && found.length > 0;
}

function isResourceFile(url: string) {
	const regex = /.*\.(mht|jpg|png|css|js|ico|gif|svg|mp3|ttf)/g;
	const found = url.match(regex);
	return found && found.length > 0;
}

function startScan(url: string) {
	let allUrls: any = {};
	const startUrl: Link = {
		linkType: 'a',
		url,
		srcUrl: '',
		anchor: '',
	};
	let start = new Date();

	let max = 1;
	let crawling = 1;

	const newUrlFound = (link: Link) => {
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

	const newUrlChecked = (link: LinkStatus) => {
		console.log('DONE', crawling, link.url, link.statusCode, link.status);
		crawling--;
		allUrls[link.url] = link;
	};

	crawl(startUrl, newUrlFound, newUrlChecked, crawling);

	return new Promise((resolve, rejecte) => {
		const intv = setInterval(() => {
			if (crawling < 1) {
				clearInterval(intv);
				console.log('done');
				resolve({ max, links: Object.values(allUrls) });
			}
		}, 200);
	});
}

async function check(link: Link, linkStat: any, crawler: number) {
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
async function crawl(link: Link, newLink: any, linkStat: any, crawler: number) {
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

function getLinks(url: string, body: string): Link[] {
	const ast = html.parse(body);
	let links: Link[] = [];
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
					node.body &&
					(node.body.find((x) => x.type === 'Text') as any);

				links.push({
					linkType: node.name,
					srcUrl: url,
					url: href?.value?.value as string,
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
	if (!url && port) {
		startWebServer(+port);
	} else if (url) {
		startScan(url).then((res: any) => {
			const links = res.links;
			const took = new Date().getTime() - start.getTime();
			console.log(`took ${took / 1000} seconds`);
			console.log(
				`total scanned ${links.length}, max thread: ${res.max}`
			);
			const broken = links.filter(
				(x: LinkStatus) => +x.statusCode < 200 || +x.statusCode > 300
			);
			console.log(`total broken ${broken.length}`);
			broken.forEach((l: LinkStatus) => {
				console.log(`${l.srcUrl} -> ${l.url} -> ${l.statusCode}`);
			});
		});
	}
}
main()

import { serve } from 'https://deno.land/std@0.50.0/http/server.ts';
import * as html from 'https://cdn.pika.dev/html5parser@^1.1.2';

const s = serve({ port: 8000 });
console.log('open => http://localhost:8000/');
for await (const req of s) {
	if (req.url.indexOf('/scan?url=') >= 0) {
		const url = req.url.split('=')[1];
		const urls = await scanUrl(url);
		req.respond({ body: JSON.stringify(urls) });
	} else {
		req.respond({ body: 'Invalid Request' });
	}
}

async function scanUrl(url: string) {
	const resp = await fetch(url);
	const body = await resp.text();
	
	return getLinks(body);
}

function getLinks(body: string) {
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
					type: node.name,
					dest: href?.value?.value as string,
					anchor: (text?.value || '').trim(),
				});
			}
		},
	});

	return links;
}

interface Link {
	type: string;
	dest: string;
	anchor: string;
}

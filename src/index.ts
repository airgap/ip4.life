const facts: string[] = [/*facts*/];

const html = `/*html*/`;

addEventListener('fetch', (event: FetchEvent) => {
    event.respondWith(handleRequest(event.request))
})

/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request: Request) {
    const url = /^[^\/]+?:\/\/[^\/]+?(\/.+)$/.exec(request.url)?.[1] ?? '/';
    const remoteAddress = request.headers.get("CF-Connecting-IP") ?? 'Unable to detect IP address';
    const isIpv6 = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/.exec(remoteAddress);
    const addr = /^::ffff:(.+)$/.exec(remoteAddress)?.[1] ?? remoteAddress,
        isIpv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.exec(addr);
    const responses: { [key: string]: { body: string, type: string } } = {
        '': {
            body: html
                .replace(/%%ip%%/g, addr)
                .replace(/<!--fact-->/g, facts[~~(Math.random() * facts.length)]),
            type: 'html'
        },
        auto: {
            type: 'plain',
            body: addr
        },
        v4: {
            type: 'plain',
            body: isIpv4 ? addr : 'N/A'
        },
        v6: {
            type: 'plain',
            body: isIpv6 ? remoteAddress : 'N/A'
        },
        json: {
            type: 'json',
            body: JSON.stringify({
                v4: isIpv4 ? addr : 'N/A',
                v6: isIpv6 ? remoteAddress : 'N/A'
            }, null, 4)
        },
        xml: {
            type: 'xml',
            body: `<?xml version="1.0" encoding="UTF-8"?>
<addresses>
    <v4>${isIpv4 ? addr : 'N/A'}</v4>
    <v6>${isIpv6 ? remoteAddress : 'N/A'}</v6>
</addresses>`
        },
        status: {
            type: 'plain',
            body: 'online'
        }
    };
    const format = responses[url.substr(1)];
    return new Response(format?.body ?? (
        /^\/v[0-9]+$/.test(url)
            ? 'u wot m8'
            : `<h1 style="font-family: monospace">404, Page not found...sorry m8</h1>`
    ), {
        status: 200,
        headers: { "content-type": `text/${format?.type ?? 'html'};charset=UTF-8` }
    })
}
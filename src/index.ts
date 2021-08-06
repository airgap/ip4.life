const facts: string[] = [/*facts*/];

const html = `/*html*/`;

/**
 * Respond to the request
 * @param {Request} request
 */
function handleRequest(request: Request): Response {

    // Get the request path
    const url = /^[^\/]+?:\/\/[^\/]+?(\/.+)$/.exec(request.url)?.[1] ?? '/';

    // Get the request IP address
    const remoteAddress = request.headers.get("CF-Connecting-IP") ?? 'Unable to detect IP address';

    // Is the address IPv6?
    const isIpv6 = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/.exec(remoteAddress);

    // I don't know
    const addr = /^::ffff:(.+)$/.exec(remoteAddress)?.[1] ?? remoteAddress,
        isIpv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.exec(addr);

    // Determine the appropriate response
    const responses: { [key: string]: { body: string, type: string } } = {

        // Deliver the HTML page
        '': {
            body: html
                .replace(/%%ip%%/g, addr)
                .replace(/<!--fact-->/g, facts[~~(Math.random() * facts.length)]),
            type: 'html'
        },

        // Deliver the raw IP address
        auto: {
            type: 'plain',
            body: addr
        },

        // Deliver the IPv4 address or N/A if unavailable
        v4: {
            type: 'plain',
            body: isIpv4 ? addr : 'N/A'
        },

        // Deliver the IPv6 address or N/A if unavailable
        v6: {
            type: 'plain',
            body: isIpv6 ? remoteAddress : 'N/A'
        },

        // Deliver both IPv4 and IPv6 in a JSON format
        json: {
            type: 'json',
            body: JSON.stringify({
                v4: isIpv4 ? addr : 'N/A',
                v6: isIpv6 ? remoteAddress : 'N/A'
            }, null, 4)
        },

        // Deliver both IPv4 and IPv6 in an XML format
        xml: {
            type: 'xml',
            body: `<?xml version="1.0" encoding="UTF-8"?>
<addresses>
    <v4>${isIpv4 ? addr : 'N/A'}</v4>
    <v6>${isIpv6 ? remoteAddress : 'N/A'}</v6>
</addresses>`
        },

        // Get server status
        status: {
            type: 'plain',
            body: 'online'
        }
    };

    // Pick a response based on the path
    const format = responses[url.substr(1)];

    // Respond
    return new Response(format?.body ?? (
        /^\/v[0-9]+$/.test(url)
            ? 'u wot m8'
            : `<h1 style="font-family: monospace">404, Page not found...sorry m8</h1>`
    ), {
        status: 200,
        headers: { "content-type": `text/${format?.type ?? 'html'};charset=UTF-8` }
    })
}

// Listen for requests
addEventListener('fetch', (event: Event) => {
    if (!(event instanceof FetchEvent))
        return;
    event.respondWith(handleRequest(event.request))
});

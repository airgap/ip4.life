import {readFile, writeFile} from 'fs';
import {promisify} from 'util';

const rf = promisify(readFile),
    wf = promisify(writeFile);

(async () => {
    const [html, facts, script, style] = await Promise.all(['src/index.html', 'src/facts.txt', 'compiled/index.js', 'src/index.css'].map(f => rf(f, 'utf8')));
    const out = script
        .replace('/*facts*/', facts.trim().replace(/^.+$/gm, '"$&",'))
        .replace('/*html*/', html)
        .replace('<style></style>', `<style>${style}</style>`);
    await wf('dist/index.js', out);
})()
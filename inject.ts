import { readFile, writeFile } from 'fs/promises';
//const { readFile, writeFile } = require('fs').promises;
export const inject = async () => {
    const [html, facts, script, style]: string[] = await Promise.all([
        ...[
            'src/index.html',
            'src/facts.txt',
            'compiled/index.js',
            'compiled/index.css'
        ].map(f => readFile(f, 'utf8'))
    ]);
    const out = script
        .replace('/*facts*/', facts.trim().replace(/^.+$/gm, '"$&",'))
        .replace('/*html*/', html)
        .replace('<style></style>', `<style>${style}</style>`);
    await writeFile('dist/index.js', out);
};

inject().catch(ex => console.error('Injection failed.', ex));

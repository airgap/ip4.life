import { readFile, writeFile } from 'fs/promises';
import * as mkdirp from 'mkdirp';
import * as rimraf from 'rimraf';
export const inject = async () => {
    const [html, facts, script, style]: string[] = await Promise.all([
        ...[
            'src/index.html',
            'src/facts.txt',
            'compiled/index.js',
            'src/index.css'
        ].map(f => readFile(f, 'utf8')),
        mkdirp('dist'),
        mkdirp('compiled')
    ]);
    const out = script
        .replace('/*facts*/', facts.trim().replace(/^.+$/gm, '"$&",'))
        .replace('/*html*/', html)
        .replace('<style></style>', `<style>${style}</style>`);
    await writeFile('dist/index.js', out);
    rimraf('compiled', () => { });
};

inject().catch(ex => console.error('Injection failed.', ex));

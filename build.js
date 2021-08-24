import esbuild from 'esbuild';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

// iife
bundle('./src/index.cjs', './dist/etto.min.js', { format: 'iife', minify: true, globalName: 'Etto' });

// cjs
bundle('./src/index.js', './dist/etto.cjs', { format: 'cjs', sourcemap: 'external', target: 'node12' });

// esm
bundle('./src/index.js', './dist/etto.js', { format: 'esm', sourcemap: 'external', target: 'es2019' });

function bundle(entry, outfile, config = {}) {
    const opts = {
        target: 'es6',
        entryPoints: [join(__dirname, entry)],
        bundle: true,
        outfile: join(__dirname, outfile),
        ...config
    };

    esbuild.build(opts).then(() => {
        console.log('\x1b[42m%s\x1b[0m', `Bundled: ${outfile}`);
    }).catch((e) => {
        console.error('\x1b[41m%s\x1b[0m', e.message);
    });
}
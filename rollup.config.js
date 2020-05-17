import cjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const isProd = process.env.PROD === 'true';
const isDev = process.env.DEV === 'true';

const input = './src/index.js';

const filenames = {
    iife: isProd ? './dist/etto.min.js'     : './dist/dev/etto-dev.js',
    cjs:  isProd ? './dist/cjs/etto.cjs.js' : './dist/dev/etto-dev.cjs.js',
    es:   isProd ? './dist/esm/etto.esm.js' : './dist/dev/etto-dev.esm.js'
};

const configs = [
    {
        input,
        output: {
            name: 'Etto',
            file: filenames.iife,
            format: 'iife',
            sourcemap: isDev
        },
        plugins: [
            resolve(),
            cjs(),
            isProd && terser(),
            isDev && serve({ contentBase: 'dist', port: 8090 }),
            isDev && livereload('dist')
        ]
    },
    {
        input,
        output: {
            name: 'Etto',
            file: filenames.cjs,
            format: 'cjs',
            sourcemap: !isProd
        },
        plugins: [
            resolve(),
            cjs()
        ]
    },
    {
        input,
        output: {
            name: 'Etto',
            file: filenames.es,
            format: 'es',
            sourcemap: !isProd
        },
        plugins: [
            resolve(),
            cjs()
        ]
    }
];

export default configs;
import cjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import buble from '@rollup/plugin-buble';

import { uglify } from 'rollup-plugin-uglify';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const isProd = process.env.PROD === 'true';
const isDev = process.env.DEV === 'true';

const input = './src/index.js';

const filenames = {
    iife: isProd ? './dist/etto.min.js' : './dist/js/etto-dev.js',
    cjs:  isProd ? './dist/etto.cjs' : './dist/js/etto-dev.cjs',
    es:   isProd ? './dist/etto.mjs' : './dist/js/etto-dev.mjs'
};

const bubleConfig = {
    objectAssign: 'Object.assign'
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
            buble(bubleConfig),
            isProd && uglify(),
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
            cjs(),
            buble(bubleConfig)
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
            cjs(),
            buble(bubleConfig)
        ]
    }
];

export default configs;
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
    iife: isProd ? './dist/etto.min.js' : './dist/etto.js',
    cjs: './dist/etto.cjs.js'
};

const bubleConfig = {
    objectAssign: 'Object.assign',
    // transforms: { dangerousTaggedTemplateString: true }
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
    }
];

export default configs;
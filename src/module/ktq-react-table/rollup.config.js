import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

import postcss from 'rollup-plugin-postcss';

const packageJson = require('./package.json');

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: packageJson.main,
                format: 'cjs',
                sourcemap: true,
            },
            {
                file: packageJson.module,
                format: 'esm',
                sourcemap: true,
            },
        ],
        plugins: [
            peerDepsExternal(),
            resolve(),
            commonjs(),
            typescript({ tsconfig: './tsconfig.json' }),
            terser(),
            postcss({
                extract: true, // Tách CSS ra file riêng
                minimize: true, // Nén CSS
                sourceMap: true,
                modules: true, // Sử dụng CSS Modules nếu cần
            }),
        ],
        external: ['react', 'react-dom', '@mantine/core', '@mantine/dates', '@mantine/hooks'],
    },
    {
        input: 'src/index.ts',
        output: [{ file: packageJson.types }],
        plugins: [dts.default()],
        external: [/\.css$/],
    },
];

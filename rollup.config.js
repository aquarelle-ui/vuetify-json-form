import resolve from 'rollup-plugin-node-resolve';
import importResolver from "rollup-plugin-import-resolver";
import VuePlugin from 'rollup-plugin-vue'
import css from 'rollup-plugin-css-only'
import {terser} from 'rollup-plugin-terser';
import pkg from './package.json';

const NAME = 'Aquarelle.VuetifyJsonForm';
const MAIN = 'src/index.js';

const GLOBALS = {
    'vue': 'Vue',
    'vuetify': 'Vuetify',
    '@aquarelle/json-form': 'Aquarelle.JsonForm',
    'vuedraggable': 'VueDraggable'
};
const EXTERNAL = Object.keys(GLOBALS);

const resolver = importResolver({extensions: ['.js', '.vue']});
const vuePlugin = VuePlugin({css: false, template: {isProduction: true}});

export default [
    {
        input: MAIN,
        output: {
            name: NAME,
            file: pkg.browser,
            format: 'umd',
            globals: GLOBALS
        },
        external: EXTERNAL,
        plugins: [resolve(), resolver, css(), vuePlugin, terser()]
    },
    {
        input: MAIN,
        external: EXTERNAL,
        plugins: [resolver, css(), vuePlugin],
        output: [
            {file: pkg.main, format: 'cjs'},
            {file: pkg.module, format: 'es'}
        ]
    }
];
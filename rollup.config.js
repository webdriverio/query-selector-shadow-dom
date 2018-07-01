import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import { uglify } from 'rollup-plugin-uglify';

const babelConfig = {
    'presets': [
        ['env', {
            'targets': {
                'browsers': ['last 2 versions', 'IE >= 11']
            },
            'loose': true
        }]
    ]
};

export default {
    input: 'src/querySelectorDeep.js',
    plugins: [
        babel(babelrc({
            addExternalHelpersPlugin: false,
            config: babelConfig,
            exclude: 'node_modules/**'
        })),
        uglify()
    ],
    output: {
        format: 'iife',
        name: 'querySelectorShadowDom',
        file: 'dist/querySelectorShadowDom.js'
    }
};
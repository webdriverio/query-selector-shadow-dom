const babel = require('rollup-plugin-babel');
const babelrc = require('babelrc-rollup').default;
const istanbul = require('rollup-plugin-istanbul');

const babelConfig = {
    'presets': [
        ['env', {
            'targets': {
                'browsers': ['ff >= 60']
            },
            'loose': true
        }]
    ]
};

module.exports = function(overrides, config) {
    return Object.assign({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            { pattern: 'node_modules/@webcomponents/webcomponentsjs/bundles/**.js', served: true, included: true },
            { pattern: 'node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js', served: true, included: true },
            'test/basic.js'
        ],


        // list of files / patterns to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'src/**/*.js': ['rollup', 'coverage'],
            'test/**/*.js': ['rollup']
        },

        rollupPreprocessor: {
            /**
             * This is just a normal Rollup config object,
             * except that `input` is handled for you.
             */
            plugins: [
                istanbul({
                    exclude: ['test/**/*.js']
                }),
                babel(babelrc({
                    addExternalHelpersPlugin: false,
                    config: babelConfig,
                    exclude: 'node_modules/**'
                }))

            ],
            output: {
                format: 'iife', // Helps prevent naming collisions.
                name: 'querySelectorShadowDom', // Required for 'iife' format.
                sourcemap: 'inline' // Sensible for testing.
            }
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['spec', 'coverage'],
        specReporter: {
            maxLogLines: 5, // limit number of lines logged per test
            suppressErrorSummary: true, // do not print error summary
            suppressFailed: false, // do not print information about failed tests
            suppressPassed: false, // do not print information about passed tests
            suppressSkipped: true, // do not print information about skipped tests
            showSpecTiming: true, // print the time elapsed for each spec
            failFast: true // test would finish with error when a first fail occurs. 
        },
        coverageReporter: {
            type: 'lcov', // lcov or lcovonly are required for generating lcov.info files
            dir: 'coverage/'
        },
        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    }, overrides);
};
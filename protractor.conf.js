exports.config = {
    baseUrl: 'http://localhost:3000',

    chromeDriver: require(`chromedriver/lib/chromedriver`).path,
    SELENIUM_PROMISE_MANAGER: false,
    directConnect: true,

    // https://github.com/angular/protractor/blob/master/docs/timeouts.md
    allScriptsTimeout: 110000,

    specs: [ './test/protractor-locator.e2e.js', ],

    plugins: [{
        path: './plugins/protractor'
    }],

    onPrepare: function() {
        global.browser.waitForAngularEnabled(false);
    },

    capabilities: {
        browserName: 'chrome',

        chromeOptions: {
            args: [
                '--no-sandbox',
                '--disable-infobars',
                '--disable-dev-shm-usage',
                '--disable-extensions',
                '--log-level=3',
                '--disable-gpu',
                '--window-size=1920,1080',
                '--headless'
            ]
        }
    }
};

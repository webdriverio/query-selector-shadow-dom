const { remote } = require('webdriverio')
const { locatorStrategy } = require('query-selector-shadow-dom/plugins/webdriverio');

;(async () => {
    const browser = await remote({
        logLevel: 'error',
        path: '/wd/hub',
        capabilities: {
            browserName: 'chrome'
        }
    })

    browser.addLocatorStrategy('shadow', locatorStrategy);

    
    await browser.url('chrome://downloads')
    const moreActions = await browser.custom$('shadow', '#moreActions');
    await moreActions.click();
    const span = await browser.custom$('shadow', '.dropdown-item:not([hidden])');
    const text = await span.getText()
    // prints `Open downloads folder`
    console.log(text);

    await browser.deleteSession()
})().catch((e) => console.error(e))
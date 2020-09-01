const { remote } = require('webdriverio')
const { locatorStrategy } = require('query-selector-shadow-dom/plugins/webdriverio');

;(async () => {
    const browser = await remote({
        logLevel: 'error',
        path: '/wd/hub',
        capabilities: {
            browserName: 'firefox'
        }
    })

    browser.addLocatorStrategy('shadow', locatorStrategy);

    
    await browser.url('http://127.0.0.1:5500/test/')
    await browser.waitUntil(() => browser.custom$("shadow", ".btn-in-shadow-dom"));
    const elements = await browser.$$("*");
    const elementsShadow = await browser.custom$$("shadow", "*");
    console.log("All Elements on Page Excluding Shadow Dom", elements.length);
    console.log("All Elements on Page Including Shadow Dom", elementsShadow.length);

    await browser.deleteSession()
})().catch((e) => console.error(e))
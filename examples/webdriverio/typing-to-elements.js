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
    const input = await browser.custom$('shadow', '#type-to-input');
    await input.setValue('Typed text to input');
    // Firefox workaround
   // await browser.execute((input, val) => input.value = val, input, 'Typed text to input')
    console.log(await input.getValue())

    await browser.deleteSession()
})().catch((e) => console.error(e))
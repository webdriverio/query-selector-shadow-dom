const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
(async () => {
    try {
        const browser = await puppeteer.launch({
            headless: false
        })
        const page = await browser.newPage()
        await page.goto('http://127.0.0.1:5500/test/')
        // makes the library available in evaluate functions which run within the browser context
        await page.addScriptTag({
            path: path.join(__dirname, 'node_modules/query-selector-shadow-dom/dist/querySelectorShadowDom.js')
        });


        // returns an https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#class-elementhandle
        const inputElement = await page.waitForFunction(() => {
            return querySelectorShadowDom.querySelectorDeep("#type-to-input");
        });

        // https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#elementhandletypetext-options
        await inputElement.type("Typed text to input");

        const value = await page.evaluate(inputElement => inputElement.value, inputElement);
        console.log(value);

        await browser.close()

    } catch (e) {
        console.error(e);
    }

})()
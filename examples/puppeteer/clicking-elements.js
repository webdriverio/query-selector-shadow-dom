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


        // ensure btn exists and return it
        const btn = await page.waitForFunction(() => {
            const btn = querySelectorShadowDom.querySelectorDeep(".btn-in-shadow-dom");
            return btn;
        });
        await btn.click();
        // check btn was clicked (this page expected btn to change text of output)
        const outputSpan = await page.evaluateHandle(() => querySelectorShadowDom.querySelectorDeep(".output"));
        const text = await page.evaluate((output) => output.innerText, outputSpan);
        // prints the text from the output
        console.log(text);

        await browser.close()
    } catch (e) {
        console.error(e);
    }

})()
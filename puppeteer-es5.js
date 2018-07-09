const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
(async() => {
    try {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto('https://www.polymer-project.org/2.0/docs/upgrade')
        await page.addScriptTag({
            path: path.join(__dirname, 'node_modules/query-selector-shadow-dom/dist/querySelectorShadowDom.js')
        });

        // execute standard javascript in the context of the page.
        const downloads = await page.evaluate(() => {
            const anchors = Array.from(querySelectorShadowDom.querySelectorAllDeep('a'))
            return anchors.map(anchor => anchor.href)
        })
        console.log(downloads)
        await browser.close()
    } catch (e) {
        console.error(e);
    }

})()
const puppeteer = require('puppeteer');
const {  QueryHandler } = require("query-selector-shadow-dom/plugins/puppeteer");
(async () => {
    try {
        await puppeteer.__experimental_registerCustomQueryHandler('shadow', QueryHandler);
        const browser = await puppeteer.launch({
            headless: false
        })
        const page = await browser.newPage()
        await page.goto('http://127.0.0.1:5500/test/')
        // wait for a web component to appear
        await page.waitForSelector("shadow/.btn-in-shadow-dom")
        const elements = await page.$$("*");
        const elementsShadow = await page.$$("shadow/*");
        console.log("All Elements on Page Excluding Shadow Dom", elements.length);
        console.log("All Elements on Page Including Shadow Dom", elementsShadow.length);
        await browser.close()

    } catch (e) {
        console.error(e);
    }
})()
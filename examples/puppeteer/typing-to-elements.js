const puppeteer = require('puppeteer');
const {  QueryHandler } = require("query-selector-shadow-dom/plugins/puppeteer");
(async () => {
    try {
        await puppeteer.registerCustomQueryHandler('shadow', QueryHandler);
        const browser = await puppeteer.launch({
            headless: false
        })
        const page = await browser.newPage()
        await page.goto('http://127.0.0.1:5500/test/')

        const inputElement = await page.waitForSelector("shadow/#type-to-input");

        await inputElement.type("Typed text to input");

        const value = await page.evaluate(inputElement => inputElement.value, inputElement);
        console.log("Value", value);

        await browser.close()

    } catch (e) {
        console.error(e);
    }

})()

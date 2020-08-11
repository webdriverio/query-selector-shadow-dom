const puppeteer = require('puppeteer');
const { QueryHandler } = require("../../plugins/puppeteer");
(async () => {
    try {
        await puppeteer.__experimental_registerCustomQueryHandler('shadow', QueryHandler);
        const browser = await puppeteer.launch({
            headless: false,
            devtools: true
        })
        const page = await browser.newPage()
        await page.goto('http://127.0.0.1:5500/test/')

        // ensure btn exists and return it
        await page.waitForSelector("shadow/.btn-in-shadow-dom");
        const btn = await page.$("shadow/.btn-in-shadow-dom");
        await btn.click();
        // check btn was clicked (this page expected btn to change text of output)
        const outputSpan = await page.$("shadow/.output");
        const text = await page.evaluate((output) => output.innerText, outputSpan);
        // prints the text from the output
        console.log(text);

        await browser.close()
    } catch (e) {
        console.error(e);
    }

})()
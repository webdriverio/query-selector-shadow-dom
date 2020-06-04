const puppeteer = require('puppeteer');
const { queryHandler } = require("../../plugins/puppeteer");
(async () => {
    try {
        puppeteer.__experimental_registerCustomQueryHandler('shadow', queryHandler);
        const browser = await puppeteer.launch({
            headless: false,
            devtools: true
        })
        const page = await browser.newPage()
        await page.goto('http://127.0.0.1:5501/test/')


        // ensure btn exists and return it
        const btn = await page.$("shadow/.btn-in-shadow-dom");
        console.log(btn);
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
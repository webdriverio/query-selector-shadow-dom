const {  QueryHandler } = require("../../plugins/puppeteer");
const puppeteer = require('puppeteer')

const main = async () => {
  await puppeteer.__experimental_registerCustomQueryHandler('shadow', QueryHandler);

  const browser = await puppeteer.chromium.launch({ headless: false})
  const context = await browser.newContext({ viewport: null })
  const page = await context.newPage()

  await page.goto('chrome://downloads')

  const element = await page.waitForSelector('shadow/div', {timeout: 3000})
  const span = await element.$$("shadow/div > .illustration + span")
  console.log(span)
  await new Promise(resolve => setTimeout(resolve, 3000))   

  await page.close()
  await context.close()
  await browser.close()
}

main()
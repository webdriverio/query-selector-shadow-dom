const { selectorEngine } = require("../../plugins/playwright");
const playwright = require('playwright')

const main = async () => {
  await playwright.selectors.register('shadow', selectorEngine)

  const browser = await playwright.chromium.launch({ headless: false})
  const context = await browser.newContext({ viewport: null })
  const page = await context.newPage()

  await page.goto('chrome://downloads')

  const element = await page.waitForSelector('.//div', {timeout: 3000})
  const span = await element.$$("div > .illustration + span")
  console.log(span)
  await new Promise(resolve => setTimeout(resolve, 3000))   

  await page.close()
  await context.close()
  await browser.close()
}

main()
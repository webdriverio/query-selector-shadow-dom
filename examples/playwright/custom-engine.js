const { selectorEngine } = require("query-selector-shadow-dom/plugins/playwright");
const playwright = require('playwright')

const main = async () => {
  await playwright.selectors.register(selectorEngine, { name: 'shadow' })

  const browser = await playwright.chromium.launch({ headless: false})
  const context = await browser.newContext({ viewport: null })
  const page = await context.newPage()

  await page.goto('chrome://downloads')

  await page.waitForSelector('shadow=#no-downloads span', {timeout: 3000})
  await new Promise(resolve => setTimeout(resolve, 3000))   

  await page.close()
  await context.close()
  await browser.close()
}

main()
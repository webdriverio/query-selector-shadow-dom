# Support for Shadow DOM in CodeceptJS

- Supported CodeceptJS Helpers: Playwright

!! This is experimental and is awaiting several changes from Playwright/CodeceptJS respectively.
- Basically nothing works as of right now.


Goal/Example: To be able to write a test that works easily with shadow dom web components.
See Issues for what currently works and what doesn't

```javascript
const playwright = require("playwright");

Feature("downloads");
Scenario("test something", async I => {
  I.amOnPage("chrome://downloads");
  I.see("Files you download appear here", {shadow: "#no-downloads span"});
  I.waitForVisible({shadow: "#no-downloads"}, 5);
  I.click({shadow: `[title="Search downloads"]`});
  I.waitForVisible({shadow: '#searchInput'}, 5);
  I.fillField({shadow: '#searchInput'}, "A download")
  I.waitForValue({shadow: '#searchInput'}, "A download", 5)
  I.waitForText("No search results found", 3, {shadow: "#no-downloads span"});
  I.clearField({shadow: '#searchInput'})
  I.waitForValue({shadow: '#searchInput'}, "", 5)
});

```

Setup:

1. `npm install query-selector-shadow-dom codeceptjs playwright@next`
2. Setup a codeceptjs project.
3. In codeceptjs config add this shadow dom plugin

```javascript
 plugins: {
    shadowDom: {
      enabled: true,
      locator: "shadow",
      require: "query-selector-shadow-dom/plugins/codeceptjs"
    }
  }
```
4. Start using the custom locator `{shadow: "..."}` You mauy rename the locator in the config file from "shadow" to something else.
5. Read issues below as not everything currently works

Issues:

## What works
- You `must` have playwright@next for this to work.
- In master of CodeceptJS as of right now the ONLY functional method for this library is:
`waitForElement`. Obviously this is not very useful.
I have this pr to fix the problem: https://github.com/Codeception/CodeceptJS/pull/2274


- To fix most of the waitFors I have this PR: https://github.com/Codeception/CodeceptJS/pull/2277

You can !experiment! with this version of codeceptjs in your package.json by doing and then `npm install` (not using sem ver so beware)
```javascript
{
    "codeceptjs": "github:Georgegriff:custom_locators_playwright_next",
}
```
You will also need to `npm install playwright@next`

### The following methods are not supported as of right now:
- waitForNoVisibleElements (looking for help should be do-able but again need to)

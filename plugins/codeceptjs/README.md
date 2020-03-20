# Support for Shadow DOM in CodeceptJS

- Supported CodeceptJS Helpers: Playwright

!! This is experimental and is awaiting several changes from Playwright/CodeceptJS respectively.
- Basically nothing works as of right now.


Goal/Example: To be able to write a test that works easily with shadow dom web components.
See Issues for what currently works and what doesn't

```javascript
Feature("downloads");
Scenario("test something", async I => {
  I.amOnPage("chrome://downloads");
  I.waitForElement({shadow: "#no-downloads"}, 3);
  // doesn't work yet needs changes in Issues below
  I.see("Files you download", {shadow: "#no-downloads"});
  // may not work yet due to checks either in codeceptjs or puppeteer
  I.click({shadow: "#moreActions"})
});
```

Setup:

1. `npm install query-selector-shadow-dom codeceptjs playwright`
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
- In master of CodeceptJS as of right now the ONLY functional method for this library is:
`waitForElement`. Obviously this is not very useful.
I have this pr to fix the problem: https://github.com/Codeception/CodeceptJS/pull/2274

- For `I.see() etc
The following PR fixes some of the other methods so they will work as expected:
e.g. `I.see('Some text in my-element', {shadow: '.my-element'})` would now work
-  (looking for help) For `I.click` there seem to be other issues for shadow dom. relating to waitForClickable/scrollTo.

You can !experiment! with this version of codeceptjs in your package.json by doing and then `npm install` (not using sem ver so beware)
```javascript
{
    "codeceptjs": "github:GeorgeGriff/CodeCeptJS#support_custom_locators",
}
```

### The following methods are not supported as of right now:
Ref code: https://github.com/Codeception/CodeceptJS/blob/master/lib/helper/Playwright.js
- click: waitForClickable checks built into codeceptjs seems to cause issues. This might be an issue with playwright issue: `     Protocol error (DOM.scrollIntoViewIfNeeded): 'DOM.scrollIntoViewIfNeeded' wasn't found`
- waitForVisible: Can be done be requires new CodeceptJS version with this update: awaiting 0.12.0 of Playwright https://github.com/microsoft/playwright/issues/1238
- waitForValue, waitForEnabled,waitForText: Could be done now in Codeceptjs but needs logic for (looking for help):
        - wait for element(s) to exist, check value, if not correct, retry wait for elements
        - I've opened an issue to discuss possibility on playwright: https://github.com/microsoft/playwright/issues/1444

- waitForNoVisibleElements (looking for help should be do-able but again need to)
- wait for element(s) to exist, check number, if not correct retry wait

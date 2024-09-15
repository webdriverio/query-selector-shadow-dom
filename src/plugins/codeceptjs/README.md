# Support for Shadow DOM in CodeceptJS

- Supported CodeceptJS Helpers: *Playwright* only.
- CodeceptJS 2.6.0 released webdriver.io support as an alternative if you don't want to use Playwright

Support for this plugin is currently limited to Playwright, this is mostly due to the fact that playwright
allows for the addition of `custom selector engines`.

Goal/Example: To be able to write a test that works easily with shadow dom web components.
See Issues for what currently works and what doesn't

```javascript
Feature("The chrome downloads page");
Scenario("Can interact with the search box", async I => {
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

1. `npm install query-selector-shadow-dom codeceptjs playwright`
2. Setup a codeceptjs project: https://codecept.io/quickstart/
3. In `codecept.config.js` add this shadow dom plugin

```javascript
 plugins: {
    shadowDom: {
      enabled: true,
      locator: "shadow",
      require: "query-selector-shadow-dom/plugins/codeceptjs"
    }
  }
```
4. Start using the custom locator `{shadow: "..."}` You may rename the locator in the config file from "shadow" to something else.
5. Read issues below as not everything currently works.

Issues:

## What works
- Most of the APIs listed here should work with shadow dom https://codecept.io/helpers/Playwright/#playwright

### The following methods are not supported as of right now:
- waitForNoVisibleElements (looking for help should be do-able, feel free to PR to CodeceptJS)

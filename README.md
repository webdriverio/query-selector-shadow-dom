[![Build Status](https://travis-ci.org/Georgegriff/query-selector-shadow-dom.svg?branch=main)](https://travis-ci.org/Georgegriff/query-selector-shadow-dom) [![npm version](https://badge.fury.io/js/query-selector-shadow-dom.svg)](https://badge.fury.io/js/query-selector-shadow-dom) [![codecov](https://codecov.io/gh/Georgegriff/query-selector-shadow-dom/branch/main/graph/badge.svg)](https://codecov.io/gh/Georgegriff/query-selector-shadow-dom)

# query-selector-shadow-dom

querySelector that can pierce Shadow DOM roots without knowing the path through nested shadow roots. Useful for automated testing of Web Components e.g. with Selenium, Puppeteer.

```javascript
// available as an ES6 module for importing in Browser environments

import {
  querySelectorAllDeep,
  querySelectorDeep,
} from "query-selector-shadow-dom";
```

## What is a nested shadow root?

![Image of Shadow DOM elements in dev tools](./Chrome-example.png)
You can see that `.dropdown-item:not([hidden])` (Open downloads folder) is several layers deep in shadow roots, most tools will make you do something like

```javascript
document
  .querySelector("body > downloads-manager")
  .shadowRoot.querySelector("#toolbar")
  .shadowRoot.querySelector(".dropdown-item:not([hidden])");
```

EW!

with query-selector-shadow-dom:

```javascript
import {
  querySelectorAllDeep,
  querySelectorDeep,
} from "query-selector-shadow-dom";
querySelectorDeep(".dropdown-item:not([hidden])");
```

## API

- querySelectorAllDeep - mirrors `querySelectorAll` from the browser, will return an `Array` of elements matching the query
- querySelectorDeep - mirrors `querySelector` from the browser, will return the `first` matching element of the query.
- collectAllElementsDeep - collects all elements on the page, including shadow dom

Both of the methods above accept a 2nd parameter, see section `Provide alternative node`. This will change the starting element to search from i.e. it will find ancestors of that node that match the query.

## Known limitations

- Source ordering of results may not be preserved. Due to the nature of how this library works, by breaking down selectors into parts, when using multiple selectors (e.g. split by commas) the results will be based on the order of the query, not the order the result appear in the dom. This is different from the native `querySelectorAll` functionality. You can read more about this here: https://github.com/Georgegriff/query-selector-shadow-dom/issues/54

## Plugins

### WebdriverIO

This plugin implements a custom selector strategy: https://webdriver.io/docs/selectors.html#custom-selector-strategies

```javascript
// make sure you have selenium standalone running
const { remote } = require("webdriverio");
const {
  locatorStrategy,
} = require("query-selector-shadow-dom/plugins/webdriverio");

(async () => {
  const browser = await remote({
    logLevel: "error",
    path: "/wd/hub",
    capabilities: {
      browserName: "chrome",
    },
  });

  // The magic - registry custom strategy
  browser.addLocatorStrategy("shadow", locatorStrategy);

  // now you have a `shadow` custom locator.

  // All elements on the page
  await browser.waitUntil(() =>
    browser.custom$("shadow", ".btn-in-shadow-dom")
  );
  const elements = await browser.$$("*");

  const elementsShadow = await browser.custom$$("shadow", "*");

  console.log("All Elements on Page Excluding Shadow Dom", elements.length);
  console.log(
    "All Elements on Page Including Shadow Dom",
    elementsShadow.length
  );

  await browser.url("http://127.0.0.1:5500/test/");
  // find input element in shadow dom
  const input = await browser.custom$("shadow", "#type-to-input");
  // type to input ! Does not work in firefox, see above.
  await input.setValue("Typed text to input");
  // Firefox workaround
  // await browser.execute((input, val) => input.value = val, input, 'Typed text to input')

  await browser.deleteSession();
})().catch((e) => console.error(e));
```

#### How is this different to `shadow$`

`shadow$` only goes one level deep in a shadow root.

Take this example.
![Image of Shadow DOM elements in dev tools](./Chrome-example.png)
You can see that `.dropdown-item:not([hidden])` (Open downloads folder) is several layers deep in shadow roots, but this library will find it, `shadow$` would not.
You would have to construct a path via css or javascript all the way through to find the right element.

```javascript
const { remote } = require("webdriverio");
const {
  locatorStrategy,
} = require("query-selector-shadow-dom/plugins/webdriverio");

(async () => {
  const browser = await remote({ capabilities: { browserName: "chrome" } });

  browser.addLocatorStrategy("shadow", locatorStrategy);

  await browser.url("chrome://downloads");
  const moreActions = await browser.custom$("shadow", "#moreActions");
  await moreActions.click();
  const span = await browser.custom$("shadow", ".dropdown-item:not([hidden])");
  const text = await span.getText();
  // prints `Open downloads folder`
  console.log(text);

  await browser.deleteSession();
})().catch((e) => console.error(e));
```

#### Known issues

- https://webdriver.io/blog/2019/02/22/shadow-dom-support.html#browser-support

- From the above, firefox `setValue` does NOT currently work.
  `. A workaround for now is to use a custom command (or method on your component object) that sets the input field's value via browser.execute(function).`

- Safari pretty much doesn't work, not really a surprise.

There are some webdriver examples available in the examples folder of this repository.
[WebdriverIO examples](https://github.com/Georgegriff/query-selector-shadow-dom/blob/main/examples/webdriverio)

### Puppeteer

Update: As of 5.4.0 Puppeteer now has a built in shadow Dom selector, this module might not be required for Puppeteer anymore.
They don't have any documentation: https://github.com/puppeteer/puppeteer/pull/6509

There are some puppeteer examples available in the examples folder of this repository.

[Puppeteer examples](https://github.com/Georgegriff/query-selector-shadow-dom/blob/main/examples/puppeteer)

### Playwright

Update: as of Playwright v0.14.0 their CSS and text selectors work with shadow Dom out of the box, you don't need this library anymore for Playwright.

Playwright works really nicely with this package.

This module exposes a playwright `selectorEngine`: https://github.com/microsoft/playwright/blob/main/docs/api.md#selectorsregisterenginefunction-args

```javascript
const { selectorEngine } = require("query-selector-shadow-dom/plugins/playwright");
const playwright = require('playwright');

 await selectors.register('shadow', createTagNameEngine);
...
  await page.goto('chrome://downloads');
  // shadow= allows a css query selector that automatically pierces shadow roots.
  await page.waitForSelector('shadow=#no-downloads span', {timeout: 3000})
```

For a full example see: https://github.com/Georgegriff/query-selector-shadow-dom/blob/main/examples/playwright

### Protractor

This project provides a Protractor plugin, which can be enabled in your [`protractor.conf.js`](https://www.protractortest.org/#/api-overview) file:

```javascript
exports.config = {
  plugins: [
    {
      package: "query-selector-shadow-dom/plugins/protractor",
    },
  ],

  // ... other Protractor-specific config
};
```

The plugin registers a new [locator](https://www.protractortest.org/#/api?view=ProtractorBy) - `by.shadowDomCss(selector /* string */)`, which can be used in regular Protractor tests:

```javascript
element(by.shadowDomCss("#item-in-shadow-dom"));
```

The locator also works with [Serenity/JS](https://serenity-js.org) tests that [use Protractor](https://serenity-js.org/modules/protractor) under the hood:

```typescript
import "query-selector-shadow-dom/plugins/protractor";
import { Target } from "@serenity-js/protractor";
import { by } from "protractor";

const ElementOfInterest = Target.the("element of interest").located(
  by.shadowDomCss("#item-in-shadow-dom")
);
```

See the [end-to-end tests](https://github.com/Georgegriff/query-selector-shadow-dom/blob/features/protractor-locator/test/protractor-locator.e2e.js) for more examples.

## Examples

### Provide alternative node

```javascript
// query from another node
querySelectorShadowDom.querySelectorAllDeep(
  "child",
  document.querySelector("#startNode")
);
// query an iframe
querySelectorShadowDom.querySelectorAllDeep("child", iframe.contentDocument);
```

This library does not allow you to query across iframe boundaries, you will need to get a reference to the iframe you want to interact with. </br>
If your iframe is inside of a shadow root you could cuse `querySelectorDeep` to find the iframe, then pass the `contentDocument` into the 2nd argument of `querySelectorDeep` or `querySelectorAllDeep`.

### Chrome downloads page

In the below examples the components being searched for are nested within web components `shadowRoots`.

```javascript
// Download and Paste the lib code in dist into chrome://downloads console to try it out :)

console.log(
  querySelectorShadowDom.querySelectorAllDeep(
    "downloads-item:nth-child(4) #remove"
  )
);
console.log(
  querySelectorShadowDom.querySelectorAllDeep(
    '#downloads-list .is-active a[href^="https://"]'
  )
);
console.log(
  querySelectorShadowDom.querySelectorDeep("#downloads-list div#title-area + a")
);
```

# Shady DOM

If using the polyfills and shady DOM, this library will still work.

## Importing

- Shipped as an ES6 module to be included using a bundler of your choice (or not).
- ES5 version bundled ontop the window as `window.querySelectorShadowDom` available for easy include into a test framework

## Running the code locally

`npm install`

### Running the tests

`npm test`

### Running the tests in watch mode

`npm run watch`

### Running the build

`npm run build`

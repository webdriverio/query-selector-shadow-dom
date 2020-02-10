[![Build Status](https://travis-ci.org/Georgegriff/query-selector-shadow-dom.svg?branch=master)](https://travis-ci.org/Georgegriff/query-selector-shadow-dom)  [![npm version](https://badge.fury.io/js/query-selector-shadow-dom.svg)](https://badge.fury.io/js/query-selector-shadow-dom) [![codecov](https://codecov.io/gh/Georgegriff/query-selector-shadow-dom/branch/master/graph/badge.svg)](https://codecov.io/gh/Georgegriff/query-selector-shadow-dom)
# query-selector-shadow-dom
querySelector that can pierce Shadow DOM roots without knowing the path through nested shadow roots. Useful for automated testing of Web Components e.g. with Selenium, Puppeteer.


```javascript

// available as an ES6 module for importing in Browser environments

import { querySelectorAllDeep, querySelectorDeep } from 'query-selector-shadow-dom';

```

- querySelectorAllDeep - mirrors `querySelectorAll` from the browser, will return an `Array` of elements matching the query
- querySelectorDeep - mirrors `querySelector` from the browser, will return the `first` matching element of the query.

Both of the methods above accept a 2nd parameter, see section `Provide alternative node`. This will change the starting element to search from i.e. it will find ancestors of that node that match the query.

## Examples

### Playwright

Playwright works really nicely with this package.

This module exposes a playwright `selectorEngine`: https://github.com/microsoft/playwright/blob/master/docs/api.md#selectorsregisterenginefunction-args

```javascript
const { selectorEngine } = require("query-selector-shadow-dom/plugins/playwright");
const playwright = require('playwright');
...
await playwright.selectors.register(selectorEngine, { name: 'shadow' })
...
  await page.goto('chrome://downloads');
  // shadow= allows a css query selector that automatically pierces shadow roots.
  await page.waitForSelector('shadow=#no-downloads span', {timeout: 3000})
```

For a full example see: https://github.com/Georgegriff/query-selector-shadow-dom/blob/master/examples/playwright

### Puppeteer 

There are some puppeteer examples available in the examples folder of this repository.

[Puppeteer examples](https://github.com/Georgegriff/query-selector-shadow-dom/blob/master/examples/puppeteer)


### Provide alternative node
```javascript
    // query from another node
    querySelectorShadowDom.querySelectorAllDeep('child', document.querySelector('#startNode'));
    // query an iframe
    querySelectorShadowDom.querySelectorAllDeep('child', iframe.contentDocument);
```

This library does not allow you to query across iframe boundaries, you will need to get a reference to the iframe you want to interact with. </br>
If your iframe is inside of a shadow root you could cuse `querySelectorDeep` to find the iframe, then pass the `contentDocument` into the 2nd argument of `querySelectorDeep` or `querySelectorAllDeep`.


### Chrome downloads page


In the below examples the components being searched for are nested within web components `shadowRoots`.

```javascript

// Download and Paste the lib code in dist into chrome://downloads console to try it out :)

console.log(querySelectorShadowDom.querySelectorAllDeep('downloads-item:nth-child(4) #remove'));
console.log(querySelectorShadowDom.querySelectorAllDeep('#downloads-list .is-active a[href^="https://"]'));
console.log(querySelectorShadowDom.querySelectorDeep('#downloads-list div#title-area + a'));

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


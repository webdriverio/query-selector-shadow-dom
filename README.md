[![Build Status](https://travis-ci.org/Georgegriff/query-selector-shadow-dom.svg?branch=master)](https://travis-ci.org/Georgegriff/query-selector-shadow-dom)  [![npm version](https://badge.fury.io/js/query-selector-shadow-dom.svg)](https://badge.fury.io/js/query-selector-shadow-dom) [![codecov](https://codecov.io/gh/Georgegriff/query-selector-shadow-dom/branch/master/graph/badge.svg)](https://codecov.io/gh/Georgegriff/query-selector-shadow-dom)
# query-selector-shadow-dom
querySelector that can pierce Shadow DOM roots without knowing the path through nested shadow roots. Useful for automated testing of Web Components e.g. with Selenium, Puppeteer.


```javascript

// available as an ES6 module for importing in Browser environments

import { querySelectorAllDeep, querySelectorDeep } from 'query-selector-shadow-dom';

```

## Examples

### Puppeteer (ES5 script on the window)
```javascript
/**
 * @name get list of links which may be in the shadow dom
 *
 */
const puppeteer = require('puppeteer');
const path = require('path');
(async() => {
    try {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto('https://www.polymer-project.org/2.0/docs/upgrade')
        await page.addScriptTag({
            path: path.join(__dirname, 'node_modules/query-selector-shadow-dom/dist/querySelectorShadowDom.js')
        });

        // execute standard javascript in the context of the page.
        const downloads = await page.evaluate(() => {
            const anchors = Array.from(querySelectorShadowDom.querySelectorAllDeep('a'))
            return anchors.map(anchor => anchor.href)
        })
        console.log(downloads)
        await browser.close()
    } catch (e) {
        console.error(e);
    }

})()
```



### Chrome downloads page


In the below examples the components being searched for are nested within web components `shadowRoots`.

```javascript

// Download and Paste the lib code in dist into chrome://downloads console to try it out :)

console.log(querySelectorShadowDom.querySelectorAllDeep('downloads-item:nth-child(4) #remove'));
console.log(querySelectorShadowDom.querySelectorAllDeep('#downloads-list .is-active a[href^="https://"]'));
console.log(querySelectorShadowDom.querySelectorDeep('#downloads-list div#title-area + a'));

```


# Shady DOM
If using the polyfills and shady DOM, this library will just use still work.

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


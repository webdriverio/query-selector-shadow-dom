[![Build Status](https://travis-ci.org/Georgegriff/query-selector-shadow-dom.svg?branch=master)](https://travis-ci.org/Georgegriff/query-selector-shadow-dom)

# query-selector-shadow-dom
querySelector that can pierce Shadow DOM roots without knowing the path through nested shadow roots. Useful for automated testing of Web Components e.g. with Selenium.


```javascript

import { querySelectorAllDeep, querySelectorDeep } from 'query-selector-shadow-dom';


```

In the below examples the components being searched for are nested within web components `shadowRoots`.

```javascript

// Download and Paste the lib code in dist into chrome://downloads console to try it out :)

console.log(querySelectorDeep('downloads-item:nth-child(4) #remove'));
console.log(querySelectorAllDeep('#downloads-list .is-active a[href^="https://"]'));
console.log(querySelectorDeep('#downloads-list div#title-area + a'));

```

#Shady DOM
If using the polyfills and shady DOM, this library will just use `querySelector|querySelectorAll`

## Importing
- Shipped as an ES6 module to be included using a bundler of your choice (or not).
- ES5 version bundled ontop the window as `window.querySelectorShadowDom` available for easy include into a test framework

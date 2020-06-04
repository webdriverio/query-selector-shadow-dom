const fs = require("fs");
const path = require("path");
// load the library in UMD format which self executes and adds window.querySelectorShadowDom
const querySelectorShadowDomUMD = fs.readFileSync(path.resolve(__dirname, "../../dist/querySelectorShadowDom.js"))

// a string so we can inject the library in the closure
const engineString = (element, selector) => {
    return querySelectorShadowDom.querySelectorAllDeep("body");
}
const defaultHandler = (element, selector) => {
    debugger;
    var querySelectorShadowDom=function(e){"use strict";function o(e,a,c){var t=c.querySelector(e);return document.head.createShadowRoot||document.head.attachShadow?!a&&t?t:h(e,",").reduce(function(e,t){if(!a&&e)return e;var l,d,i,o=h(t.replace(/^\s+/g,"").replace(/\s*([>+~]+)\s*/g,"$1")," ").filter(function(e){return!!e}),r=o.length-1,n=function(t,e){void 0===t&&(t=null);var n=[],o=function e(t){for(var o,r=0;o=t[r];++r)n.push(o),o.shadowRoot&&e(o.shadowRoot.querySelectorAll("*"))};e.shadowRoot&&o(e.shadowRoot.querySelectorAll("*"));return o(e.querySelectorAll("*")),t?n.filter(function(e){return e.matches(t)}):n}(o[r],c),u=(l=o,d=r,i=c,function(e){for(var t,o,r,n=d,u=e,a=!1;u&&(r=u).nodeType!==Node.DOCUMENT_FRAGMENT_NODE&&r.nodeType!==Node.DOCUMENT_NODE;){var c=u.matches(l[n]);if(c&&0===n){a=!0;break}c&&n--,t=i,o=u.parentNode,u=o&&o.host&&11===o.nodeType?o.host:o===t?null:o}return a});return a?e=e.concat(n.filter(u)):(e=n.find(u))||null},a?[]:null):a?c.querySelectorAll(e):t}function h(e,o){return e.match(/\\?.|^$/g).reduce(function(e,t){return'"'!==t||e.sQuote?"'"!==t||e.quote?e.quote||e.sQuote||t!==o?e.a[e.a.length-1]+=t:e.a.push(""):(e.sQuote^=1,e.a[e.a.length-1]+=t):(e.quote^=1,e.a[e.a.length-1]+=t),e},{a:[""]}).a}return e.querySelectorAllDeep=function(e,t){return void 0===t&&(t=document),o(e,!0,t)},e.querySelectorDeep=function(e,t){return void 0===t&&(t=document),o(e,!1,t)},e}({});
    return querySelectorShadowDom.querySelectorDeep(selector, element);
}

module.exports = { queryHandler: defaultHandler };  
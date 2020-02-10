
const fs = require("fs");
const path = require("path");

// load the library in UMD format which self executes and adds window.querySelectorShadowDom
const querySelectorShadowDomUMD = fs.readFileSync(path.resolve(__dirname, "../../dist/querySelectorShadowDom.js"))

// a string because playwright does a .toString on a selector engine and we need to
// make sure that query-selector-shadow-dom is injected and loaded into the function closure
const engineString =`
    options = options || {};
    const name = options.name || 'shadow';
    ${querySelectorShadowDomUMD}
    return {
        name: name,
        create(root, target) {
            return undefined;
        },
        query(root, selector) {
            return querySelectorShadowDom.querySelectorDeep(selector, root);
        },
        queryAll(root, selector) {
            return querySelectorShadowDom.querySelectorAllDeep(selector, root);
        }
    }
`
const selectorEngine = new Function("options", engineString)

module.exports = { selectorEngine };
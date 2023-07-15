import fs from 'node:fs';
import path from 'node:path';

const querySelectorAllDeep = fs.readFileSync(path.resolve(__dirname, "../../dist/querySelectorShadowDom.js"));

export default {
    name: 'query-selector-shadow-dom',
    onPrepare: function() {
        global.by.addLocator('shadowDomCss', `
            var selector /* string */ = arguments[0];
            var parentElement /* WebElement? */ = arguments[1];
            var rootSelector /* string? */ = arguments[2];
            
            ${ querySelectorAllDeep }

            return querySelectorShadowDom.querySelectorAllDeep(selector, parentElement || document)
        `);
    }
};

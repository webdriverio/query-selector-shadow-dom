import fs from 'node:fs';
import path from 'node:path';

const querySelectorAllDeep = fs.readFileSync(path.resolve(__dirname, "../../dist/querySelectorShadowDom.js"));

export const locatorStrategy = new Function('selector', 'element', `
${querySelectorAllDeep}
return querySelectorShadowDom.querySelectorAllDeep(selector, element);
`);

export default { locatorStrategy };
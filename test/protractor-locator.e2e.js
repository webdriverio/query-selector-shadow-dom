describe('query-selector-shadow-dom', () => {

    beforeEach(async () => {
        await browser.get(pageFromTemplate(`
            var firstParent = document.createElement('div');
            firstParent.id = 'first';
            firstParent.classList.add('parent');            
            document.body.appendChild(firstParent);
            
            var secondParent = document.createElement('div');
            secondParent.classList.add('parent');            
            document.body.appendChild(secondParent);
            
            var firstShadowChild = firstParent.attachShadow({ mode: 'open' });
            firstShadowChild.innerHTML = '<p class="shadow-child"><span class="name">First child</span> with Shadow DOM</p>';        
            
            var secondShadowChild = secondParent.attachShadow({ mode: 'open' });
            secondShadowChild.innerHTML = '<p class="shadow-child"><span class="name">Second child</span> with Shadow DOM</p>';
        `));
    });

    it(`identifies a single element matching the selector`, async () => {
        const text = await element(by.shadowDomCss('#first.parent .shadow-child .name')).getText();

        expect(text).toEqual('First child');
    });

    it(`identifies all elements matching the selector`, async () => {
        const text = await element.all(by.shadowDomCss('.parent .shadow-child .name')).getText();

        expect(text).toEqual(['First child', 'Second child']);
    });
});

/**
 * Turns a HTML template into a data URL Protractor can navigate to without having to use a web server
 *
 * @param {string} template
 * @returns {string}
 */
function pageFromTemplate(template /* string */) /* string */ {
    return `data:text/html;charset=utf-8,<!DOCTYPE html>
        <html>
            <body>
                <script>${ template }</script>
            </body>
        </html>`.replace(/[\s\n]+/s, ' ');
}

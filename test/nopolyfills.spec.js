import { querySelectorAllDeep, querySelectorDeep } from '../src/querySelectorDeep.js';

describe("No Polyfills Suite", function() {

    let parent;

    function setup() {
        parent = document.createElement('div');
        document.body.appendChild(parent);
    }
    beforeEach(() => {
        spyOnProperty(document, 'head', 'get').and.returnValue({
            attachShadow: undefined,
            createShadowRoot: undefined
        });
        setup();
    });

    afterEach(() => {
        parent.remove();
    });


    it('can fallback to query selector when no support and no polyfills', function() {
        const element = document.createElement('a');
        element.classList.add('testing');
        parent.appendChild(element);
        expect(querySelectorDeep('.testing')).toBeTruthy();
    });

    it('can fallback to query selector all when no support and no polyfills', function() {
        const element = document.createElement('a');
        const element2 = document.createElement('a');
        element.classList.add('testing');
        element2.classList.add('testing');
        parent.appendChild(element);
        parent.appendChild(element2);
        expect(querySelectorAllDeep('.testing').length).toEqual(2);
    });


});
import { TestComponent } from './TestComponent';
import { querySelectorAllDeep, querySelectorDeep } from '../src/querySelectorDeep';



describe("Basic Suite", function() {

    let parent;

    beforeEach(() => {
        parent = document.createElement('div');
        document.body.appendChild(parent);
    });

    afterEach(() => {
        parent.remove();
    });

    it("exports querySelectorAllDeep function", function() {
        expect(querySelectorAllDeep).toEqual(jasmine.any(Function));
    });

    it("exports querySelectorDeep function", function() {
        expect(querySelectorAllDeep).toEqual(jasmine.any(Function));
    });

    it('can access an element in the light dom', function() {

    });

    it('can access an element in the shadow dom', function() {

    });
});
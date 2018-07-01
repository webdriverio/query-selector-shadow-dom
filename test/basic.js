import { querySelectorAllDeep, querySelectorDeep } from '../src/querySelectorDeep';
import { createTestComponent, COMPONENT_NAME } from './createTestComponent';



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
        createTestComponent(parent);
        const testComponent = querySelectorDeep(COMPONENT_NAME);
        expect(testComponent).toBeTruthy();
    });

    it('can access an element in the shadow dom', function() {
        createTestComponent(parent);
        const testSubComponent = querySelectorDeep('.test-child');
        expect(testSubComponent).toBeTruthy();
        expect(testSubComponent.textContent).toEqual('Test Component Content')
    });
});
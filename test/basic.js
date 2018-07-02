import { querySelectorAllDeep, querySelectorDeep } from '../src/querySelectorDeep.js';
import { createTestComponent, createNestedComponent, COMPONENT_NAME, createChildElements } from './createTestComponent.js';



describe("Basic Suite", function() {

    let parent;
    let baseComponent;
    beforeEach(() => {
        parent = document.createElement('div');
        document.body.appendChild(parent);
        baseComponent = createTestComponent(parent, {
            childClassName: 'base',
            childTextContent: 'Base Component'
        });
        baseComponent.classList.add('base-comp');
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

    describe("querySelectorDeep", function() {
        it('can access an element in the light dom', function() {
            createTestComponent(parent);
            const testComponent = querySelectorDeep(COMPONENT_NAME);
            expect(testComponent).toBeTruthy();
        });

        it('can access an element in the shadow dom', function() {
            createTestComponent(parent, {
                childTextContent: 'Child Content'
            });
            const testSubComponent = querySelectorDeep('.test-child');
            expect(testSubComponent).toBeTruthy();
            expect(testSubComponent.textContent).toEqual('Child Content')
        });

        it('can access an element nested in many shadow dom', function() {
            createNestedComponent(baseComponent, 20);
            const testSubComponent = querySelectorDeep('.desc-20');
            expect(testSubComponent).toBeTruthy();
            expect(testSubComponent.textContent).toEqual('Descendant 20')
        });


        it('can use find the nth-child inside of a shadow root', function() {
            createNestedComponent(baseComponent, 10, {
                createChildren: createChildElements
            });
            const testSubComponent = querySelectorDeep('.desc-5 div:nth-child(2)');
            expect(testSubComponent).toBeTruthy();
            expect(testSubComponent.textContent).toEqual('Child 2')
        });

    });


    describe("querySelectorAll", function() {

        it('can locate all instances of components across even in shado dom (except base)', function() {
            createNestedComponent(baseComponent, 10);
            const testComponents = querySelectorAllDeep(`test-component:not(.base-comp)`);
            expect(testComponents.length).toEqual(10);


        });

        // describe(".perf", function() {

        //     function generateQuerySelectorAllTest(count) {
        //         it(`can create ${count} shadow roots and search for all instances that match`, async function() {
        //             for (let i = 0; i < count; i++) {
        //                 createTestComponent(baseComponent, count);
        //             }
        //             const testComponents = querySelectorAllDeep('test-component [class=test-child]');
        //             expect(testComponents.length).toEqual(count);
        //         });
        //     }

        //     generateQuerySelectorAllTest(200000);

        // });

    });
});
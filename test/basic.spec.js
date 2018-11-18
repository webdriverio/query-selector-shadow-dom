import { querySelectorAllDeep, querySelectorDeep } from '../src/querySelectorDeep.js';
import { createTestComponent, createNestedComponent, COMPONENT_NAME, createChildElements } from './createTestComponent.js';



describe("Basic Suite", function() {

    let parent;
    let baseComponent;

    function setup() {
        parent = document.createElement('div');
        document.body.appendChild(parent);
        baseComponent = createTestComponent(parent, {
            childClassName: 'base',
            childTextContent: 'Base Component'
        });
        baseComponent.classList.add('base-comp');
    }
    beforeEach(() => {
        setup();
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

        it('selector list only returns the first element', function() {
            createNestedComponent(baseComponent, 10, {
                createChildren: createChildElements
            });
            const testSubComponent = querySelectorDeep('.desc-5 div:nth-child(2), .desc-1');
            expect(testSubComponent).toBeTruthy();
            expect(testSubComponent.textContent).toEqual('Child 2')
        });

    });


    describe("querySelectorAll", function() {

        it('can locate all instances of components across even in shadow dom (except base)', function() {
            createNestedComponent(baseComponent, 10);
            const testComponents = querySelectorAllDeep(`test-component:not(.base-comp)`);
            expect(testComponents.length).toEqual(10);

        });

        it('can get elements matching or selector', function() {
            createTestComponent(parent, {
                childClassName: 'header-1'
            });
            const element = createTestComponent(parent, {
                childClassName: 'header-2'
            });
            element.classList.add('parent')
            const testComponents = querySelectorAllDeep(`.header-1, .header-2, .parent`);
            expect(testComponents.length).toEqual(3);

        });

        it('host property on non shadowRoot element is ignored', function() {
            const testComponent = createTestComponent(parent, {
                childClassName: 'header-1',
                internalHTML: '<div class="header-2"><div class="find-me"></div></div>'
            });
            testComponent.shadowRoot.querySelector('.header-2').host = "test.com";
            testComponent.classList.add('container');
            const testComponents = querySelectorAllDeep(`.container .find-me`);
            expect(testComponents.length).toEqual(1);
        });

        it('can handle extra white space in selectors', function() {
            const testComponent = createTestComponent(parent, {
                childClassName: 'header-1',
                internalHTML: '<div class="header-2">Content</div>'
            });
            createTestComponent(testComponent, {
                childClassName: 'header-2'
            });
            testComponent.classList.add('header-1');
            const testComponents = querySelectorAllDeep(`.header-1      .header-2`);
            expect(testComponents.length).toEqual(2);

        });

        it('can handle attribute selector value', function() {
            const testComponent = createTestComponent(parent, {
                childClassName: 'header-1',
                internalHTML: '<div data-test="Hello-World" class="header-2">Content</div>'
            });
            createTestComponent(testComponent, {
                childClassName: 'header-2'
            });
            testComponent.setAttribute('data-test', '123')
            testComponent.classList.add('header-1');
            const testComponents = querySelectorAllDeep(`.header-1 [data-test="Hello-World"]`);
            expect(testComponents.length).toEqual(1);
            expect(testComponents[0].classList.contains('header-2')).toBeTruthy();
        });


        it('can handle extra white space in attribute value', function() {
            const testComponent = createTestComponent(parent, {
                childClassName: 'header-1',
                internalHTML: '<div data-test="Hello World" class="header-2">Content</div>'
            });
            createTestComponent(testComponent, {
                childClassName: 'header-2'
            });
            // this should not match as matching children
            testComponent.setAttribute('data-test', 'Hello World')
            testComponent.classList.add('header-1');
            const testComponents = querySelectorAllDeep(`.header-1 [data-test="Hello World"]`);
            expect(testComponents.length).toEqual(1);
        });


        it('can handle comma in attribute values', function() {
            const testComponent = createTestComponent(parent, {
                childClassName: 'header-1',
                internalHTML: '<div class="header-2">Content</div>'
            });
            const test2 = createTestComponent(testComponent, {
                childClassName: 'header-2'
            });
            test2.setAttribute('data-test', 'Hello, World')
            testComponent.classList.add('header-1');
            const testComponents = querySelectorAllDeep(`.header-1 [data-test="Hello, World"], .header-2, .header-1`);
            expect(testComponents.length).toEqual(5);
        });

        it('can escaped comma in attribute values', function() {
            const testComponent = createTestComponent(parent, {
                childClassName: 'header-1',
                internalHTML: '<div class="header-2">Content</div>'
            });
            const test2 = createTestComponent(testComponent, {
                childClassName: 'header-2'
            });
            test2.setAttribute('data-test', 'Hello\, World')
            testComponent.classList.add('header-1');
            const testComponents = querySelectorAllDeep(`.header-1 [data-test="Hello\, World"]`);
            expect(testComponents.length).toEqual(1);
        });


        it('can handle escaped data in attributes', function() {
            const testComponent = createTestComponent(parent, {
                childClassName: 'header-1',
                internalHTML: '<div class="header-2">Content</div>'
            });
            const test2 = createTestComponent(testComponent, {
                childClassName: 'header-2'
            });
            test2.setAttribute('data-test', 'Hello" World')
            testComponent.classList.add('header-1');
            const testComponents = querySelectorAllDeep(`.header-1 [data-test="Hello\\" World"]`);
            expect(testComponents.length).toEqual(1);
        });

        it('can handle extra white space in single quoted attribute value', function() {
            const testComponent = createTestComponent(parent, {
                childClassName: 'header-1',
                internalHTML: '<div class="header-2">Content</div>'
            });
            createTestComponent(testComponent, {
                childClassName: 'header-2'
            });
            testComponent.setAttribute('data-test', 'Hello " \'World\'')
            testComponent.classList.add('header-1');
            const testComponents = querySelectorAllDeep(`.header-1[data-test='Hello \\" \\'World\\'']`);
            expect(testComponents.length).toEqual(1);
        });

        it('split correctly on selector list', function() {
            const testComponent = createTestComponent(parent, {
                internalHTML: '<span class="header-2"></span><div data-test="Hello" World" class="header-3">Content</div>'
            });
            createTestComponent(testComponent, {
                childClassName: 'header-4'
            });
            testComponent.setAttribute('data-test', '123')
            testComponent.classList.add('header-1');
            const testComponents = querySelectorAllDeep(`.header-1,.header-2 + .header-3`);
            expect(testComponents.length).toEqual(2);
            expect(testComponents[1].classList.contains('header-3')).toBeTruthy();
        });

        it('split correctly on selector list (ignore white space)', function() {
            const testComponent = createTestComponent(parent, {
                internalHTML: '<span class="header-2"></span><div data-test="Hello World" class="header-3">Content</div>'
            });
            createTestComponent(testComponent, {
                childClassName: 'header-4'
            });
            testComponent.setAttribute('data-test', '123')
            testComponent.classList.add('header-1');
            const testComponents = querySelectorAllDeep(`    .header-1,     .header-2 + .header-3`);
            expect(testComponents.length).toEqual(2);
            expect(testComponents[1].classList.contains('header-3')).toBeTruthy();
        });

        it('can provide an alternative node', function() {
            const root = document.createElement('div');
            parent.appendChild(root);

            createTestComponent(root, {
                childClassName: 'inner-content'
            });

            createTestComponent(parent, {
                childClassName: 'inner-content'
            });
            const testComponent = querySelectorAllDeep('.inner-content', root);
            expect(testComponent.length).toEqual(1);

        });

        it('can query nodes in an iframe', function(done) {

            const innerframe = `<p class='child'>Content</p>`;
            createTestComponent(parent, {
                internalHTML: `<iframe id="frame" srcdoc="${innerframe}"></iframe>`
            });
            setTimeout(() => {
                const iframe = querySelectorDeep('#frame');
                const testComponents = querySelectorAllDeep('.child', iframe.contentDocument);
                debugger;
                expect(testComponents.length).toEqual(1);
                expect(testComponents[0].textContent).toEqual("Content");
                done();
            }, 150);


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
import { TestComponent } from './TestComponent.js';
export function createTestComponent(parent, options = {}) {
    return parent.appendChild(new TestComponent(options));
}

export const createChildElements = (component) => {
    for (let i = 0; i < 3; i++) {
        const child = document.createElement('div');
        child.textContent = `Child ${i+1}`;
        component.addNested(child);
    }
};

export function createNestedComponent(parent, count = 1, { createChildren = () => {}, childClass = (count) => `desc-${count}`, childContent = (count) => `Descendant ${count}` } = {}) {
    if (count > 2000) {
        const split = count / 2;
        for (let i = 0; i < count; i += split) {
            createNestedComponent(parent, split, {
                createChildren,
                childClass,
                childContent
            });
        }
    } else {
        if (count === 0) {
            return;
        }
        const component = new TestComponent({
            childClassName: childClass(count),
            childTextContent: childContent(count)
        });
        parent.add(component);
        createChildren(component);
        count = count - 1;
        createNestedComponent(component, count, { createChildren, childClass, childContent });
    }



}

export const COMPONENT_NAME = 'test-component';
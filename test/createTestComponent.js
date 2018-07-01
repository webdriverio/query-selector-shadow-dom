import { TestComponent } from './TestComponent';
export function createTestComponent(parent) {
    return parent.appendChild(new TestComponent());
}

export const COMPONENT_NAME = 'test-component';
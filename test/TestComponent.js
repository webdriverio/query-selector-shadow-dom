export class TestComponent extends HTMLElement {
    connectedCallback() {
        this.createShadowRoot();
        this.shadowRoot.innerHTML = '<p class="test-child">Test Component Content</p>';
    }

    add() {
        const testComponent = new TestComponent();
        this.shadowRoot.appendChild(testComponent);
        return testComponent;
    }
}
customElements.define('test-component', TestComponent);
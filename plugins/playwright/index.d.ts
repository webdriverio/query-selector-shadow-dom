export interface PlaywrightSelectorEngine {
    create(root: Element | Document | Node, target: Element): string | undefined;
    query(root: Element | Document | Node, selector: string): Element | null;
    queryAll(root: Element | Document | Node, selector: string): Element[];
}

export function selectorEngine(): PlaywrightSelectorEngine;

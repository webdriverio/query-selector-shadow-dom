export function querySelectorAllDeep(
    selector: string,
    root?: Element | Document | Node | null,
    allElements?: Element[] | null
): Element[];

export function querySelectorDeep(
    selector: string,
    root?: Element | Document | Node | null,
    allElements?: Element[] | null
): Element | null;

export function collectAllElementsDeep(
    selector?: string | null,
    root?: Element | Document | Node,
    cachedElements?: Element[] | null
): Element[];

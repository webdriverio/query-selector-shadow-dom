import { normalizeSelector } from './normalize';

/**
* Finds first matching elements on the page that may be in a shadow root using a complex selector of n-depth
*
* Don't have to specify all shadow roots to button, tree is travered to find the correct element
*
* Example querySelectorAllDeep('downloads-item:nth-child(4) #remove');
*
* Example should work on chrome://downloads outputting the remove button inside of a download card component
*
* Example find first active download link element querySelectorDeep('#downloads-list .is-active a[href^="https://"]');
*
* Another example querySelectorAllDeep('#downloads-list div#title-area + a');
e.g.
*/
export function querySelectorAllDeep(selector: string, root: Element | Document = document, allElements = null) {
    return _querySelectorDeep(selector, true, root, allElements);
}

export function querySelectorDeep(selector: string, root: Element | Document = document, allElements = null) {
    return _querySelectorDeep(selector, false, root, allElements);
}

function _querySelectorDeep(selector: string, findMany: boolean, root: Element | Document, allElements = null) {
    selector = normalizeSelector(selector);
    let lightElement = root.querySelector(selector);

    if (!document.head.attachShadow) {
        return !findMany ? lightElement : root.querySelectorAll(selector)
    }

    // no need to do any special if selector matches something specific in light-dom
    if (!findMany && lightElement) {
        return lightElement;
    }

    // split on commas because those are a logical divide in the operation
    const selectionsToMake = splitByCharacterUnlessQuoted(selector, ',') as string[]

    return selectionsToMake.reduce((acc, minimalSelector) => {
        // if not finding many just reduce the first match
        if (!findMany && acc) {
            return acc;
        }
        // do best to support complex selectors and split the query
        const splitSelector = splitByCharacterUnlessQuoted(
            minimalSelector
                //remove white space at start of selector
                .replace(/^\s+/g, '')
                .replace(/\s*([>+~]+)\s*/g, '$1'), ' ')
                // filter out entry white selectors
                .filter((entry) => !!entry)
                // convert "a > b" to ["a", "b"]
                .map((entry) => splitByCharacterUnlessQuoted(entry, '>')
        );

        const possibleElementsIndex = splitSelector.length - 1;
        const lastSplitPart = splitSelector[possibleElementsIndex][splitSelector[possibleElementsIndex].length - 1];
        const possibleElements = collectAllElementsDeep(lastSplitPart, root, allElements);
        const findElements = findMatchingElement(splitSelector, possibleElementsIndex, root);
        if (findMany) {
            acc = acc.concat(possibleElements.filter(findElements));
            return acc;
        } else {
            acc = possibleElements.find(findElements);
            return acc || null;
        }
    }, findMany ? [] as Element[] : undefined);
}

function findMatchingElement(splitSelector: string[], possibleElementsIndex: number, root: Document | Element) {
    return (element: Element) => {
        let position = possibleElementsIndex;
        let parent: Element | null = element;
        let foundElement = false;
        while (parent && !isDocumentNode(parent)) {
            let foundMatch = true;
            if (splitSelector[position].length === 1) {
                foundMatch = parent.matches(splitSelector[position]);
            } else {
                // selector is in the format "a > b"
                // make sure a few parents match in order
                const reversedParts = ([]).concat(splitSelector[position] as any).reverse();
                let newParent = parent;
                for (const part of reversedParts) {
                    if (!newParent || !newParent.matches(part)) {
                        foundMatch = false;
                        break;
                    }
                    newParent = findParentOrHost(newParent, root) as Element;
                }
            }

            if (foundMatch && position === 0) {
                foundElement = true;
                break;
            }
            if (foundMatch) {
                position--;
            }
            parent = findParentOrHost(parent, root) as Element;
        }
        return foundElement;
    };
}

function splitByCharacterUnlessQuoted(selector: string, character: string) {
    return selector.match(/\\?.|^$/g)?.reduce((p, c) => {
        if (c === '"' && !p.sQuote && p.quote) {
            p.quote ^= 1;
            p.a[p.a.length - 1] += c;
        } else if (c === '\'' && !p.quote && p.sQuote) {
            p.sQuote ^= 1;
            p.a[p.a.length - 1] += c;

        } else if (!p.quote && !p.sQuote && c === character) {
            p.a.push('');
        } else {
            p.a[p.a.length - 1] += c;
        }
        return p;
    }, { a: [''] } as { a: string[], sQuote?: number, quote?: number }).a;
}

/**
 * Checks if the node is a document node or not.
 * @param {Node} node
 * @returns {node is Document | DocumentFragment}
 */
function isDocumentNode(node: Element) {
    return node.nodeType === Node.DOCUMENT_FRAGMENT_NODE || node.nodeType === Node.DOCUMENT_NODE;
}

function findParentOrHost(element: Element, root: Element | Document) {
    const parentNode = element.parentNode as Element | Document | ShadowRoot;
    return (parentNode && (parentNode as ShadowRoot).host && parentNode.nodeType === 11) ? (parentNode as ShadowRoot).host : parentNode === root ? null : parentNode;
}

/**
 * Finds all elements on the page, inclusive of those within shadow roots.
 * @param {string=} selector Simple selector to filter the elements by. e.g. 'a', 'div.main'
 * @return {!Array<string>} List of anchor hrefs.
 * @author ebidel@ (Eric Bidelman)
 * License Apache-2.0
 */
export function collectAllElementsDeep(selector: string | undefined, root: Document | Element, cachedElements: Element[]) {
    let allElements: Element[] = [];

    if (cachedElements) {
        allElements = cachedElements;
    } else {
        const findAllElements = function(nodes: Element[]) {
            for (let i = 0; i < nodes.length; i++) {
                const el = nodes[i];
                allElements.push(el);
                // If the element has a shadow root, dig deeper.
                if (el.shadowRoot) {
                    findAllElements(Array.from(el.shadowRoot.querySelectorAll('*')));
                }
            }
        };
        if((root as Element).shadowRoot) {
            findAllElements(Array.from((root as Element).shadowRoot?.querySelectorAll('*') || []));
        }
        findAllElements(Array.from(root.querySelectorAll('*')));
    }

    return selector ? allElements.filter(el => el.matches(selector)) : allElements;
}

/**
 * @author Georgegriff@ (George Griffiths)
 * License Apache-2.0
 */

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
export function querySelectorAllDeep(selector) {
    return _querySelectorDeep(selector, true);
}

export function querySelectorDeep(selector) {
    return _querySelectorDeep(selector);
}

function _querySelectorDeep(selector, findMany) {
    let lightElement = document.querySelector(selector);

    if (document.head.createShadowRoot || document.head.attachShadow) {
        // no need to do any special if selector matches something specific in light-dom
        if (!findMany && lightElement) {
            return lightElement;
        }

        // split on commas because those are a logical divide in the operation
        const selectionsToMake = selector.split(/,\s*/);

        return selectionsToMake.reduce((acc, minimalSelector) => {
            // if not finding many just reduce the first match
            if (!findMany && acc) {
                return acc;
            }
            // do best to support complex selectors and split the query
            const splitSelector = minimalSelector
                //remove white space at start of selector
                .replace(/^\s+/g, '')
                .replace(/\s*([>+~]+)\s*/g, '$1')
                .replace(/\s\s+/g, ' ')
                // split on space unless in quotes
                .match(/\\?.|^$/g).reduce((p, c) => {
                    if (c === '"' && !p.sQuote) {
                        p.quote ^= 1;
                        p.a[p.a.length - 1] += c;
                    } else if (c === '\'' && !p.quote) {
                        p.sQuote ^= 1;
                        p.a[p.a.length - 1] += c;

                    } else if (!p.quote && !p.sQuote && c === ' ') {
                        p.a.push('');
                    } else {
                        p.a[p.a.length - 1] += c;
                    }
                    return p;
                }, { a: [''] }).a
            const possibleElementsIndex = splitSelector.length - 1;
            const possibleElements = collectAllElementsDeep(splitSelector[possibleElementsIndex]);
            const findElements = findMatchingElement(splitSelector, possibleElementsIndex);
            if (findMany) {
                acc = acc.concat(possibleElements.filter(findElements));
                return acc;
            } else {
                acc = possibleElements.find(findElements);
                return acc;
            }
        }, findMany ? [] : null);


    } else {
        if (!findMany) {
            return lightElement;
        } else {
            return document.querySelectorAll(selector);
        }
    }

}

function findMatchingElement(splitSelector, possibleElementsIndex) {
    return (element) => {
        let position = possibleElementsIndex;
        let parent = element;
        let foundElement = false;
        while (parent) {
            const foundMatch = parent.matches(splitSelector[position]);
            if (foundMatch && position === 0) {
                foundElement = true;
                break;
            }
            if (foundMatch) {
                position--;
            }
            parent = findParentOrHost(parent);
        }
        return foundElement;
    };

}


function findParentOrHost(element) {
    const parentNode = element.parentNode;
    return parentNode && parentNode.host ? parentNode.host : parentNode === document ? null : parentNode;
}

/**
 * Finds all elements on the page, inclusive of those within shadow roots.
 * @param {string=} selector Simple selector to filter the elements by. e.g. 'a', 'div.main'
 * @return {!Array<string>} List of anchor hrefs.
 * @author ebidel@ (Eric Bidelman)
 * License Apache-2.0
 */
function collectAllElementsDeep(selector = null) {
    const allElements = [];

    const findAllElements = function(nodes) {
        for (let i = 0, el; el = nodes[i]; ++i) {
            allElements.push(el);
            // If the element has a shadow root, dig deeper.
            if (el.shadowRoot) {
                findAllElements(el.shadowRoot.querySelectorAll('*'));
            }
        }
    };

    findAllElements(document.querySelectorAll('*'));

    return selector ? allElements.filter(el => el.matches(selector)) : allElements;
}
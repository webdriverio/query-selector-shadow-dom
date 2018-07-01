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

function _querySelectorDeep(selector, findMany = false) {
    let lightElement;
    if (findMany) {
        lightElement = document.querySelectorAll(selector);
    } else {
        lightElement = document.querySelector(selector);
    }
    if (document.head.createShadowRoot || document.head.attachShadow) {
        // no need to do any special if selector matches something in light-dom
        if (lightElement) {
            return lightElement;
        }
        // do best to support complex selectors and split the query
        const splitSelector = selector.replace(/\s*([,>+~]+)\s*/g, '$1').split(' ');
        const possibleElementsIndex = splitSelector.length - 1;
        const possibleElements = collectAllElementsDeep(splitSelector[possibleElementsIndex]);
        const findElements = findMatchingElement(splitSelector, possibleElementsIndex);
        if (findMany) {
            return possibleElements.filter(findElements);
        } else {
            return possibleElements.find(findElements);
        }
    } else {
        return lightElement;
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
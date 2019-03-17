/**
 * A set of common helper methods.
 * @namespace CommonHelpers
 */

/**
 * Validates if the provided object is a DOM Element.
 * @memberof CommonHelpers
 * @param {Object} obj Object to test.
 * @returns {boolean}  * 
 */
export function isElement(obj) {
    return (
        typeof HTMLElement === "object" ? obj instanceof HTMLElement :
        obj && typeof obj === "object" && obj !== null && obj.nodeType === 1 && typeof obj.nodeName === "string"
    );
}

/**
 * Validates if the provided object is a Function.
 * @memberof CommonHelpers
 * @param {Object} functionToCheck Object to test.
 * @returns {boolean}  * 
 */
export function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

/**
 * Finds and returns the document's highest z-index.
 * @memberof CommonHelpers
 * @type {function}
 * @returns {number} highest z-index
 */
export function findHighestZIndex() {
    const elems = document.getElementsByTagName('*');
    let highest = 0;
    for (let i = 0; i < elems.length; i++) {
        const zindex = document.defaultView.getComputedStyle(elems[i], null).getPropertyValue("z-index");
        if ((zindex > highest) && (zindex != 'auto')) {
            highest = zindex;
        }
    }
    return highest;
}

/**
 * Generates a DeferredPromise, like those used in JQuery. Avoid using, a standard Promise should be used in its place.
 * @memberof CommonHelpers
 * @type {function}
 * @returns {{ promise:Promise, resolve:function, reject:function }} Deferred Promise Object
 */
export function generateDeferredPromise() {
    return (() => {
        let resolve;
        let reject;

        const p = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        });

        return {
            promise: p,
            reject,
            resolve
        };
    })();
}

/**
 * Walks up a node tree looking for a criteria match, returning the matched Element or a Null.
 * @memberof CommonHelpers
 * @type {function}
 * @param {element} startingElement Node branch to search.
 * @param {string} searchMethod Node attribute to be checked. Accepts "hasId", "hasClass", "hasAttribute", 'hasNodeName" * 
 * @param {string} searchIdentifier Node value to find.
 * @returns {(element|null)} Seeker result
 */
export function seekElementInBranch(startingElement, searchMethod, searchIdentifier) {
    if (!isElement(startingElement)) throw "Invalid startingElement.";

    let target = startingElement;

    switch (searchMethod) {
        case 'hasId':
            {
                while (target) {
                    if (target.id == searchIdentifier) break;
                    target = target.parentElement;
                }
                break;
            }
        case 'hasClass':
            {
                while (target) {
                    if (target.classList && target.classList.contains(searchIdentifier)) break;
                    target = target.parentElement;
                }
                break;
            }
        case 'hasAttribute':
            {
                while (target) {
                    if (target.hasAttribute && target.hasAttribute(searchIdentifier)) break;
                    target = target.parentElement;
                }
                break;
            }
        case 'hasNodeName':
            {
                while (target) {
                    if (target.nodeName && target.nodeName == searchIdentifier.toUpperCase()) break;
                    target = target.parentElement;
                }
                break;
            }
        default:
            throw "Invalid searchMethod";
    }

    return (target) ? target : null;
}


/**
 * Checks if the provided object is a string or string array. Returns string array if validation is passed, else a null is returned.
 * @memberof CommonHelpers
 * @type {function}
 * @param {(String|String[])} test Object to check
 * @returns {(String[]|null)} String Array or Null if object does not pass validation.
 */
export function isStringOrStringArray(test) {
    let arr = [];

    if (Array.isArray(test)) {
        test.forEach(obj => {
            if (typeof obj !== 'string') return null;
            arr.push(obj);
        });
    } else if (typeof test === 'string') arr.push(test);
    else return null;

    return arr;
}
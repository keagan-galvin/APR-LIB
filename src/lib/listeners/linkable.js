import { seekElementInBranch } from "../CommonHelpers";

/**
 * @memberof Listeners
 * @typedef {EventListener}
 * @name Linkable
 * @description Listens for "Click" events on objects with an attribute of 'linkable', and redirects the window to the 'linkable' attribute value.
 */
document.addEventListener('click', Linkable);

function Linkable(e) {
    let target = seekElementInBranch(e.target, 'hasAttribute', 'linkable');
    if (target) window.location.href = target.getAttribute('linkable');
}
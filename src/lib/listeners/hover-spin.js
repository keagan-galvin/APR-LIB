import { seekElementInBranch } from "../CommonHelpers";

/**
 * @memberof Listeners
 * @name HoverSpin
 * @typedef {EventListener}
 * @description Listens for a "mouseenter" events on &lsaquo;i&rsaquo; objects with an attribute of 'hover-spin', and applies the css class .fa-spin.
 */
document.addEventListener('mouseover', HoverSpin);

function HoverSpin(e) {
    let target = seekElementInBranch(e.target, 'hasAttribute', 'hover-spin');

    if (target) {
        if (target.tagName == 'I' && !target.classList.contains('fa-spin')) {
            target.classList.add('fa-spin');
            target.addEventListener('mouseleave', (e) => {
                target.classList.remove('fa-spin');
            });
        }
    }
};
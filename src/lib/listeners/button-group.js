import { seekElementInBranch } from "../CommonHelpers";

/**
 * @memberof Listeners
 * @typedef {EventListener}
 * @name ButtonGroupClickEvents
 * @description Listens for "Click" events on 'button, .button' children of a '.button-group' container. Add the class 'no-toggle' to a button or to the button-group to prevent toggling.
 */
document.addEventListener('click', ButtonGroupClickEvents);

function ButtonGroupClickEvents(e) {
    let target = CommonHelpers.seekElementInBranch(e.target, "hasClass", "button");
    if (!target) target = CommonHelpers.seekElementInBranch(e.target, "hasNodeName", "button");

    if (target) {
        let btnGroup = CommonHelpers.seekElementInBranch(target, "hasClass", "button-group");

        if (btnGroup) {
            e.preventDefault();

            if (btnGroup.classList.contains('no-toggle') || target.classList.contains('no-toggle')) return;
            else toggleState(target);

        }
    }
}

function toggleState(el) {
    if (el.classList) {
        if (el.classList.contains('active')) el.classList.remove('active');
        else el.classList.add('active');
    }
}
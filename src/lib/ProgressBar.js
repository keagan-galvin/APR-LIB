import {
    isElement
} from "./CommonHelpers";

/**
 * Generate a ProgressBar
 * @typedef {function}
 * @param {Object} options
 * @param {Element} [options.target] Binds return object to an existing DOM Element.
 * @param {string} options.theme Applies a theme class to the ProgressBar.
 * @param {string} options.type Applies a type class to the ProgressBar.
 * @property {Element} element The ProgressBar DOM Element.
 * @property {boolean} isLoading The ProgressBar's loading state.
 * @returns {{ element:element, isLoading:boolean }}
 */
export function ProgressBar({
    target,
    theme = 'accent',
    type = 'indeterminate'
}) {
    let bar = (target) ? target : document.createElement('div');
    let loading = false;

    const obj = {
        get element() {
            return bar;
        },
        get isLoading() {
            return bar.style.display != 'none';
        },
        set isLoading(bool) {
            if (typeof bool !== 'boolean') throw 'Must be typeof boolean';
            bar.style.display = (bool) ? '' : 'none'
        }
    };

    if (target) {
        if (!isElement(target)) throw "Invalid target.";
        if (!target.classList.contains('progress')) throw "Invalid target.";
    } else {
        bar.classList.add('progress');
        bar.classList.add(theme);
        bar.insertAdjacentHTML('afterbegin', `<div class="${type}"></div>`);
    }

    obj.isLoading = false;
    return obj;
}
import {
    findHighestZIndex,
    isElement,
    seekElementInBranch,
    generateDeferredPromise
} from "./CommonHelpers";

import {
    FieldTags
} from "./FormHelpers";
import { ProgressBar } from "./ProgressBar";

/**
 * Service used for generating DialogObjects
 * @module DialogService
 * 
 */

/**
 * Element Attribute that is used for click-to-close elements. The attributes value will be sent in the promise response.
 * @memberof DialogService
 * @type {string}
 * @readonly
 */
export const CloseAttribute = 'close-dialog';

/**
 * Generates a Dialog Object
 * @memberof DialogService
 * @typedef {function}
 * @param {object} options Configuration Object
 * @param {(string|element)} options.content HTML or Element to be rendered in the dialog element.
 * @param {string} options.width Dialog Window Width. Must define unit (px,pt,em)
 * @param {boolean} options.useOverlayClose Use overlay click-to-close feature.
 * @param {string[]} options.classes Classes to be applied to the wrapper element.
 * @returns {Object} new DialogObject
 */
export function Dialog({
    content,
    width = 'auto',
    useOverlayClose = true,
    classes = []
}) {
    /**
     * A Dialog Interface Object
     * @memberof DialogService
     * @typedef {Dialog}
     * @name DialogObject
     */
    const dialog = {
        bringForward: bringForward,
        open: open,
        close: close
    };

    let deferral;

    initialize();

    return dialog;

    function initialize() {
        buildElements();

        dialog.window.addEventListener('transitionend', dialogTransitionEndEvent);

        dialog.wrapper.addEventListener('click', dialogClickEvent)

    }

    function buildElements() {
        const wrapper = document.createElement('div');

        /**
         * @memberof DialogService.DialogObject
         * @name wrapper
         * @type {Element}
         * @description Dialog Wrapper DOM Element
         * @instance
         */
        Object.defineProperty(dialog, 'wrapper', {
            get() {
                return wrapper;
            }
        });

        /**
         * @memberof DialogService.DialogObject
         * @name overlay
         * @type {Element}
         * @description Dialog Overlay DOM Element
         * @instance
         */
        Object.defineProperty(dialog, 'overlay', {
            get() {
                return dialog.wrapper.querySelector('.overlay');
            }
        });

        /**
         * @memberof DialogService.DialogObject  
         * @name window
         * @type {Element}
         * @description Dialog Window DOM Element
         * @instance
         */
        Object.defineProperty(dialog, 'window', {
            get() {
                return dialog.wrapper.querySelector('.dialog-window');
            }
        });

        /**
         * @memberof DialogService.DialogObject  
         * @name content
         * @type {HTMLCollection}
         * @description Gets/Sets the Dialog Window's content. Setter expects an HTML string or DOM Element.
         * @instance
         */
        Object.defineProperty(dialog, 'content', {
            get() {
                return dialog.window.children;
            },
            set(c) {
                setContent(c);
            }
        });
        
        /**
         * @memberof DialogService.DialogObject  
         * @name progressBar
         * @type {(ProgressBar|null)}
         * @description The Dialog Windows ProgressBar. Null if one is not found.
         * @instance
         */
        dialog.progressBar = null;

        wrapper.classList.add('dialog');
        classes.forEach(x => wrapper.classList.add(x));

        wrapper.insertAdjacentHTML('afterbegin',
            `<div class="overlay" ${useOverlayClose ? `${CloseAttribute}="overlay-cancel"`: ''}></div>
            <div class="dialog-window" ${width ? `style="width: ${width}"` : ''}></div>`
        );

        if (content) setContent(content);
    }

    /**
     * @memberof DialogService.DialogObject
     * @name bringForward
     * @type {function}
     * @description Updates the dialog's elevation so that it is the highest object in the z-index stack.
     * @instance
     */
    function bringForward() {
        let highestZIndex = findHighestZIndex(document.querySelector('body'));
        dialog.overlay.style.zIndex = highestZIndex + 1;
        dialog.window.style.zIndex = highestZIndex + 2;
    }

    function dialogTransitionEndEvent(e) {
        // Handle Window Transition End
        if (e.target.classList && e.target.classList.contains('dialog-window')) {
            if (!e.target.classList.contains('opened')) {
                if (dialog.wrapper.parentNode) dialog.wrapper.parentNode.removeChild(dialog.wrapper);
            } else {
                setFocus();
            }
        }
    }

    function dialogClickEvent(e) {
        if (isElement(e.target)) {
            // Check for Click-To-Close
            let target = seekElementInBranch(e.target, 'hasAttribute', CloseAttribute);
            if (target && e.clientX !== 0 && e.clientY !== 0) {
                e.preventDefault();
                let response = target.getAttribute(CloseAttribute);
                close(response ? response : null, false);
            }
        }
    }

    function open() {
        try {
            // Initialize new deferral;
            if (deferral != null) close();
            deferral = generateDeferredPromise();
            dialog.bringForward();
            dialog.window.focus();
            document.querySelector('body').insertAdjacentElement('beforeend', dialog.wrapper);

            // The time between dialog insertion and 'opened' class assignment
            // is too fast. Timeout ensures browser will properly animate objects.
            setTimeout(() => {
                dialog.window.classList.add('opened');
                dialog.overlay.classList.add('opened');
                document.addEventListener('keyup', escapeClose);
            }, 100);

            return deferral.promise;
        } catch (error) {
            if (deferral != null) {
                deferral.reject({
                    error: error
                });
            } else {
                throw error;
            }
        }
    }

    function close(data, immediate = true) {
        // Clear Current Focus
        let tmp = document.createElement("input");
        document.body.appendChild(tmp);
        tmp.focus();
        document.body.removeChild(tmp)

        // return promise
        return new Promise((resolve, reject) => {
            try {
                if (immediate) {
                    dialog.window.classList.add('immediate');
                    dialog.overlay.classList.add('immediate');
                }

                dialog.window.classList.remove('opened');
                dialog.overlay.classList.remove('opened');

                document.removeEventListener('keyup', escapeClose);

                if (deferral != null) {
                    deferral.resolve(data);
                }

                setTimeout(resolve, 300);
            } catch (error) {
                if (deferral != null) {
                    deferral.reject({
                        error: error
                    });
                } else {
                    throw error;
                }

                reject(error);
            }
        });
    }

    function escapeClose(e) {
        if (e.key === 'Escape') {
            if (FieldTags.some(tagName => tagName.toUpperCase() == e.target.tagName)) close(null);
        }
    }

    function setContent(c) {
        if (typeof c != 'string' && !isElement(c))
            throw 'Invalid dialog content. Content must be a valid HTML string or HTML Element';

        dialog.window.innerHTML = '';

        if (typeof c === 'string') dialog.window.insertAdjacentHTML('afterbegin', c);
        else dialog.window.insertAdjacentElement('afterbegin', c);

        if (dialog.window.querySelector('.progress')) {
            dialog.progressBar = ProgressBar({ target: dialog.window.querySelector('.progress') });
        }
    }

    function setFocus() {
        let target = dialog.window.querySelector('init-focus');
        if (!target) target = Array.from(dialog.window.querySelectorAll(FieldTags.join(","))).find(x => {
            let type = x.getAttribute('type');
            return type !== 'hidden' && type != 'submit';
        });

        if (target) {
            target.focus();

            // 'Select All'
            try {
                target.setSelectionRange(target.value.length, target.value.length);
            } catch (error) {
                try {
                    target.select();
                } catch (innerError) {
                    return;
                }
            }
        }
    }
}

/**
 * @memberof DialogService 
 * @typedef {function}
 * @param {object} options Configuration Object
 * @param {(string|element)} options.title Dialog Window Title
 * @param {(string|element)} options.message Dialog Window Message
 * @param {string} options.width Dialog Window Width. Must define unit (px,pt,em)
 * @param {string} options.confirmLabel Rendered label of the "Confirm" button
 * @param {string} options.cancelLabel Rendered label of the "Cancel" button
 * @param {boolean} options.useCancel Display a cancel button
 * @param {boolean} options.useOverlayClose Use overlay click-to-close feature.
 * @param {string[]} options.classes Classes to be applied to the wrapper element.
 * @returns {Object} new DialogObject
 */
export function ConfirmDialog({
    title,
    message,
    width = 'auto',
    confirmLabel = 'Ok',
    cancelLabel = 'Cancel',
    useCancel = true,
    useOverlayClose = true,
    classes = []
}) {
    const template = `
        <div class="head">
            <h3 class="title">${title}</h1>
        </div>    
        <div class="progress accent">
            <div class="indeterminate"></div>
        </div>
        <div class="body">${message}</div>
        <div class="actions">
            ${useCancel ? `<button close-dialog="canceled">${cancelLabel}</button>` : ''}
            <button close-dialog="confirmed" class="raised">${confirmLabel}</button>
        </div>`;

    return Dialog({
        content: template,
        width: width,
        useOverlayClose: useOverlayClose,
        classes: classes
    });
}
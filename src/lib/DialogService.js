import {
    findHighestZIndex,
    isElement,
    seekElementInBranch,
    generateDeferredPromise
} from "./CommonHelpers";
import {
    FieldTags
} from "./FormHelpers";
import {
    ProgressBar
} from "./ProgressBar";

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

        dialog.wrapper.addEventListener("click", dialogEventHandler);
        dialog.wrapper.addEventListener("keyup", dialogEventHandler);

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
                return dialog.wrapper.querySelector('.card');
            }
        });

        /**
         * @memberof DialogService.DialogObject  
         * @name content
         * @type {HTML}
         * @description Gets/Sets the Dialog Window's content. Setter expects an HTML string or DOM Element.
         * @instance
         */
        Object.defineProperty(dialog, 'content', {
            get() {
                return dialog.window.innerHTML;
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
            <div class="card" role="dialog" ${width ? `style="width: ${width}"` : ''}></div>`
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
        if (e.target.classList && e.target.classList.contains('card')) {
            if (!e.target.classList.contains('opened')) {
                if (dialog.wrapper.parentNode) dialog.wrapper.parentNode.removeChild(dialog.wrapper);
            } else {
                setFocus();
            }
        }
    }

    function dialogEventHandler(e) {
        let target;

        // close Request
        target = seekElementInBranch(e.target, 'hasAttribute', CloseAttribute);
        if (target) {
            if ((e.type == 'click' && e.clientX !== 0 && e.clientY !== 0) || (e.type == 'keyup' && e.keyCode === 13)) {
                e.preventDefault();
                let response = target.getAttribute(CloseAttribute);
                close(response ? response : null, false);
            }
        }
    }

    /**
     * @memberof DialogService.DialogObject
     * @name open
     * @type {function}
     * @description Opens the dialog.
     * @returns {Promise}
     * @instance
     */
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

    /**
     * @memberof DialogService.DialogObject
     * @name close
     * @type {function}
     * @param {object} data Data to be returned to any active Open/Close promises.
     * @param {bool} immediate Close the window immediately or wait for the specified timeout period before closing.
     * @param {bool} timeout Number of milliseconds to wait before closing.
     * @description Closes the dialog.
     * @returns {Promise}
     * @instance
     */
    function close(data, immediate = true, timeout = 300) {
        // Clear Current Focus
        let tmp = document.createElement("input");
        document.body.appendChild(tmp);
        tmp.focus();
        document.body.removeChild(tmp);

        // return promise
        return new Promise((resolve, reject) => {
            try {
                document.removeEventListener('keyup', escapeClose);

                if (immediate) {
                    if (!dialog.window.classList.contains('immediate')) dialog.window.classList.add('immediate');
                    if (!dialog.overlay.classList.contains('immediate')) dialog.overlay.classList.add('immediate');
                    if (deferral != null) deferral.resolve(data);
                    resolve(data);
                }

                if (!immediate) {
                    if (dialog.window.classList.contains('immediate')) dialog.window.classList.remove('immediate');
                    if (dialog.overlay.classList.contains('immediate')) dialog.overlay.classList.remove('immediate');
                    if (deferral != null) setTimeout(() => deferral.resolve(data), timeout);
                    setTimeout(() => resolve(data), timeout);
                }

                dialog.window.classList.remove('opened');
                dialog.overlay.classList.remove('opened');

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
            if (!FieldTags.some(tagName => tagName.toUpperCase() == e.target.tagName)) close(null);
        }
    }

    function setContent(c) {
        if (typeof c != 'string' && !isElement(c))
            throw 'Invalid dialog content. Content must be a valid HTML string or HTML Element';

        dialog.window.innerHTML = '';

        if (typeof c === 'string') dialog.window.insertAdjacentHTML('afterbegin', c);
        else dialog.window.insertAdjacentElement('afterbegin', c);

        if (dialog.window.querySelector('.progress')) {
            dialog.progressBar = ProgressBar({
                target: dialog.window.querySelector('.progress')
            });
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
 * @param {{ label:string, value:string, classes:(string|string[]), styles:(string|string[]) }[]} options.actions Dialog window action settings. An action's value will be returned in Open/Close Promise Resolution if clicked.
 * @param {boolean} options.useOverlayClose Use overlay click-to-close feature.
 * @param {string[]} options.classes Classes to be applied to the wrapper element.
 * @returns {Object} new DialogObject
 */
export function ConfirmDialog({
    title,
    message,
    width = 'auto',
    actions = [{
            label: 'cancel',
            value: 'canceled'
        },
        {
            label: 'ok',
            classes: ['flat', 'primary'],
            value: 'Confirmed'
        }
    ],
    useOverlayClose = true,
    classes = []
}) {
    const template = `
        <div class="card-toolbar">
            <h3 class="card-title" >${title}</h1> 
            <div class="progress accent">
                <div class="indeterminate"></div>
            </div>
        </div>   
        <div class="card-content">${message}</div>
        <div class="card-toolbar actions">
            ${actions.map(action => templateAction(action)).join('')}
        </div>`;

    function templateAction(action) {
        let classes = CommonHelpers.isStringOrStringArray(action.classes);
        if (action.classes && !classes) throw "Invalid Confirm Dialog Action Class(es).";

        let styles = CommonHelpers.isStringOrStringArray(action.styles);
        if (action.classes && !classes) throw "Invalid Confirm Dialog Action Styles(es).";

        return `<button ${classes && classes.length > 0 ? `class="${classes.join(' ')}"` : ''} ${styles && styles.length > 0 ? `style="${styles.join(' ')}"` : ''} ${action.value ? `close-dialog="${action.value}"` : 'close-dialog'}>${action.label}</button>`;
    }

    return Dialog({
        content: template,
        width: width,
        useOverlayClose: useOverlayClose,
        classes: classes
    });
}
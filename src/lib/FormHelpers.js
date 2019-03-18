import {
    isElement
} from "./CommonHelpers";
import {
    ProgressBar
} from "./ProgressBar";

/**
 * Used to generate Helper Objects for managing forms and their fields.
 * @namespace FormHelpers
 */

// Start Global Listerns
document.addEventListener('keyup', HandleFieldEvent);
document.addEventListener('change', HandleFieldEvent);
document.addEventListener('blur', HandleFieldEvent, true);
document.addEventListener('focus', HandleFieldEvent, true);

function HandleFieldEvent(e) {
    let target = e.target;
    if (target.tagName && FieldTags.some(tag => tag.toUpperCase() == target.tagName)) {
        let field = Field(target);
        if (field.wrapper) {

            //Set placeholder state
            if (field.placeholder.element) {
                if (field.value && field.value != "") {
                    if (!field.placeholder.element.classList.contains('filled')) field.placeholder.element.classList.add('filled');
                } else field.placeholder.element.classList.remove('filled');
            }

            //Refresh Validation
            if (field.wrapper.classList.contains("touched") && !(e.key && e.keyCode == 9)) {
                field.validate();
            } else {
                field.wrapper.classList.add("touched");
            }
        }
        
        //Clear focus
        if (e.key && e.key == 'Escape') target.blur();

    }
}

/**
 * Generate a FormHelper
 * @memberof FormHelpers
 * @typedef {function}
 * @param {object} target DOM Element to be managed. If no form obj is found one will be added as the element's parent.
 * @param {function} callback Function to be called when the form is submitted.
 * @returns {{ field:function, fields:Field[], callback:function, data:Object, validate:function, isValid:boolean, isLocked:boolean, isLoading:boolean, element:element, wrapper:element, errors: {fieldName:string, errors:string[]}[], progressBar: { element:element, isLoading:boolean },  errorPanel: { element:element, text:string }, messagePanel: { element:element, text:string }, }}
 */
export function Form(target, callback) {
    const form = {};
    let isValid, isLocked, isLoading;

    initialize();

    return form;

    function initialize() {
        if (!isElement(target)) throw "Invalid target.";

        isValid = null;
        isLocked = false;
        isLoading = false;

        defineSimpleProperties();
        setFormElement();
        form.element.setAttribute('novalidate', '');
        buildFieldWrappers();
        setProgressBar();
        setMessagePanel();
        setErrorPanel();

        form.element.addEventListener('submit', (e) => {
            e.preventDefault();
            callback(form.validate(), form.data);
        });
    }

    function defineSimpleProperties() {
        /**
         * @memberof FormHelpers.Form  
         * @name wrapper
         * @type {Element}
         * @description Form Wrapper DOM Element
         * @instance
         */
        Object.defineProperty(form, 'wrapper', {
            get() {
                return target;
            }
        });

        /**
         * @memberof FormHelpers.Form 
         * @name data
         * @type {Object}
         * @description Returns Current Form Data
         * @instance
         */
        Object.defineProperty(form, 'data', {
            get() {
                return getData();
            }
        });


        /**
         * @memberof FormHelpers.Form 
         * @name callback
         * @type {Object}
         * @description Gets/Sets the function to be called when the validated form is submitted.
         * @instance
         */
        Object.defineProperty(form, 'callback', {
            get() {
                return callback;
            },
            set(func) {
                if (func && typeof func != 'function') throw "Invalid callback.";
                callback = func;
            }
        });

        /**
         * @memberof FormHelpers.Form 
         * @type {Function}
         * @property {string} name Form Field's Name
         * @description Get a Field by field name
         * @returns {Object} [Field](#formhelpersfield)
         * @instance
         */
        form.field = getField;

        /**
         * @memberof FormHelpers.Form 
         * @name fields
         * @type {Object[]} [[Field](#formhelpersfield)]
         * @description Gets an array of the target form's fields
         * @instance
         */
        Object.defineProperty(form, 'fields', {
            get() {
                return getFields();
            }
        });

        /**
         * @memberof FormHelpers.Form  
         * @name isValid
         * @type {boolean}
         * @description Returns the last evaluation state.
         * @instance
         */
        Object.defineProperty(form, 'isValid', {
            get() {
                return isValid;
            },
            set(bool) {
                if (typeof bool != 'boolean') throw 'Invalid boolean.';
                isValid = bool;
            }
        });


        /**
         * @memberof FormHelpers.Form
         * @name isLocked
         * @type {boolean}
         * @description Gets/Sets the locked state indicator of the form.
         * @instance
         */
        Object.defineProperty(form, 'isLocked', {
            get() {
                return isLocked;
            },
            set(locked = true) {
                if (typeof locked != 'boolean') throw "Invalid value";
                isLocked = locked;
                form.fields.forEach(field => field.isLocked = isLocked);
                Array.from(form.wrapper.querySelectorAll('button')).forEach(button => button.disabled = isLocked);
            }
        });

        /**
         * @memberof FormHelpers.Form
         * @name isLoading
         * @type {boolean}
         * @description Gets/Sets the loading state indicator of the form.
         * @instance
         */
        Object.defineProperty(form, 'isLoading', {
            get() {
                return isLoading;
            },
            set(loading = true) {
                if (typeof loading != 'boolean') throw "Invalid value";
                isLoading = loading;
                form.progressBar.isLoading = loading;
                form.isLocked = loading;
            }
        });


        /**
         * @memberof FormHelpers.Form  
         * @name validate()
         * @type {function}
         * @description Validates the form and sets/clears the error messages, and returns a boolean.
         * @instance
         * @returns {boolean}
         */
        form.validate = () => {
            isValid = true;
            form.fields.forEach(field => {
                if (!field.validate()) isValid = false;
            });
            return isValid;
        };

        /**
         * @memberof FormHelpers.Form  
         * @name errors
         * @type {{ fieldName: string, errors: string[]}[]}
         * @description  ** Gets/Sets the form errors.
         * @param  {{ fieldName: string, errors: string[]}[]}
         * @instance
         */
        Object.defineProperty(form, 'errors', {
            get() {
                return form.fields
                    .filter(field => field.error && field.error.text && field.error.text != "")
                    .map(field => {
                        return {
                            fieldName: field.name,
                            errors: [field.error.text]
                        };
                    });
            },
            set(formErrors) {
                if (!Array.isArray(formErrors)) throw 'Errors must be an array.';

                form.fields
                    .filter(field => field.wrapper)
                    .forEach(field => {
                        let errorIndex = formErrors.findIndex(fieldErrs => fieldErrs.fieldName === field.name);
                        if (errorIndex != -1) {
                            field.error.text = formErrors[errorIndex].messages[0];
                            formErrors.splice(errorIndex, 1);
                        } else field.error.text = "";
                    });

                let formErrorHTML = '';

                formErrors.forEach(fieldError => {
                    fieldError.messages.forEach(err => {
                        formErrorHTML += `<div class="error">${err}</div>`;
                    });
                });

                form.errorPanel.text = formErrorHTML;
            }
        });

        form.setValues = (data) => {
            const props = [];
            const fields = form.fields;

            for (let prop in data) {
                props.push(prop);
                if (fields.some(x => x.name == prop)) {
                    fields.find(x => x.name == prop).value = data[prop];
                }
            }

            fields.filter(x => props.indexOf(x.name) == -1).forEach(field => {
                field.value = "";
            });
        };

        form.updateValues = (data) => {
            const props = [];
            const fields = form.fields;

            for (let prop in data) {
                props.push(prop);
                if (fields.some(x => x.name == prop)) fields.find(x => x.name == prop).value = data[prop];
            }
        };
    }

    function setFormElement() {
        let element;

        /**
         * @memberof FormHelpers.Form
         * @name element
         * @type {element}
         * @description Form DOM Element
         * @instance
         */
        Object.defineProperty(form, 'element', {
            get: function () {
                return element;
            }
        });

        if (target.nodeName == "FORM") {
            element = target;
            return;
        }

        if (target.querySelector('form')) {
            element = target.querySelector('form');
            return;
        }

        element = document.createElement('form');

        if (target.parentElement)
            target.parentNode.replaceChild(element, target);

        element.insertAdjacentElement('afterbegin', target);
        target = element;
    }

    function buildFieldWrappers() {
        const fields = Array.from(form.element.querySelectorAll(FieldTags.join(":not(.ignore), ") + ":not(.ignore)"));
        fields.forEach(field => {
            if (!GetFieldWrapper(field)) BuildFieldWrapper(field);
        });
    }

    function setProgressBar() {
        const existing = target.querySelector('.progress');
        /**
         * @memberof FormHelpers.Form
         * @name progressBar
         * @type {ProgressBar}
         * @description Form Progress Bar
         * @instance
         */
        form.progressBar = ProgressBar({
            target: existing
        });

        if (!existing) {
            form.wrapper.insertAdjacentElement('afterbegin', form.progressBar.element);
        }
    }

    function setMessagePanel() {
        let panel = target.querySelector('.message:not(.error)');

        if (!panel) {
            panel = document.createElement('div');
            panel.classList.add('message');
            form.progressBar.element.insertAdjacentElement('afterend', panel);
        }

        setPanelState();

        /**
         * @memberof FormHelpers.Form
         * @name messagePanel
         * @type {{element: element, text: string}}
         * @description Returns an object containing the messagePanel element, and a getter/setter for the text.
         * @instance
         */
        form.messagePanel = {};
        Object.defineProperty(form.messagePanel, 'element', {
            get() {
                return panel;
            }
        });

        Object.defineProperty(form.messagePanel, 'text', {
            get() {
                let el = form.messagePanel.element;
                return (el) ? el.innerHTML : undefined;
            },
            set(value) {
                let el = form.messagePanel.element;
                if (el) el.innerHTML = value;
                setPanelState();
            }
        });

        function setPanelState() {
            panel.style.display = (panel.innerHTML && panel.innerHTML != "") ? '' : 'none';
        }
    }

    function setErrorPanel() {
        let panel = target.querySelector('.message.error');

        if (!panel) {
            let head = form.element.querySelector('.card .card-toolbars, .dialog-window .head');

            panel = document.createElement('div');
            panel.classList.add('message');
            panel.classList.add('error');
            panel.classList.add('warn');

            if (head) head.insertAdjacentElement('afterend', panel);
            else form.element.insertAdjacentElement('afterbegin', panel);
        }

        if (!panel.classList.contains('warn'))
            panel.classList.add('warn');

        setPanelState();

        /**
         * @memberof FormHelpers.Form
         * @name errorPanel
         * @type {{element: element, text: string}}
         * @description Returns an object containing the messagePanel element, and a getter/setter for the text.
         * @instance
         */
        form.errorPanel = {};
        Object.defineProperty(form.errorPanel, 'element', {
            get() {
                return panel;
            }
        });

        Object.defineProperty(form.errorPanel, 'text', {
            get() {
                let el = form.errorPanel.element;
                return (el) ? el.innerHTML : undefined;
            },
            set(value) {
                let el = form.errorPanel.element;
                if (el) el.innerHTML = value;
                setPanelState();
            }
        });

        function setPanelState() {
            if (panel.innerHTML && panel.innerHTML != "") {
                panel.style.display = '';
                form.messagePanel.element.style.display = 'none';
            } else {
                panel.style.display = 'none';
                if (form.messagePanel.text && form.messagePanel.text != '')
                    form.messagePanel.element.style.display = '';
            }
        }
    }

    function getData() {
        const data = {};
        const fields = Array.from(form.element.querySelectorAll(FieldTags.join(", ")));
        fields.forEach(field => {
            let name = field.name;
            if (name) data[name] = GetValue(field);
        });

        return data;
    }

    function getFields() {
        const fields = Array.from(form.element.querySelectorAll(FieldTags.join(", ")));
        return fields.map(x => Field(x));
    }

    function getField(name) {
        let field = null;
        for (let i = 0; i < FieldTags.length; i++) {
            field = form.element.querySelector(`${FieldTags[i]}[name="${name}"]`);
            if (field) return Field(field);
        }
    }
}

/**
 * Allowed Field Tags
 * @memberof FormHelpers
 * @constant {string[]}
 */
export const FieldTags = ['input', 'select', 'textarea'];

/**
 * Generate a FieldHelper
 * @memberof FormHelpers
 * @typedef {function}
 * @param {object} target Field DOM Element. A 'form-input' parent will be added if one is not found, unless target.type is 'hidden'.
 * @returns {{ name:string, value:any, setWrapper:function, validate:function, isValid:boolean, isLocked:boolean, isHidden:boolean, element:element, wrapper:element, error: { element:element, text:text }, note: { element:element, text:text }, placeholder: { element:element, text:text }}}
 */
export function Field(target) {
    if (!isField(target)) throw "Invalid target";
    let isLocked, isValid;

    const field = {
        placeholder: {},
        note: {},
        error: {}
    };

    initialize();

    function initialize() {
        // Set Defaults
        isLocked = false;
        isValid = null;

        defineStandardProperties();
        defineFieldTypeProperties();
    }

    function defineStandardProperties() {

        /**
         * @memberof FormHelpers.Field  
         * @name name
         * @type {Element}
         * @description Gets/Sets the fields name.
         * @instance
         */
        Object.defineProperty(field, 'name', {
            get() {
                return field.element.name;
            },
            set(name) {
                if (typeof name != 'string') throw 'Invalid name.';
                field.element.name = name;
            }
        });

        /**
         * @memberof FormHelpers.Field  
         * @name element
         * @type {Element}
         * @description Returns the Field DOM Element
         * @instance
         */
        Object.defineProperty(field, 'element', {
            get() {
                return target;
            }
        });

        /**
         * @memberof FormHelpers.Field  
         * @type {Element}
         * @name wrapper
         * @description Returns the .form-input parentElement
         * @instance
         */
        Object.defineProperty(field, 'wrapper', {
            get() {
                return GetFieldWrapper(field.element);
            }
        });

        /**
         * @memberof FormHelpers.Field  
         * @name value
         * @type {Element}
         * @description Gets/Sets the Field Value
         * @instance
         */
        Object.defineProperty(field, 'value', {
            get() {
                return GetValue(field.element);
            },
            set(value) {
                SetValue(field.element, value);

                if (field.placeholder.element) {
                    if (field.value && field.value != "") {
                        if (!field.placeholder.element.classList.contains('filled')) field.placeholder.element.classList.add('filled');
                    } else field.placeholder.element.classList.remove('filled');
                }

                field.validate();
            }
        });

        /**
         * @memberof FormHelpers.Field  
         * @name isHidden
         * @type {boolean}
         * @description Gets/Sets the hidden state indicator of the Field.
         * @instance
         */
        Object.defineProperty(field, 'isHidden', {
            get() {
                return isHidden;
            },
            set(hidden = true) {
                if (typeof hidden != 'boolean') throw "Invalid value";
                isHidden = hidden;
                HideField(field, isHidden);
            }
        });

        /**
         * @memberof FormHelpers.Field
         * @name placeholder
         * @type {{element: element, text: string}}
         * @description Returns an object containing the placeholder element, and a getter/setter for the text.
         * @instance
         */
        Object.defineProperty(field.placeholder, 'element', {
            get() {
                let wrapper = field.wrapper;
                return (wrapper) ? wrapper.querySelector('.placeholder') : undefined;
            }
        });

        Object.defineProperty(field.placeholder, 'text', {
            get() {
                let el = field.placeholder.element;
                return (el) ? el.innerHTML : undefined;
            },
            set(value) {
                let el = field.placeholder.element;
                if (el) el.innerHTML = value;
            }
        });

        /**
         * @memberof FormHelpers.Field
         * @name error
         * @type {{element: element, text: string}}
         * @description Returns an object containing the error element, and a getter/setter for the text.
         * @instance
         */
        Object.defineProperty(field.error, 'element', {
            get() {
                let wrapper = field.wrapper;
                return (wrapper) ? wrapper.querySelector('.error-message') : undefined;
            }
        });

        Object.defineProperty(field.error, 'text', {
            get() {
                let el = field.error.element;
                return (el) ? el.innerHTML : undefined;
            },
            set(text) {
                let errorEl = field.error.element;
                if (errorEl) {
                    let noteEl = field.note.element;
                    if (text && text != "") {
                        errorEl.innerHTML = text;
                        if (errorEl.classList.contains('hidden')) errorEl.classList.remove('hidden');
                        if (noteEl && !noteEl.classList.contains('hidden')) noteEl.classList.add('hidden');
                    } else {
                        errorEl.innerHTML = '';                        
                        if (!errorEl.classList.contains('hidden')) errorEl.classList.add('hidden');
                        if (noteEl && noteEl.classList.contains('hidden')) noteEl.classList.remove('hidden');
                    }
                }

            }
        });

        /**
         * @memberof FormHelpers.Field
         * @name note
         * @type {{element: element, text: string}}
         * @description Returns an object containing the error element, and a getter/setter for the text.
         * @instance
         */
        Object.defineProperty(field.note, 'element', {
            get() {
                let wrapper = field.wrapper;
                return (wrapper) ? wrapper.querySelector('.note') : undefined;
            }
        });

        Object.defineProperty(field.note, 'text', {
            get() {
                let el = field.note.element;
                return (el) ? el.innerHTML : undefined;
            },
            set(text) {
                let el = field.note.element;
                el.innerHTML = text ? text : "";
            }
        });

        /**
         * @memberof FormHelpers.Field  
         * @name isValid
         * @type {boolean}
         * @description Returns the last evaluation state.
         * @instance
         */
        Object.defineProperty(field, 'isValid', {
            get() {
                return isValid;
            },
            set(bool) {
                if (typeof bool != 'boolean') throw 'Invalid boolean.';
                isValid = bool;
            }
        });

        /**
         * @memberof FormHelpers.Field  
         * @name isLocked
         * @type {boolean}
         * @description Gets/Sets the locked state indicator.
         * @instance
         */
        Object.defineProperty(field, 'isLocked', {
            get() {
                return isLocked;
            },
            set(locked) {
                if (typeof locked != 'boolean') throw 'Invalid boolean.';
                isValid = locked;
                LockField(field, locked);
            }
        });

        /**
         * @memberof FormHelpers.Field  
         * @name validate()
         * @type {function}
         * @description Validates the field and sets/clears the error message, and returns a boolean.
         * @instance
         * @returns {boolean}
         */
        field.validate = () => {
            isValid = ValidateField(field);
            return isValid;
        };

        /**
         * @memberof FormHelpers.Field  
         * @type {function}
         * @description Establishes a wrapper and it's required childrenfor the field if one does not exist.
         * @instance
         */
        field.setWrapper = () => {
            if (!field.wrapper) BuildFieldWrapper(field.element);
            else field.value = field.value;
        };
    }

    function defineFieldTypeProperties() {
        if (field.element.nodeName == 'SELECT') {
            /**
             * @memberof FormHelpers.Field  
             * @name options
             * @type {{ text: string, value: string, selected: boolean}[]}
             * @description  ** Only available for select fields. Gets/Sets the fields options.
             * @param {{ text: string, value: string, selected: boolean}[]} options
             * @instance
             */
            Object.defineProperty(field, 'options', {
                get() {
                    return (field.element.options) ? Array.from(field.element.options).map(option => {
                        return {
                            text: option.text,
                            value: option.value
                        };
                    }) : [];
                },
                set(options) {
                    if (!Array.isArray(options)) throw "Options must be an array";
                    field.element.innerHTML = "";
                    options.forEach(option => {
                        const o = new Option(option.text, option.value, false, (option.selected) ? true : false);
                        if (option.disabled) o.disabled = true;
                        field.element.appendChild(o);
                    });

                    if (options.length > 0)  field.value = field.element[options.some(x => x.selected) ? field.element.selectedIndex : 0].value;
                }
            });
        }
    }

    return field;
}

function BuildFieldWrapper(element) {
    if (!isField(element)) throw "Invalid element";
    if (element.type.toLowerCase() == 'hidden') return Field(element);

    switch (element.type.toLowerCase()) {
        case 'hidden':
            break;
        case 'checkbox':
            {
                const wrapper = document.createElement('label');
                wrapper.classList.add('form-checkbox');
                wrapper.insertAdjacentHTML('afterbegin',
                    `<span class="placeholder"></span>
                    <span class="checkmark"></span>`);

                const placeholder = wrapper.querySelector('.placeholder');
                let placeholderText = element.getAttribute('placeholder');
                if (!placeholderText) placeholderText = element.name;
                placeholder.innerHTML = `${placeholderText}${(element.required && placeholderText.indexOf('*') == -1) ? '*' : ''}`;
                element.removeAttribute('placeholder');


                if (element.parentElement) element.parentElement.replaceChild(wrapper, element);
                else if (element.parentNode) element.parentNode.replaceChild(wrapper, element);

                wrapper.insertAdjacentElement('afterbegin', element);

                break;
            }
        default:
            {
                const wrapper = document.createElement('div');
                wrapper.classList.add('form-input');
                wrapper.insertAdjacentHTML('afterbegin',
                    `<label>
                    <span class="placeholder"></span>
                </label>
                <div class="error-message"></div>
                <div class="note"></div>`);


                const note = wrapper.querySelector('.note');
                if (element.dataset && element.dataset.note)
                    note.innerHTML = element.dataset.note;

                if (element.dataset && element.dataset.noteAlign)
                    note.classList.add(element.dataset.noteAlign);

                const error = wrapper.querySelector('.error-message');
                if (!error.classList.contains('hidden')) error.classList.add('hidden');

                const placeholder = wrapper.querySelector('.placeholder');
                let placeholderText = element.getAttribute('placeholder');
                if (!placeholderText) placeholderText = element.name;
                placeholder.innerHTML = `${placeholderText}${(element.required && placeholderText.indexOf('*') == -1) ? '*' : ''}`;
                element.setAttribute('placeholder', '');

                const label = wrapper.querySelector('label');

                if (element.parentElement) element.parentElement.replaceChild(wrapper, element);
                else if (element.parentNode) element.parentNode.replaceChild(wrapper, element);

                label.insertAdjacentElement('afterbegin', element);
            }
    }

    let field = Field(element);    
    field.value = field.value;
    return field;
}

export const validationPatterns = {
    url: /^(?:(?:https?|HTTPS?|ftp|FTP):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)*)(?::\d{2,5})?(?:[\/?#]\S*)?$/,
    email: /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/
};

function ValidateField(field) {
    // check if part of field group
    let groupWrapper = GetFieldGroupWrapper(field.element);
    if (groupWrapper) {
        const errors = [];
        const fields = Array.from(groupWrapper.querySelectorAll(FieldTags.join(','))).map(x => {
            return Field(x);
        });
        fields.forEach(f => {
            const error = getError(f.element);
            if (error) errors.push({
                field: f,
                error: error
            });
        });

        if (fields.length > 0) {
            if (errors.length > 0) {
                errors[0].field.error.text = errors[0].error;
                return false;
            } else {
                fields[0].error.text = "";
                return true;
            }
        }

    } else if (field.element.tagName && FieldTags.some(x => x.toUpperCase() === field.element.tagName)) {
        const error = getError(field.element);
        field.error.text = error;
        return (error) ? false : true;
    }

    function getError(target) {
        let messageOverride = null;

        // Don't validate submits, buttons, file and reset inputs, and disabled fields
        if (target.disabled || target.type === 'reset' || target.type === 'submit' || target.type === 'button') return;

        var validity = target.validity;
        if (validity.valid) return;

        if (validity.typeMismatch) {
            messageOverride = getOverrideMessage('type-error');
            if (messageOverride) return messageOverride;
            switch (target.type.toLowerCase()) {
                case 'email':
                    return 'Invalid email address.';
                case 'url':
                    return 'Invalid URL.';
                default:
                    return 'Invalid value.';
            }
        }

        if (target.type.toLowerCase() == 'url' && !validationPatterns.url.test(target.value)) {
            messageOverride = getOverrideMessage('url-error');
            return messageOverride ? messageOverride : 'Invalid URL.';
        }

        if (target.type.toLowerCase() == 'email' && !validationPatterns.email.test(target.value)) {
            messageOverride = getOverrideMessage('email-error');
            return messageOverride ? messageOverride : 'Invalid Email.';
        }

        if (validity.tooShort) {
            messageOverride = getOverrideMessage('minLength-error');
            return messageOverride ? messageOverride : `Must be at least ${target.getAttribute('minLength')} characters.`;
        }

        if (validity.tooLong) {
            messageOverride = getOverrideMessage('maxLength-error');
            return messageOverride ? messageOverride : `Must be no more than ${target.getAttribute('maxLength')} characters.`;
        }

        // If number input isn't a number
        if (validity.badInput) {
            messageOverride = getOverrideMessage('nan-error');
            if (messageOverride) return messageOverride;

            switch (target.type) {
                case 'number':
                    return 'Invalid Number.';
                case 'date':
                    return 'Invalid Date.';
                default:
                    return 'Invalid Date.';
            }
        }

        // If a number value doesn't match the step interval
        if (validity.stepMismatch) {
            messageOverride = getOverrideMessage('step-error');
            return messageOverride ? messageOverride : `Invalid value.`;
        }

        if (validity.rangeOverflow) {
            messageOverride = getOverrideMessage('max-error');
            return messageOverride ? messageOverride : `Must be no more than ${target.getAttribute('max')}.`;
        }

        if (validity.rangeUnderflow) {
            messageOverride = getOverrideMessage('min-error');
            return messageOverride ? messageOverride : `Must be at least ${target.getAttribute('min')}.`;
        }

        if (validity.patternMismatch) {
            messageOverride = getOverrideMessage('pattern-error');
            return messageOverride ? messageOverride : 'Invalid Value.';
        }

        if (validity.valueMissing) {
            messageOverride = getOverrideMessage('required-error');
            return messageOverride ? messageOverride : `Field is required.`;
        }

        return 'Invalid Value.';

        function getOverrideMessage(attributeName) {
            return target.hasAttribute(attributeName) ? target.getAttribute(attributeName) : null;
        }
    }
}

function LockField(field, isLocked = true) {
    field.element.disabled = isLocked;
    const wrapper = field.wrapper;

    if (wrapper) {
        if (isLocked) wrapper.classList.add('locked');
        else wrapper.classList.remove('locked');
    }
}

function HideField(field, isHidden = true) {
    const wrapper = field.wrapper;
    if (wrapper) wrapper.style.display = (isHidden) ? 'none' : '';
    else field.element.style.display = (isHidden) ? 'none' : '';
}

function GetFieldWrapper(target) {
    while (target) {
        if (target.classList && (target.classList.contains('form-input') || target.classList.contains('form-checkbox'))) break;
        target = target.parentNode;
    }
    return target;
}

function GetFieldGroupWrapper(target) {
    let groupWrapper = target.parentNode;
    while (groupWrapper) {
        if (groupWrapper.classList && groupWrapper.classList.contains('field-group')) break;
        groupWrapper = groupWrapper.parentNode;
    }

    return groupWrapper;
}

function GetValue(target) {
    if (!isField(target)) throw "Invalid target";

    let value;
    if (target.type == 'checkbox') value = target.checked;
    else if (target.tagName == 'SELECT') value = (target[target.selectedIndex]) ? target[target.selectedIndex].value : undefined;
    else value = target.value;

    return value;
}

function SetValue(target, value) {
    if (!isField(target)) throw "Invalid target";

    if (target.type == 'checkbox') target.checked = value;
    else if (target.tagName == 'SELECT') target.selectedIndex = Array.from(target.options).findIndex(option => option.value == value);
    else target.value = value;

    target.dispatchEvent(new Event('change'));
}

function isField(target) {
    if (!isElement(target)) return false;
    if (!FieldTags.some(tag => target.nodeName == tag.toUpperCase())) return false;
    return true;
}
 /**
  *  Generates a new Toaster Object
  * @module Toaster
  * @typedef {function}
  * @returns {{ toaster:function }}
  */
 export function Toaster() {

     const toaster = {};

     initialize();

     return toaster;

     function initialize() {

         Object.defineProperty(toaster, 'element', {
             get() {
                 return document.querySelector('#toaster');
             }
         });

         toaster.toast = toast;

         if (!toaster.element)
             document.querySelector('body').insertAdjacentHTML('beforeend', '<div id="toaster"></div>');
     }

     /**
      * @memberof Toaster
      * @param {Object} options
      * @param {string} options.message Message to be displayed.
      * @param {number} options.duration milliseconds of time to display toast. Set to null/undefined to display indefinitely.
      * @param {{ label:string, classes:string, value:string }[]} options.actions Toast Actions.
      * @param {string[]} options.classes Additional classes to be applied to the Toast Element.
      * @returns {Promise<string>} The clicked actions value will be sent in the returned Promise's resolution. If no value is provided, label value will be sent. If the toast is closed by the duration timer, "timeout" will be sent.
      */
     function toast({
         message,
         duration = 2000,
         actions = [{
             label: 'ok'
         }],
         classes = []
     }) {
         return new Promise((resolve, reject) => {
             const el = document.createElement('div');
             el.classList.add('toast');
             classes.forEach(x => el.classList.add(x));

             el.insertAdjacentHTML('beforeend', `<div class='message'>${message}</div>`);

             if (actions.length > 0) {
                 el.insertAdjacentHTML('beforeend', `<div class='actions'></div>`);
                 const actionBar = el.querySelector('.actions');
                 actions.forEach(action => actionBar.insertAdjacentElement('beforeend', toastAction(action)));
                 console.log(el);
             }

             el.addEventListener('transitionend', () => {
                 if (!el.classList.contains('popped') && el.parentElement) {
                     el.parentElement.removeChild(el);
                 }
             });

             Array.from(el.querySelectorAll('[close-toast]'))
                 .forEach(closer => closer.addEventListener('click', () => close(closer.getAttribute('close-toast'))));

             toaster.element.insertAdjacentElement('beforeend', el);

             // The time between toast insertion and 'popped' class assignment
             // is too fast. Timeout ensures browser will properly animate objects.
             setTimeout(() => {
                 el.classList.add('popped');
                 if (Number.isInteger(duration)) setTimeout(() => {
                     if (el.classList.contains('popped')) close('timeout');
                 }, duration);
             }, 1);

             function toastAction(action) {
                 if (!action.classes) action.classes = [];
                 const button = document.createElement('button');
                 action.classes.forEach(x => button.classList.add(x));
                 button.innerHTML = action.label;
                 button.setAttribute('close-toast', (action.value) ? action.value : action.label);
                 return button;
             }

             function close(value) {
                 el.classList.remove('popped');
                 resolve(value);
             }
         });
     }
 }
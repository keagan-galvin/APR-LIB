<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [CommonHelpers][1]
    -   [isElement][2]
        -   [Parameters][3]
    -   [findHighestZIndex][4]
    -   [generateDeferredPromise][5]
    -   [seekElementInBranch][6]
        -   [Parameters][7]
-   [CommonListeners][8]
    -   [Linkable][9]
    -   [Ripple][10]
    -   [HoverSpin][11]
-   [DialogService][12]
    -   [CloseAttribute][13]
    -   [Dialog][14]
        -   [Parameters][15]
    -   [DialogObject][16]
        -   [wrapper][17]
        -   [overlay][18]
        -   [window][19]
        -   [content][20]
        -   [progressBar][21]
        -   [bringForward][22]
    -   [ConfirmDialog][23]
        -   [Parameters][24]
-   [FormHelpers][25]
    -   [Form][26]
        -   [Parameters][27]
        -   [wrapper][28]
        -   [data][29]
        -   [callback][30]
        -   [field][31]
            -   [Properties][32]
        -   [fields][33]
        -   [isValid][34]
        -   [isLocked][35]
        -   [isLoading][36]
        -   [validate][37]
        -   [errors][38]
        -   [element][39]
        -   [progressBar][40]
        -   [messagePanel][41]
        -   [errorPanel][42]
    -   [FieldTags][43]
    -   [Field][44]
        -   [Parameters][45]
        -   [name][46]
        -   [element][47]
        -   [wrapper][48]
        -   [value][49]
        -   [isHidden][50]
        -   [placeholder][51]
        -   [error][52]
        -   [note][53]
        -   [isValid][54]
        -   [isLocked][55]
        -   [validate][56]
        -   [setWrapper][57]
        -   [options][58]
            -   [Parameters][59]
-   [HttpService][60]
    -   [subscriptions][61]
    -   [subscribe][62]
        -   [Parameters][63]
        -   [Properties][64]
    -   [get][65]
        -   [Parameters][66]
    -   [post][67]
        -   [Parameters][68]
    -   [getQueryParam][69]
        -   [Parameters][70]
-   [ProgressBar][71]
    -   [Parameters][72]
    -   [Properties][73]
-   [Toaster][74]
    -   [toast][75]
        -   [Parameters][76]

## CommonHelpers

A set of common helper methods

### isElement

Validates if the provided object is a DOM Element.

#### Parameters

-   `obj` **[Object][77]** Object to tests.

Returns **[boolean][78]** 

### findHighestZIndex

Finds and returns the document's highest z-index.

Type: [function][79]

Returns **[number][80]** highest z-index

### generateDeferredPromise

Generates a DeferredPromise, like those used in JQuery. Avoid using, a standard Promise should be used in its place.

Type: [function][79]

Returns **{promise: [Promise][81], resolve: [function][79], reject: [function][79]}** Deferred Promise Object

### seekElementInBranch

Walks up a node tree looking for a criteria match, returning the matched Element or a Null.

Type: [function][79]

#### Parameters

-   `startingElement` **[element][82]** Node branch to search.
-   `searchMethod` **[string][83]** Node attribute to be checked. Accepts "hasId", "hasClass", "hasAttribute" \*
-   `searchIdentifier` **[string][83]** Node value to find.

Returns **([element][82] | null)** Seeker result

## CommonListeners

Global Event Listeners that are commonly used.

### Linkable

Listens for "Click" events on objects with an attribute of 'linkable', and redirects the window to the 'linkable' attribute value.

Type: EventListener

### Ripple

Listens for "Click" events on buttons or objects with a class of 'ripple', and redirects the window to the 'linkable' attribute value.

Type: EventListener

### HoverSpin

Listens for a "mouseenter" events on ‹i› objects with an attribute of 'hover-spin', and applies the css class .fa-spin.

Type: EventListener

## DialogService

Service used for generating DialogObjects

### CloseAttribute

Element Attribute that is used for click-to-close elements. The attributes value will be sent in the promise response.

Type: [string][83]

### Dialog

Generates a Dialog Object

Type: [function][79]

#### Parameters

-   `options` **[object][77]** Configuration Object
    -   `options.content` **([string][83] \| [element][82])** HTML or Element to be rendered in the dialog element.
    -   `options.width` **[string][83]** Dialog Window Width. Must define unit (px,pt,em) (optional, default `'auto'`)
    -   `options.useOverlayClose` **[boolean][78]** Use overlay click-to-close feature. (optional, default `true`)
    -   `options.classes` **[Array][84]&lt;[string][83]>** Classes to be applied to the wrapper element. (optional, default `[]`)

Returns **[Object][77]** new DialogObject

### DialogObject

A Dialog Interface Object

Type: Dialog

#### wrapper

Dialog Wrapper DOM Element

Type: [Element][82]

#### overlay

Dialog Overlay DOM Element

Type: [Element][82]

#### window

Dialog Window DOM Element

Type: [Element][82]

#### content

Gets/Sets the Dialog Window's content. Setter expects an HTML string or DOM Element.

Type: HTMLCollection

#### progressBar

The Dialog Windows ProgressBar. Null if one is not found.

Type: ([ProgressBar][85] | null)

#### bringForward

Updates the dialog's elevation so that it is the highest object in the z-index stack.

Type: [function][79]

### ConfirmDialog

Type: [function][79]

#### Parameters

-   `options` **[object][77]** Configuration Object
    -   `options.title` **([string][83] \| [element][82])** Dialog Window Title
    -   `options.message` **([string][83] \| [element][82])** Dialog Window Message
    -   `options.width` **[string][83]** Dialog Window Width. Must define unit (px,pt,em) (optional, default `'auto'`)
    -   `options.confirmLabel` **[string][83]** Rendered label of the "Confirm" button (optional, default `'Ok'`)
    -   `options.cancelLabel` **[string][83]** Rendered label of the "Cancel" button (optional, default `'Cancel'`)
    -   `options.useCancel` **[boolean][78]** Display a cancel button (optional, default `true`)
    -   `options.useOverlayClose` **[boolean][78]** Use overlay click-to-close feature. (optional, default `true`)
    -   `options.classes` **[Array][84]&lt;[string][83]>** Classes to be applied to the wrapper element. (optional, default `[]`)

Returns **[Object][77]** new DialogObject

## FormHelpers

Used to generate Helper Objects for managing forms and their fields.

### Form

Generate a FormHelper

Type: [function][79]

#### Parameters

-   `target` **[object][77]** DOM Element to be managed. If no form obj is found one will be added as the element's parent.
-   `callback` **[function][79]** Function to be called when the form is submitted.

Returns **{field: [function][79], fields: [Array][84]&lt;Field>, callback: [function][79], data: [Object][77], validate: [function][79], isValid: [boolean][78], isLocked: [boolean][78], isLoading: [boolean][78], element: [element][82], wrapper: [element][82], errors: [Array][84]&lt;{fieldName: [string][83], errors: [Array][84]&lt;[string][83]>}>, progressBar: {element: [element][82], isLoading: [boolean][78]}, errorPanel: {element: [element][82], text: [string][83]}, messagePanel: {element: [element][82], text: [string][83]}}** 

#### wrapper

Form Wrapper DOM Element

Type: [Element][82]

#### data

Returns Current Form Data

Type: [Object][77]

#### callback

Gets/Sets the function to be called when the validated form is submitted.

Type: [Object][77]

#### field

Get a Field by field name

Type: [Function][79]

##### Properties

-   `name` **[string][83]** Form Field's Name

Returns **[Object][77]** [Field][86]

#### fields

Gets an array of the target form's fields

Type: [Array][84]&lt;[Object][77]>

#### isValid

Returns the last evaluation state.

Type: [boolean][78]

#### isLocked

Gets/Sets the locked state indicator of the form.

Type: [boolean][78]

#### isLoading

Gets/Sets the loading state indicator of the form.

Type: [boolean][78]

#### validate

Validates the form and sets/clears the error messages, and returns a boolean.

Type: [function][79]

Returns **[boolean][78]** 

#### errors

\*\* Gets/Sets the form errors.

Type: [Array][84]&lt;{fieldName: [string][83], errors: [Array][84]&lt;[string][83]>}>

#### element

Form DOM Element

Type: [element][82]

#### progressBar

Form Progress Bar

Type: [ProgressBar][85]

#### messagePanel

Returns an object containing the messagePanel element, and a getter/setter for the text.

Type: {element: [element][82], text: [string][83]}

#### errorPanel

Returns an object containing the messagePanel element, and a getter/setter for the text.

Type: {element: [element][82], text: [string][83]}

### FieldTags

Allowed Field Tags

Type: [Array][84]&lt;[string][83]>

### Field

Generate a FieldHelper

Type: [function][79]

#### Parameters

-   `target` **[object][77]** Field DOM Element. A 'form-input' parent will be added if one is not found, unless target.type is 'hidden'.

Returns **{name: [string][83], value: any, setWrapper: [function][79], validate: [function][79], isValid: [boolean][78], isLocked: [boolean][78], isHidden: [boolean][78], element: [element][82], wrapper: [element][82], error: {element: [element][82], text: [text][87]}, note: {element: [element][82], text: [text][87]}, placeholder: {element: [element][82], text: [text][87]}}** 

#### name

Gets/Sets the fields name.

Type: [Element][82]

#### element

Returns the Field DOM Element

Type: [Element][82]

#### wrapper

Returns the .form-input parentElement

Type: [Element][82]

#### value

Gets/Sets the Field Value

Type: [Element][82]

#### isHidden

Gets/Sets the hidden state indicator of the Field.

Type: [boolean][78]

#### placeholder

Returns an object containing the placeholder element, and a getter/setter for the text.

Type: {element: [element][82], text: [string][83]}

#### error

Returns an object containing the error element, and a getter/setter for the text.

Type: {element: [element][82], text: [string][83]}

#### note

Returns an object containing the error element, and a getter/setter for the text.

Type: {element: [element][82], text: [string][83]}

#### isValid

Returns the last evaluation state.

Type: [boolean][78]

#### isLocked

Gets/Sets the locked state indicator.

Type: [boolean][78]

#### validate

Validates the field and sets/clears the error message, and returns a boolean.

Type: [function][79]

Returns **[boolean][78]** 

#### setWrapper

Establishes a wrapper and it's required childrenfor the field if one does not exist.

Type: [function][79]

#### options

\*\* Only available for select fields. Gets/Sets the fields options.

Type: [Array][84]&lt;{text: [string][83], value: [string][83], selected: [boolean][78]}>

##### Parameters

-   `options` **[Array][84]&lt;{text: [string][83], value: [string][83], selected: [boolean][78]}>** 

## HttpService

Generates a new HttpService Object

Type: [function][79]

Returns **{subscribe: [function][79], get: [function][79], post: [function][79], getQueryParam: [function][79]}** HttpService Object

### subscriptions

Gets an array of subscriber callbacks.

Type: [Array][84]&lt;[function][79]>

### subscribe

Subscribes to the HttpService. An EventData object will be passed into the provided callback when a monitored event occurs.

Type: [Function][79]

#### Parameters

-   `callback`  

#### Properties

-   `callback` **[function][79]** function to be called on event.

### get

Passes a basic GET request to the provided URL, and returns its response.

Type: [Function][79]

#### Parameters

-   `url` **[string][83]** Request URL.

### post

Makes a basic POST request to the provided URL, and returns its response.

Type: [Function][79]

#### Parameters

-   `url` **[string][83]** Request URL.
-   `data` **[Object][77]** Data to be passed.
-   `contentType` **[string][83]** ContentType to be used in the request header. (optional, default `defaultContentType`)

### getQueryParam

Searches a URL for the requested Parameter. If found its value is returned.

Type: [Function][79]

#### Parameters

-   `variable`  
-   `url` **[string][83]** URL to search. If one is not provided, window.location will be used by default. (optional, default `null`)
-   `paramName` **[string][83]** Query String Parameter to search for.

Returns **[string][83]** Query String Parameter Value or undefined object.

## ProgressBar

Generate a ProgressBar

Type: [function][79]

### Parameters

-   `options` **[Object][77]** 
    -   `options.target` **[Element][82]?** Binds return object to an existing DOM Element.
    -   `options.theme` **[string][83]** Applies a theme class to the ProgressBar. (optional, default `'accent'`)
    -   `options.type` **[string][83]** Applies a type class to the ProgressBar. (optional, default `'indeterminate'`)

### Properties

-   `element` **[Element][82]** The ProgressBar DOM Element.
-   `isLoading` **[boolean][78]** The ProgressBar's loading state.

Returns **{element: [element][82], isLoading: [boolean][78]}** 

## Toaster

Generates a new Toaster Object

Type: [function][79]

Returns **{toaster: [function][79]}** 

### toast

#### Parameters

-   `options` **[Object][77]** 
    -   `options.message` **[string][83]** Message to be displayed.
    -   `options.duration` **[number][80]** milliseconds of time to display toast. Set to null/undefined to display indefinitely. (optional, default `2000`)
    -   `options.actions` **[Array][84]&lt;{label: [string][83], classes: [string][83], value: [string][83]}>** Toast Actions. (optional, default `[{label:'ok'}]`)
    -   `options.classes` **[Array][84]&lt;[string][83]>** Additional classes to be applied to the Toast Element. (optional, default `[]`)

Returns **[Promise][81]&lt;[string][83]>** The clicked actions value will be sent in the returned Promise's resolution. If no value is provided, label value will be sent. If the toast is closed by the duration timer, "timeout" will be sent.

[1]: #commonhelpers

[2]: #iselement

[3]: #parameters

[4]: #findhighestzindex

[5]: #generatedeferredpromise

[6]: #seekelementinbranch

[7]: #parameters-1

[8]: #commonlisteners

[9]: #linkable

[10]: #ripple

[11]: #hoverspin

[12]: #dialogservice

[13]: #closeattribute

[14]: #dialog

[15]: #parameters-2

[16]: #dialogobject

[17]: #wrapper

[18]: #overlay

[19]: #window

[20]: #content

[21]: #progressbar

[22]: #bringforward

[23]: #confirmdialog

[24]: #parameters-3

[25]: #formhelpers

[26]: #form

[27]: #parameters-4

[28]: #wrapper-1

[29]: #data

[30]: #callback

[31]: #field

[32]: #properties

[33]: #fields

[34]: #isvalid

[35]: #islocked

[36]: #isloading

[37]: #validate

[38]: #errors

[39]: #element

[40]: #progressbar-1

[41]: #messagepanel

[42]: #errorpanel

[43]: #fieldtags

[44]: #field-1

[45]: #parameters-5

[46]: #name

[47]: #element-1

[48]: #wrapper-2

[49]: #value

[50]: #ishidden

[51]: #placeholder

[52]: #error

[53]: #note

[54]: #isvalid-1

[55]: #islocked-1

[56]: #validate-1

[57]: #setwrapper

[58]: #options

[59]: #parameters-6

[60]: #httpservice

[61]: #subscriptions

[62]: #subscribe

[63]: #parameters-7

[64]: #properties-1

[65]: #get

[66]: #parameters-8

[67]: #post

[68]: #parameters-9

[69]: #getqueryparam

[70]: #parameters-10

[71]: #progressbar-2

[72]: #parameters-11

[73]: #properties-2

[74]: #toaster

[75]: #toast

[76]: #parameters-12

[77]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[78]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean

[79]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function

[80]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number

[81]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise

[82]: https://developer.mozilla.org/docs/Web/API/Element

[83]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[84]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array

[85]: #progressbar

[86]: #formhelpersfield

[87]: https://developer.mozilla.org/docs/Web/HTML

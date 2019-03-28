import {
    findHighestZIndex, seekElementInBranch
} from "../CommonHelpers";

/**
 * @memberof Listeners
 * @name Ripple
 * @typedef {EventListener}
 * @description Listens for "Click" events on buttons or objects with a class of 'ripple', and redirects the window to the 'linkable' attribute value.
 */
document.addEventListener('click', Ripple);

function Ripple(e) {
    let target = e.target;

    while (target) {
        if (!target.disabled) {
            if (target.classList) {
                if (Array.from(target.classList).some(x => x === 'button' || x === 'ripple' || x === 'paginate_button')) {
                    if (target.classList.contains('paginate_button') && !target.classList.contains('disabled'))
                        break;

                    if (!target.classList.contains('paginate_button'))
                        break;
                }
            }

            if (target.tagName == 'BUTTON')
                break;
        }

        target = target.parentNode;
    }

    if (target && (Array.from(target.classList).some(x => x === 'button' || x === 'ripple' || x === 'paginate_button') || target.tagName == 'BUTTON')) {
        // Get necessary variables
        const rect = target.getBoundingClientRect(),
            left = rect.left,
            top = rect.top,
            width = target.offsetWidth,
            height = target.offsetHeight,
            offsetTop = target.offsetTop,
            offsetLeft = target.offsetLeft,
            dx = e.clientX - left,
            dy = e.clientY - top,
            maxX = Math.max(dx, width - dx),
            maxY = Math.max(dy, height - dy),
            style = window.getComputedStyle(target),
            radius = Math.sqrt((maxX * maxX * 1.2) + (maxY * maxY * 1.2)),
            classList = (target.classList) ? Array.from(target.classList) : [];

        // Create the ripple and its container
        const ripple = document.createElement("div"),
            rippleContainer = document.createElement("div");


        // Add optional classes
        let useLight = false;

        if (classList.some(x => x === 'raised') && classList.some(x => x === 'primary' || x === 'accent' || x === 'warn')) {
            useLight = true;
        } else if (classList.some(x => x === 'flat')) {
            useLight = true;
        } else if (classList.some(x => x === 'light')) {
            useLight = true;
        }

        ripple.classList.add(useLight ? 'light' : 'dark');

        // Add class, append and set location
        ripple.classList.add("ripple-effect");
        rippleContainer.classList.add("ripple-container");
        rippleContainer.appendChild(ripple);
        target.appendChild(rippleContainer);

        ripple.style.marginLeft = dx + "px";
        ripple.style.marginTop = dy + "px";
        rippleContainer.style.zIndex = style.zIndex + 1;

        //rippleContainer.style.left = left + (((window.pageXOffset || document.scrollLeft) - (document.clientLeft || 0)) || 0) + "px";
        //rippleContainer.style.top = top + (((window.pageYOffset || document.scrollTop) - (document.clientTop || 0)) || 0) + "px";
        rippleContainer.style.width = width + "px";
        rippleContainer.style.height = height + "px";

        rippleContainer.style.borderTopLeftRadius = style.borderTopLeftRadius;
        rippleContainer.style.borderTopRightRadius = style.borderTopRightRadius;
        rippleContainer.style.borderBottomLeftRadius = style.borderBottomLeftRadius;
        rippleContainer.style.borderBottomRightRadius = style.borderBottomRightRadius;

        setTimeout(() => {
            ripple.style.width = radius * 2 + "px";
            ripple.style.height = radius * 2 + "px";
            ripple.style.marginLeft = dx - radius + "px";
            ripple.style.marginTop = dy - radius + "px";
        }, 0);

        setTimeout(() => ripple.style.backgroundColor = "rgba(0, 0, 0, 0)", 100);

        setTimeout(() => {
            ripple.remove();
            rippleContainer.remove();
        }, 650);

    }

}

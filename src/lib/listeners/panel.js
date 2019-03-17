import { seekElementInBranch } from "../CommonHelpers";

document.addEventListener('click', PanelClickEvent);

function PanelClickEvent(e) {
    const animationClass = 'animatable';
    const expandedClass = 'expanded';
    const rotateClass = 'fa-rotate-180';

    let target = seekElementInBranch(e.target, 'hasAttribute', 'toggle-panel');

    // If toggle clicked
    if (target) {
        e.preventDefault();

        let panel, head, label, options, state, content;
        let expanded = false;

        // Ensure Panel wrapper
        while (target) {
            if (target.classList && target.classList.contains('panel')) break;
            else target = target.parentNode;
        }

        // If found start.
        if (target) {
            panel = target;
            head = panel.querySelector('.panel-head');
            label = panel.querySelector('.panel-label');
            options = panel.querySelector('.panel-options');
            state = panel.querySelector('.panel-state');
            content = panel.querySelector('.panel-content');

            if (!state) throw Error("'.panel-state' not found.");
            if (!content) throw Error("'.panel-content' not found.");

            if (panel.hasAttribute('opened')) {
                expanded = !eval(panel.getAttribute('opened'));
            } else expanded = true;

            // Prep Panel
            panel.setAttribute('opened', expanded);
            panel.classList.add(animationClass);
            panel.addEventListener('transitionend', clearAnimationState, false);

            if (expanded) {
                panel.classList.add(expandedClass);
                state.classList.add(rotateClass);
            } else {
                panel.classList.remove(expandedClass);
                state.classList.remove(rotateClass);
            }
        }
    }

    function clearAnimationState(e) {
        target.classList.remove(animationClass);
    }
}
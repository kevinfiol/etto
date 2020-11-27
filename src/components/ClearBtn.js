import Element from '../lib/Element.js';

class ClearBtn extends Element {
    constructor(
        el,
        clickEvt
    ) {
        super(el);

        this.applyClassList(['etto-clear-btn']);
        this.applyAttributes({
            style: 'opacity: 0.7; ' +
                'position: absolute; ' +
                'display: none; ' + 
                'right: 0.8rem; ' +
                'cursor: pointer; ' +
                'font-family: sans-serif; ' +
                'font-size: 20px; ' +
                'font-weight: 400; '
        });

        this.addEventListener('click', clickEvt);

        this.el.innerHTML = '&times;';
    }

    show() {
        this.el.style.display = 'flex';
    }

    hide() {
        this.el.style.display = 'none';
    }
}

export default ClearBtn;
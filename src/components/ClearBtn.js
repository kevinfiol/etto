import Element from '../lib/Element.js';

class ClearBtn extends Element {
    constructor(
        el,
        btnHeight,
        clearBtnTopPosition,
        clickEvt
    ) {
        super(el);

        this.applyClassList(['etto-clear-btn']);
        this.applyAttributes({
            style: 'opacity: 0.7; ' +
                'position: absolute; ' +
                'display: none; ' + 
                'align-items: center; ' +
                'right: 0.6em; ' +
                'cursor: pointer; ' +
                'font-family: sans-serif; ' +
                'font-size: 20px; ' +
                'font-weight: 400; ' +
                `height: ${btnHeight}px; ` +
                `top: ${clearBtnTopPosition}px;`
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
import Element from '../lib/Element';

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
                'display: flex; ' + 
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
}

export default ClearBtn;
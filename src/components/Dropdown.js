import Element from '../lib/Element.js';

class Dropdown extends Element {
    constructor(el, isSelectMode) {
        super(el);

        this.applyClassList(['etto-dropdown']);
        this.applyAttributes({
            style: `${isSelectMode ? 'max-height: 300px; ' : ''}` +
            `${isSelectMode ? 'overflow: hidden auto; ' : 'overflow: hidden; '}` +
            'position: absolute; ' +
            'width: 100%; ' +
            'z-index: 99;'
        });

        // Hide by default
        this.hide();
    }

    isVisible() {
        return this.el.style.display === 'block';
    }

    hide() {
        this.setDisplay('none');
    }

    show() {
        this.setDisplay('block');
    }
}

export default Dropdown;
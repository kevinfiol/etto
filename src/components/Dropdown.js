const Element = require('../lib/Element');

class Dropdown extends Element {
    constructor(el, isSelectMode) {
        super(el);

        this.applyClassList(['etto-dropdown']);
        this.applyAttributes({
            style: `${isSelectMode ? 'max-height: 300px; ' : ''}` +
            `${isSelectMode ? 'overflow: hidden auto; ' : 'overflow: hidden; '}` +
            'position: absolute; ' +
            'width: 100%; ' +
            'background-color: white; ' +
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

module.exports = Dropdown;
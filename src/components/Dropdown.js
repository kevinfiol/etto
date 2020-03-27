import Element from '../lib/Element';

class Dropdown extends Element {
    constructor(el) {
        super(el);

        this.applyClassList(['etto-dropdown']);
        this.applyAttributes({
            style: 'position: absolute; width: 100%; background-color: white; overflow: hidden; z-index: 99;'
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
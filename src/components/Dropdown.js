import Element from '../lib/Element';

class Dropdown extends Element {
    constructor(el, classList, attributes) {
        super(el);

        this.applyClassList(classList);
        this.applyAttributes(attributes);
    }

    hide() {
        this.el.style.display = 'none';
    }

    show() {
        this.el.style.display = 'block';
    }
}
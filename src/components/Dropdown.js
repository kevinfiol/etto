import Element from '../lib/Element';

class Dropdown extends Element {
    constructor(el) {
        super(el);

        this.applyClassList(['etto-dropdown']);
        this.applyAttributes({
            style: 'position: absolute; width: 100%; background-color: white; overflow: hidden; z-index: 99;'
        });

        // Hide by default
        this.setDisplay('none');
    }
}

export default Dropdown;
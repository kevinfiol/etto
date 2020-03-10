import Element from '../lib/Element';

class UnorderedList extends Element {
    constructor(el, createItemFn) {
        super(el);
        this.createItemFn = createItemFn;

        this.applyClassList(['etto-ul']);
    }

    clearList() {
        this.el.innerHTML = '';
    }

    populateList(inputVal, list, selectedIndex) {
        this.clearList();

        for (let i = 0; i < list.length; i++) {
            const isSelected = i === selectedIndex;
            this.appendChild( this.createItemFn(list[i], inputVal, isSelected) );
        }
    }
}

export default UnorderedList;
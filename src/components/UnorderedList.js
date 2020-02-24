import Element from '../lib/Element';

class UnorderedList extends Element {
    constructor(el, classList, renderItemFn) {
        super(el);
        this.renderItem = renderItemFn;

        this.applyClassList(classList);
    }

    clearList() {
        this.el.innerHTML = '';
    }

    appendItem(li) {
        this.el.appendChild(li);
    }

    renderList(inputVal, list, selectedIndex) {
        this.clearList();

        for (let i = 0; i < list.length; i++) {
            const isSelected = i === selectedIndex;
            this.appendItem( this.renderItem(list[i], inputVal, isSelected) );
        }
    }
}

export default UnorderedList;
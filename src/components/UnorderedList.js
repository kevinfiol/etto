import Element from '../lib/Element';
import { createEmText } from '../util';

class UnorderedList extends Element {
    constructor(el, createItemMousedownEvt, createItemFn) {
        super(el);
        this.createItemMousedownEvt = createItemMousedownEvt;

        // Use custom createItemFn or default to this.createListItem
        this.createItemFn = createItemFn || this.createListItem;

        this.applyClassList(['etto-ul']);
    }

    clearList() {
        this.el.innerHTML = '';
    }

    createListItem(choice, inputVal, isSelected) {
        const li = document.createElement('li');
        li.classList.add('etto-li');

        if (isSelected) li.classList.add('etto-selected');
        else li.classList.remove('etto-selected');

        li.setAttribute('style', 'list-style-type: none; cursor: default;');
        li.innerHTML = createEmText(choice.label, inputVal);

        // Set HTML5 data-* attributes
        li.dataset.label = choice.label;
        li.dataset.value = choice.value;

        return li;
    }

    populateList(inputVal, list, selectedIndex) {
        this.clearList();

        for (let i = 0; i < list.length; i++) {
            const choice = list[i];
            const isSelected = i === selectedIndex;

            const li = this.createItemFn(choice, inputVal, isSelected);
            const onMousedownEvt = this.createItemMousedownEvt(choice.label, choice.value);

            li.addEventListener('mousedown', onMousedownEvt);
            this.appendChild(li);
        }
    }
}

export default UnorderedList;
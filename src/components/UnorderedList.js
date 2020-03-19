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

    setInnerHtml(html) {
        this.el.innerHTML = html;
    }

    createListItem(choice, inputVal, isSelected) {
        return `<li class="${ isSelected ? 'etto-selected ' : '' }etto-li"` +
                ' style="list-style-type: none; cursor: default"' +
                ` data-label="${choice.label}"` +
                ` data-value="${choice.value}"` +
            '>' +
                createEmText(choice.label, inputVal) +
            '</li>'
        ;
    }

    populateList(inputVal, list, selectedIndex) {
        this.setInnerHtml('');
        let html = '';

        // Build HTML
        for (let i = 0; i < list.length; i++) {
            const choice = list[i];
            const isSelected = i === selectedIndex;
            html += this.createItemFn(choice, inputVal, isSelected);
        }

        this.setInnerHtml(html);

        // Dynamically creates and adds event listeners to list items
        // Requires HTML5 data attributes
        for (let i = 0; i < this.el.children.length; i++) {
            const li = this.el.children[i];
            const choiceLabel = li.dataset.label;
            const choiceValue = li.dataset.value;
            const onMousedownEvt = this.createItemMousedownEvt(choiceLabel, choiceValue);
            li.addEventListener('mousedown', onMousedownEvt);
        }
    }
}

export default UnorderedList;
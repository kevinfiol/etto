import Element from '../lib/Element.js';
import { createEmText } from '../util.js';

class UnorderedList extends Element {
    constructor(el, itemMouseDownEvt, createItemFn, customEmptyHtml) {
        super(el);
        this.itemMouseDownEvt = itemMouseDownEvt;

        // Use custom createItemFn or default to this.createListItem
        this.createItemFn = createItemFn || this.createListItem;

        // Use custom emptyMsg
        this.emptyHtml = customEmptyHtml || '<em>No results.</em>';

        this.applyClassList(['etto-ul']);
    }

    setInnerHtml(html) {
        this.el.innerHTML = html;
    }

    createListItem(choice, index, inputVal, isHighlighted, isSelected) {
        let liClass = 'etto-li';
        if (isHighlighted) liClass += ' etto-highlighted';
        if (isSelected) liClass += ' etto-selected';

        return `<li class="${liClass}"` +
                ' style="list-style-type: none; cursor: default"' +
                ` data-label="${choice.label}"` +
                ` data-value="${choice.value}"` +
                ` data-index="${index}"` +
            '>' +
                createEmText(choice.label, inputVal) +
            '</li>'
        ;
    }

    populateList(inputVal, list, highlightedIndex, selected) {
        this.setInnerHtml('');
        let html = '';

        const listLen = list.length;
        if (listLen > 0) {
            // Build HTML
            for (let i = 0; i < listLen; i++) {
                const isSelected = selected ? (list[i].value === selected.value) : false;
                const isHighlighted = i === highlightedIndex;
                html += this.createItemFn(list[i], i, inputVal, isHighlighted, isSelected);
            }

            this.setInnerHtml(html);
            this.removeEventListener('mousedown'); // remove old event listener if exists
            this.addEventListener('mousedown', ev => {
                this.itemMouseDownEvt(list[ev.target.dataset.index]);
            });
        } else {
            html += '<li class="etto-li etto-empty">' + this.emptyHtml + '</li>';
            this.setInnerHtml(html);
        }
    }
}

export default UnorderedList;
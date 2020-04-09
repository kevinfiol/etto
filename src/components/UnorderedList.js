const Element = require('../lib/Element');
const { createEmText } = require('../util');

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

    createListItem(choice, inputVal, isHighlighted, isSelected) {
        let liClass = 'etto-li';
        if (isHighlighted) liClass += ' etto-highlighted';
        if (isSelected) liClass += ' etto-selected';

        return `<li class="${liClass}"` +
                ' style="list-style-type: none; cursor: default"' +
                ` data-label="${choice.label}"` +
                ` data-value="${choice.value}"` +
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
                html += this.createItemFn(list[i], inputVal, isHighlighted, isSelected);
            }

            this.setInnerHtml(html);

            // Iterate on newly creates list items
            for (let i = 0; i < listLen; i++) {
                const li = this.el.children[i];
                li.addEventListener('mousedown', this.createItemMousedownEvt(list[i]));
            }
        } else {
            html += '<li class="etto-li etto-empty"><em>No results.</em></li>';
            this.setInnerHtml(html);
        }
    }
}

module.exports = UnorderedList;
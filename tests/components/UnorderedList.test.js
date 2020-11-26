import { suite } from 'uvu';
import { equal } from 'uvu/assert';
import { dom } from '../dom.js';
import UnorderedList from '../../src/components/UnorderedList.js';

const t = suite('UnorderedList Component');

let ul;
let temp;

t.before(() => {
    ul = new UnorderedList(document.createElement('ul'),
        () => choice => temp = choice,
        undefined
    );
})

t.before.each(() => {
    ul.setInnerHtml('');
});

t('UnorderedList setInnerHtml', () => {
    ul.setInnerHtml('<li>one</li><li>two</li>');
    equal(ul.el.children.length, 2);
    equal(ul.el.children[0].tagName, 'LI');
    equal(ul.el.children[1].tagName, 'LI');
    equal(ul.el.children[0].innerHTML, 'one');
    equal(ul.el.children[1].innerHTML, 'two');
});

t('UnorderedList createListItem', () => {
    let inputVal = 'ba';

    let highlighted = ul.createListItem(
        { label: 'banana', value: 'banana' },
        inputVal,
        true,
        false
    );

    ul.setInnerHtml(highlighted);
    let li = ul.el.children[0];
    let bTag = li.children[0];

    equal(li.classList.contains('etto-li'), true);
    equal(li.classList.contains('etto-highlighted'), true);
    equal(li.classList.contains('etto-selected'), false);
    equal(bTag !== undefined, true);
    equal(li.innerHTML, '<b>ba</b>nana');

    ul.setInnerHtml('');

    let selected = ul.createListItem(
        { label: 'noodle', value: 'noodle' },
        inputVal,
        false,
        true
    );

    ul.setInnerHtml(selected);
    li = ul.el.children[0];
    bTag = li.children[0];

    equal(li.classList.contains('etto-li'), true);
    equal(li.classList.contains('etto-selected'), true);
    equal(li.classList.contains('etto-highlighted'), false);
    equal(bTag === undefined, true);
    equal(li.innerHTML, 'noodle');
});

t('UnorderedList populateList', () => {
    const list = [
        { label: 'banana', value: 'banana' },
        { label: 'apple', value: 'apple' },
        { label: 'cherry', value: 'cherry' }
    ];

    ul.populateList('ba', list, 0, undefined);
    equal(ul.el.children.length, 3);
    equal(ul.el.children[0].innerHTML, '<b>ba</b>nana');
    equal(ul.el.children[1].innerHTML, 'apple');
    equal(ul.el.children[2].innerHTML, 'cherry');

    ul.populateList('ba', [], 0, undefined);
    equal(ul.el.children.length, 1);
    equal(ul.el.children[0].classList.contains('etto-empty'), true);
});

t.run();
import o from 'ospec/ospec';
import { dom } from '../dom';
import UnorderedList from '../../src/components/UnorderedList';

o.spec('UnorderedList Component', () => {
    let ul;
    let temp;

    o.before(() => {
        ul = new UnorderedList(document.createElement('ul'),
            () => choice => temp = choice,
            undefined
        );
    })

    o.beforeEach(() => {
        ul.setInnerHtml('');
    });

    o('UnorderedList setInnerHtml', () => {
        ul.setInnerHtml('<li>one</li><li>two</li>');
        o(ul.el.children.length).equals(2);
        o(ul.el.children[0].tagName).equals('LI');
        o(ul.el.children[1].tagName).equals('LI');
        o(ul.el.children[0].innerHTML).equals('one');
        o(ul.el.children[1].innerHTML).equals('two');
    });

    o('UnorderedList createListItem', () => {
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

        o(li.classList.contains('etto-li')).equals(true);
        o(li.classList.contains('etto-highlighted')).equals(true);
        o(li.classList.contains('etto-selected')).equals(false);
        o(bTag !== undefined).equals(true);
        o(li.innerHTML).equals('<b>ba</b>nana');

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

        o(li.classList.contains('etto-li')).equals(true);
        o(li.classList.contains('etto-selected')).equals(true);
        o(li.classList.contains('etto-highlighted')).equals(false);
        o(bTag === undefined).equals(true);
        o(li.innerHTML).equals('noodle');
    });

    o('UnorderedList populateList', () => {
        const list = [
            { label: 'banana', value: 'banana' },
            { label: 'apple', value: 'apple' },
            { label: 'cherry', value: 'cherry' }
        ];

        ul.populateList('ba', list, 0, undefined);
        o(ul.el.children.length).equals(3);
        o(ul.el.children[0].innerHTML).equals('<b>ba</b>nana');
        o(ul.el.children[1].innerHTML).equals('apple');
        o(ul.el.children[2].innerHTML).equals('cherry');

        ul.populateList('ba', [], 0, undefined);
        o(ul.el.children.length).equals(1);
        o(ul.el.children[0].classList.contains('etto-empty')).equals(true);
    });
});
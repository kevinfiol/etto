import { suite } from 'uvu';
import { equal } from 'uvu/assert';
import { dom, evt } from '../dom.js';
import Element from '../../src/lib/Element.js';

const t = suite('Element Object');

let li;
let element;
let domEl;

t.before(() => {
    domEl = document.createElement('li');
    li = new Element(domEl);
});

t('Element constructor', () => {
    equal(li.el, domEl);
});

t('Element addEventListener', () => {
    let val = 0;
    li.addEventListener('click', () => val = 1);
    evt('click', li.el);
    equal(val, 1);
});

t('Element applyAttributes', () => {
    li.applyAttributes({
        name: 'kevin',
        style: 'color: red;',
        foo: 15 // dom turns this to string
    });

    const attrs = li.el.attributes;

    equal(attrs.name.value, 'kevin');
    equal(attrs.style.value, 'color: red;');
    equal(attrs.foo.value, '15');
    equal(li.el.style.color, 'red');
});

t('Element appendChild', () => {
    const em = document.createElement('em');
    em.innerHTML = 'words';

    equal(li.el.children.length, 0);
    equal(li.el.children[0], undefined);

    li.appendChild(em);
    equal(li.el.children.length, 1);
    equal(li.el.children[0], em);
});

t('Element setDisplay', () => {
    li.setDisplay('none');
    equal(li.el.style.display, 'none');
});

t.run();
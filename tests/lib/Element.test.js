import o from 'ospec/ospec';
import { dom, evt } from '../dom';
import Element from '../../src/lib/Element';

o.spec('Element Object', () => {
    let li;
    let element;
    let domEl;

    o.before(() => {
        domEl = document.createElement('li');
        li = new Element(domEl);
    });

    o('Element constructor', () => {
        o(li.el).equals(domEl);
    });

    o('Element addEventListener', () => {
        let val = 0;
        li.addEventListener('click', () => val = 1);
        evt('click', li.el);
        o(val).equals(1);
    });

    o('Element applyAttributes', () => {
        li.applyAttributes({
            name: 'kevin',
            style: 'color: red;',
            foo: 15 // dom turns this to string
        });

        const attrs = li.el.attributes;

        o(attrs.name.value).equals('kevin');
        o(attrs.style.value).equals('color: red;');
        o(attrs.foo.value).equals('15');
        o(li.el.style.color).equals('red');
    });

    o('Element appendChild', () => {
        const em = document.createElement('em');
        em.innerHTML = 'words';

        o(li.el.children.length).equals(0);
        o(li.el.children[0]).equals(undefined);

        li.appendChild(em);
        o(li.el.children.length).equals(1);
        o(li.el.children[0]).equals(em);
    });

    o('Element setDisplay', () => {
        li.setDisplay('none');
        o(li.el.style.display).equals('none');
    });
});
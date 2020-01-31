import o from 'ospec/ospec';
import dom from '../dom';

import Element from '../../src/lib/Element';

o.spec('Element Object', () => {
    let li;
    
    o.beforeEach(() => {
        li = Object.create(Element);
        li.init('li', 'testClassName');
    });

    o('Element init', () => {
        o(li.el.tagName).equals('LI');
        o(li.el.className).equals('testClassName');
    });

    o('Element classNames', () => {
        li.setClassName('lorem ipsum');
        o(li.el.className).equals('lorem ipsum');

        li.addClass('kevin');
        o(li.el.className.indexOf('kevin') > -1).equals(true);

        li.removeClass('kevin');
        o(li.containsClass('kevin')).equals(false);

        li.toggleClass('ipsum');
        o(li.containsClass('ipsum')).equals(false);
    });

    o('Element addEventListener', () => {
        let val = 0;
        li.addEventListener('click', () => val = 1);

        // Create event
        let ev = document.createEvent('HTMLEvents');
        ev.initEvent('click', false, true);
        li.el.dispatchEvent(ev);

        o(val).equals(1);
    });

    o('Element setAttr', () => {
        li.setAttr('id', 'row-1');
        o(li.el.getAttribute('id')).equals('row-1');
    });
});
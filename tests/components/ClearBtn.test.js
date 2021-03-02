import { suite } from 'uvu';
import { equal } from 'uvu/assert';
import { dom, evt } from '../dom.js';
import ClearBtn from '../../src/components/ClearBtn.js';

const t = suite('ClearBtn Component');

let clearBtn;
let domEl;
let val = 0;

t.before(() => {
    domEl = document.createElement('div');
    clearBtn = new ClearBtn(domEl, () => {
        val = 1;
    });
});

t('ClearBtn event', () => {
    evt('click', clearBtn.el);
    equal(val, 1);
});

t('ClearBtn show', () => {
    equal(clearBtn.el.style.display, 'none');
    clearBtn.show();
    equal(clearBtn.el.style.display, 'flex');
});

t('ClearBtn hide', () => {
    clearBtn.hide();
    equal(clearBtn.el.style.display, 'none');
});

t.run();
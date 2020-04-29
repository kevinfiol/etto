import o from 'ospec/ospec';
import { dom, evt } from '../dom';
import ClearBtn from '../../src/components/ClearBtn';

o.spec('ClearBtn Component', () => {
    let clearBtn;
    let domEl;
    let val = 0;

    o.before(() => {
        domEl = document.createElement('div');
        clearBtn = new ClearBtn(domEl, 22, 100, () => {
            val = 1;
        });
    });

    o('ClearBtn event', () => {
        evt('click', clearBtn.el);
        o(val).equals(1);
    });

    o('ClearBtn show', () => {
        o(clearBtn.el.style.display).equals('none');
        clearBtn.show();
        o(clearBtn.el.style.display).equals('flex');
    });

    o('ClearBtn hide', () => {
        clearBtn.hide();
        o(clearBtn.el.style.display).equals('none');
    });
});
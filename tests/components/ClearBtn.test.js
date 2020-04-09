const o = require('ospec');
const dom = require('../dom');
const ClearBtn = require('../../src/components/ClearBtn');

o.spec('ClearBtn Component', () => {
    let clearBtn;
    let domEl;

    o.before(() => {
        domEl = document.createElement('div');
        clearBtn = new ClearBtn(domEl, 22, 100, );
    });
});
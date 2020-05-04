const o = require('ospec');
const { dom } = require('../dom');
const Input = require('../../src/components/Input');

o.spec('Input Component', () => {
    let input;

    focusVal = 0;
    blurVal = 0;

    o.before(() => {
        input = new Input(document.createElement('input'),
            undefined,
            () => focusVal = 1,
            () => blurVal = 1,
            undefined
        );
    });

    o('Input setValue', () => {
        input.setValue('bar');
        o(input.el.value).equals('bar');
    });

    o('Input setPlaceholder', () => {
        input.setPlaceholder('temp');
        o(input.el.placeholder).equals('temp');
    });

    o('Input focus', () => {
        input.focus();
        o(focusVal).equals(1);
    });

    o('Input blur', () => {
        input.blur();
        o(blurVal).equals(1);
    });
});
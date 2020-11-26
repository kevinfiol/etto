import { suite } from 'uvu';
import { equal } from 'uvu/assert';
import { dom } from '../dom.js';
import Input from '../../src/components/Input.js';

const t = suite('Input Component');

let input;
let focusVal = 0;
let blurVal = 0;

t.before(() => {
    input = new Input(document.createElement('input'),
        undefined,
        () => focusVal = 1,
        () => blurVal = 1,
        undefined
    );
});

t('Input setValue', () => {
    input.setValue('bar');
    equal(input.el.value, 'bar');
});

t('Input setPlaceholder', () => {
    input.setPlaceholder('temp');
    equal(input.el.placeholder, 'temp');
});

t('Input focus', () => {
    input.focus();
    equal(focusVal, 1);
});

t('Input blur', () => {
    input.blur();
    equal(blurVal, 1);
});

t.run();
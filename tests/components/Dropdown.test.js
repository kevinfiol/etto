import { suite } from 'uvu';
import { equal } from 'uvu/assert';
import { dom } from '../dom.js';
import Dropdown from '../../src/components/Dropdown.js';

const t = suite('Dropdown Component');

let dropdown;

t.before(() => {
    dropdown = new Dropdown(document.createElement('div'), true);
});

t('Dropdown selectMode', () => {
    equal(dropdown.el.style.overflow, 'hidden auto');
});

t('Dropdown show', () => {
    equal(dropdown.el.style.display, 'none');
    dropdown.show();
    equal(dropdown.el.style.display, 'block');
});

t('Dropdown hide', () => {
    dropdown.hide();
    equal(dropdown.el.style.display, 'none');
});

t('Dropdown isVisible', () => {
    equal(dropdown.isVisible(), false);
    dropdown.show();
    equal(dropdown.isVisible(), true);
});

t.run();
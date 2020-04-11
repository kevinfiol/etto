const o = require('ospec');
const dom = require('../dom');
const Dropdown = require('../../src/components/Dropdown');

o.spec('Dropdown Component', () => {
    let dropdown;

    o('Dropdown selectMode', () => {
        dropdown = new Dropdown(document.createElement('div'), true);
        o(dropdown.el.style.overflow).equals('hidden auto');
    });

    o('Dropdown show', () => {
        o(dropdown.el.style.display).equals('none');
        dropdown.show();
        o(dropdown.el.style.display).equals('block');
    });

    o('Dropdown hide', () => {
        dropdown.hide();
        o(dropdown.el.style.display).equals('none');
    });

    o('Dropdown isVisible', () => {
        o(dropdown.isVisible()).equals(false);
        dropdown.show();
        o(dropdown.isVisible()).equals(true);
    });
});
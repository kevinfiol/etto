const o = require('ospec');
const { dom, keydownEvt } = require('./dom.js');
const InputService = require('../src/InputService');
const { list_1 } = require('../example_choices');

o.spec('InputService service', () => {
    let service;
    let root;
    let choices;

    o.before(() => {
        choices = [ ...list_1 ];
    });

    o('InputService constructor', () => {
        root = document.createElement('div');
        service = new InputService(root, {}, choices);
    })

    o('InputService onInput', () => {
        service.onInput({ target: { value: 'eart' } });

        o(service.state.inputVal).equals('eart');
        o(service.ClearBtn.el.style.display).notEquals('none');

        // minChars is set to 3 by default
        o(service.state.filtered).deepEquals([{ label: 'Ness from Earthbound', value: 'Ness from Earthbound' }]);
        o(service.Dropdown.isVisible()).equals(true);

        // no match
        service.onInput({ target: { value: 'text that does not have a match' } });
        o(service.state.filtered).deepEquals([]);
        o(service.Dropdown.isVisible()).equals(true);
    });

    o('InputService onFocus', () => {
        service.onFocus();
        o(service.Dropdown.isVisible()).equals(false);
    });

    o('InputService Keyboard Input', () => {
        // make dropdown visible first
        service.setShowDropdown(true);

        keydownEvt(40, service.Input.el);
        o(service.state.highlighted).notEquals(null);
    });
});
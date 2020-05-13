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

    o('InputService onBlur', () => {
        service.actions.setHighlighted(0);
        service.setShowDropdown(true);
        o(service.Dropdown.isVisible()).equals(true);

        service.onBlur();
        o(service.state.highlighted).equals(null);
        o(service.Dropdown.isVisible()).equals(false);
    });

    o('InputService onSelection', () => {
        service.actions.setHighlighted(0);
        service.setShowDropdown(true);
        service.onSelection({ label: 'min', value: 'min' });

        o(service.state.inputVal).equals('min');
        o(service.state.filtered).deepEquals([
            { label: 'Minnesota', value: 'Minnesota' },
            { label: 'Wyoming', value: 'Wyoming' }
        ]);
        o(service.state.highlighted).equals(null);
        o(service.Dropdown.isVisible()).equals(false);
    });

    o('InputService Keyboard Input', () => {
        // make dropdown visible first
        service.setShowDropdown(true);

        const keyUp = () => keydownEvt(38, service.Input.el);
        const keyDown = () => keydownEvt(40, service.Input.el);
        const enterKey = () => keydownEvt(13, service.Input.el);

        keyDown();
        o(service.state.highlighted).notEquals(null);
        o(service.state.highlighted).equals(0);

        // change input val
        service.onInput({ target: { value: 'min' } });
        // should match 'Minnesota' and 'Wyoming'
        o(service.state.filtered.length).equals(2);

        keyDown();
        o(service.state.highlighted).equals(1);
        keyDown();
        o(service.state.highlighted).equals(1);

        // enter key
        enterKey();
        o(service.state.highlighted).equals(null);
        o(service.state.inputVal).equals('Wyoming');

        // need to refocus
        service.Input.focus();
        service.onFocus();
        o(service.state.highlighted).equals(null);

        // go down one
        keyDown();
        o(service.state.highlighted).equals(0);

        // go back up
        keyUp();
        o(service.state.highlighted).equals(0);
        // cant go anymore up
        keyUp();
        o(service.state.highlighted).equals(0);

        // blur the input
        service.onBlur();
        o(service.state.highlighted).equals(null);
    });

    o('InputService createItemMousedownEvt', () => {
        service.Input.blur();
        service.Input.setValue('');

        o(document.activeElement !== service.Input.el).equals(true);

        let evt = service.createItemMousedownEvt({ label: 'Wyoming', value: 'Wyoming' });
        evt();

        o(document.activeElement == service.Input.el).equals(true);
    });
});
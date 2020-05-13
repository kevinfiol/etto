const o = require('ospec');
const { dom, evt, keydownEvt } = require('./dom.js');
const SelectService = require('../src/SelectService');
const { list_1 } = require('../example_choices');

o.spec('SelectService service', () => {
    let service;
    let root;
    let choices;

    o.before(() => {
        choices = [ ...list_1 ];
    });

    o('SelectService constructor', () => {
        root = document.createElement('div');
        service = new SelectService(root, {}, choices);
    });

    o('SelectService onFocus', () => {
        service.Input.focus();

        o(service.Dropdown.isVisible()).equals(true);
        o(service.state.filtered.length).equals(choices.length);
    });

    o('SelectService onInput', () => {
        let value = 'eart';
        service.Input.setValue(value);
        service.onInput({ target: { value } });

        o(service.Input.value).equals('eart');
        o(service.ClearBtn.el.style.display).notEquals('none');

        o(service.state.filtered).deepEquals([{ label: 'Ness from Earthbound', value: 'Ness from Earthbound' }]);
        o(service.Dropdown.isVisible()).equals(true);

        value = 'al';
        service.Input.setValue(value);
        service.onInput({ target: { value } });
        o(service.state.filtered.length).equals(2); // should have alabama and alaska

        // no match
        value = 'text that does not have a match'
        service.Input.setValue(value);
        service.onInput({ target: { value } });
        o(service.state.filtered).deepEquals([]);
        o(service.Dropdown.isVisible()).equals(true);
    });

    o('SelectService onBlur', () => {
        // After inputting, but not selecting, the input should be emptied
        service.Input.blur();

        o(service.Input.value).equals('');
        o(service.state.filtered).equals(service.state.choices);

        // check dropdown is hidden
        o(service.Dropdown.isVisible()).equals(false);
    });

    o('SelectService onSelection', () => {
        // using the select service, the state.selected var can only be
        // changed when the user clicks or selects something from the dropdown
        // we can simulate onSelection by simulating a click
        service.Input.focus()

        // mousedown the first element, this triggers onSelection
        // this also tests SelectService.createItemMousedownEvt
        const li = service.UnorderedList.el.children[0];
        evt('mousedown', li);

        o(service.Dropdown.isVisible()).equals(false);
        o(service.Input.value).equals('Alabama');
        o(document.activeElement !== service.Input.el).equals(true);
        o(service.ClearBtn.el.style.display).notEquals('none');
        o(service.state.selected).deepEquals({ label: 'Alabama', value: 'Alabama' });
    });

    o('SelectService Keyboard Input', () => {
        const keyUp = () => keydownEvt(38, service.Input.el);
        const keyDown = () => keydownEvt(40, service.Input.el);
        const enterKey = () => keydownEvt(13, service.Input.el);

        service.Input.blur();
        service.clear();

        o(service.Input.value).equals('');
        o(service.state.selected).equals(null);

        // focus
        service.Input.focus();
        o(service.Dropdown.isVisible()).equals(true);

        keyDown();
        keyDown();
        keyDown();

        // should be on Michigan now
        enterKey();
        o(service.Dropdown.isVisible()).equals(false);
        o(service.Input.value).equals('Michigan');
    });
});
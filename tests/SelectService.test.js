import { suite } from 'uvu';
import { equal, not } from 'uvu/assert';
import { dom, evt, keydownEvt } from './dom.js';
import SelectService from '../src/SelectService.js';
import { list_1 } from '../example_choices.js';

const t = suite('SelectService service');

let service;
let root;
let choices;

t.before(() => {
    choices = [ ...list_1 ];
});

t('SelectService constructor', () => {
    root = document.createElement('div');
    service = new SelectService(root, {}, choices);
});

t('SelectService onFocus', () => {
    service.Input.focus();

    equal(document.activeElement == service.Input.el, true);
    equal(service.Dropdown.isVisible(), true);
    equal(service.state.filtered.length, choices.length);
});

t('SelectService onInput', () => {
    let value = 'eart';
    service.Input.setValue(value);
    service.onInput({ target: { value } });

    equal(service.Input.value, 'eart');
    not.equal(service.ClearBtn.el.style.display, 'none');

    equal(service.state.filtered, [{ label: 'Ness from Earthbound', value: 'Ness from Earthbound' }]);
    equal(service.Dropdown.isVisible(), true);

    value = 'al';
    service.Input.setValue(value);
    service.onInput({ target: { value } });
    equal(service.state.filtered.length, 2); // should have alabama and alaska

    // no match
    value = 'text that does not have a match'
    service.Input.setValue(value);
    service.onInput({ target: { value } });
    equal(service.state.filtered, []);
    equal(service.Dropdown.isVisible(), true);
});

t('SelectService onBlur', () => {
    // After inputting, but not selecting, the input should be emptied
    service.Input.blur();

    equal(service.Input.value, '');
    equal(service.state.filtered, service.state.choices);

    // check dropdown is hidden
    equal(service.Dropdown.isVisible(), false);
});

t('SelectService onSelection', () => {
    // using the select service, the state.selected var can only be
    // changed when the user clicks or selects something from the dropdown
    // we can simulate onSelection by simulating a click
    service.Input.focus()

    // mousedown the first element, this triggers onSelection
    // this also tests SelectService.createItemMousedownEvt
    const li = service.UnorderedList.el.children[0];
    evt('mousedown', li);

    equal(service.Dropdown.isVisible(), false);
    equal(service.Input.value, 'Alabama');
    equal(document.activeElement !== service.Input.el, true);
    not.equal(service.ClearBtn.el.style.display, 'none');
    equal(service.state.selected, { label: 'Alabama', value: 'Alabama' });
});

t('SelectService Keyboard Input', () => {
    const keyUp = () => keydownEvt(38, service.Input.el);
    const keyDown = () => keydownEvt(40, service.Input.el);
    const enterKey = () => keydownEvt(13, service.Input.el);

    service.Input.blur();
    service.clear();

    equal(service.Input.value, '');
    equal(service.state.selected, null);

    // focus
    service.Input.focus();
    equal(service.Dropdown.isVisible(), true);

    keyDown();
    keyDown();
    keyDown();

    // should be on Michigan now
    enterKey();
    equal(service.Dropdown.isVisible(), false);
    equal(service.Input.value, 'Michigan');
});

t.run();
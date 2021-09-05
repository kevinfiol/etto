import { suite } from 'uvu';
import { equal, not } from 'uvu/assert';
import { dom, keydownEvt } from './dom.js';
import InputService from '../src/InputService.js';
import { list_1 } from './example_choices.js';

const t = suite('InputService service');

let service;
let root;
let choices;

t.before(() => {
    choices = [ ...list_1 ];
});

t('InputService constructor', () => {
    root = document.createElement('div');
    service = new InputService(root, {}, choices);
})

t('InputService onInput', () => {
    // Must fill Input.value to simulate input
    let value = 'eart';
    service.Input.setValue(value);
    service.onInput({ target: { value } });

    not.equal(service.ClearBtn.el.style.display, 'none');

    // minChars is set to 3 by default
    equal(service.state.filtered, [{ label: 'Ness from Earthbound', value: 'Ness from Earthbound' }]);
    equal(service.Dropdown.isVisible(), true);

    // no match
    value = 'text that does not have a match';
    service.Input.setValue(value);
    service.onInput({ target: { value } });
    equal(service.state.filtered, []);
    equal(service.Dropdown.isVisible(), true);
});

t('InputService onFocus', () => {
    service.onFocus();
    equal(service.Dropdown.isVisible(), false);
});

t('InputService onBlur', () => {
    service.actions.setHighlighted(0);
    service.setShowDropdown(true);
    equal(service.Dropdown.isVisible(), true);

    service.onBlur();
    equal(service.state.highlighted, null);
    equal(service.Dropdown.isVisible(), false);
});

t('InputService onSelection', () => {
    service.actions.setHighlighted(0);
    service.setShowDropdown(true);
    service.onSelection({ label: 'min', value: 'min' });

    equal(service.Input.value, 'min');
    equal(service.state.filtered, [
        { label: 'Minnesota', value: 'Minnesota' },
        { label: 'Wyoming', value: 'Wyoming' }
    ]);
    equal(service.state.highlighted, null);
    equal(service.Dropdown.isVisible(), false);
});

t('InputService Keyboard Input', () => {
    // make dropdown visible first
    service.setShowDropdown(true);

    const keyUp = () => keydownEvt(38, service.Input.el);
    const keyDown = () => keydownEvt(40, service.Input.el);
    const enterKey = () => keydownEvt(13, service.Input.el);

    keyDown();
    not.equal(service.state.highlighted, null);
    equal(service.state.highlighted, 0);

    // change input val
    service.onInput({ target: { value: 'min' } });
    // should match 'Minnesota' and 'Wyoming'
    equal(service.state.filtered.length, 2);

    keyDown();
    equal(service.state.highlighted, 1);
    keyDown();
    equal(service.state.highlighted, 1);

    // enter key
    enterKey();
    equal(service.state.highlighted, null);
    equal(service.Input.value, 'Wyoming');

    // need to refocus
    service.Input.focus();
    service.onFocus();
    equal(service.state.highlighted, null);

    // go down one
    keyDown();
    equal(service.state.highlighted, 0);

    // go back up
    keyUp();
    equal(service.state.highlighted, 0);
    // cant go anymore up
    keyUp();
    equal(service.state.highlighted, 0);

    // blur the input
    service.onBlur();
    equal(service.state.highlighted, null);
});

t('InputService itemMouseDownEvt', () => {
    service.Input.blur();
    service.Input.setValue('');

    equal(document.activeElement !== service.Input.el, true);

    service.itemMouseDownEvt({ label: 'Wyoming', value: 'Wyoming' })
    service.Input.focus();

    equal(document.activeElement === service.Input.el, true);
});

t.run();
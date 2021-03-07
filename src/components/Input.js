import Element from '../lib/Element.js';

class Input extends Element {
    constructor(
        el,
        onInput,
        onFocus,
        onBlur,
        onKeydown,
        onValue,
        isSelectMode,
        classList,
        placeholder
    ) {
        super(el);

        this.applyClassList(['etto-input', ...(classList || [])]);
        this.applyAttributes({
            autocomplete: 'off',
            value: '',
            style: `box-sizing: border-box; cursor: ${isSelectMode ? 'default' : 'text'};`,
            tabIndex: isSelectMode ? '-1' : '0',
            placeholder: placeholder
        });

        this.onValue = onValue;
        this.addEventListener('input', onInput);
        this.addEventListener('focus', onFocus);
        this.addEventListener('blur', onBlur);
        this.addEventListener('keydown', onKeydown);
    }

    get offsetHeight() {
        return this.el.offsetHeight;
    }

    get value() {
        return this.el.value;
    }

    setValue(value) {
        this.el.value = value;
        if (this.onValue) this.onValue(value); // custom callback
    }

    setPlaceholder(placeholder) {
        this.el.placeholder = placeholder;
    }

    focus() {
        this.el.focus();
    }

    blur() {
        this.el.blur();
    }

    setCursorToEnd() {
        this.el.selectionStart = this.el.selectionEnd = this.el.value.length;
    }
}

export default Input;
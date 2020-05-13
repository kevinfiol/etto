const Element = require('../lib/Element');

class Input extends Element {
    constructor(
        el,
        onInput,
        onFocus,
        onBlur,
        onKeydown,
        isSelectMode
    ) {
        super(el);

        this.applyClassList(['etto-input']);
        this.applyAttributes({
            autocomplete: 'off',
            value: '',
            style: `box-sizing: border-box; cursor: ${isSelectMode ? 'default' : 'text'};`,
            tabIndex: isSelectMode ? '-1' : '0'
        });

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
}

module.exports = Input;
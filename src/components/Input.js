import Element from '../lib/Element';

class Input extends Element {
    constructor(
        el,
        onInput,
        onFocus,
        onBlur,
        onKeydown
    ) {
        super(el);

        this.applyClassList(['etto-input']);
        this.applyAttributes({
            autocomplete: 'off',
            value: '',
            style: 'box-sizing: border-box;'
        });

        this.addEventListener('input', onInput);
        this.addEventListener('focus', onFocus);
        this.addEventListener('blur', onBlur);
        this.addEventListener('keydown', onKeydown);
    }

    get offsetHeight() {
        return this.el.offsetHeight;
    }

    setValue(value) {
        this.el.value = value;
    }

    focus() {
        this.el.focus();
    }
}

export default Input;
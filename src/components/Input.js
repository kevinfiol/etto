import Element from '../lib/Element';

class Input extends Element {
    constructor(
        el,
        classList,
        attributes,
        onInput,
        onFocus,
        onBlur,
        onKeydown
    ) {
        super(el);

        this.applyClassList(classList);
        this.applyAttributes(attributes);

        this.addEventListener('input', onInput);
        this.addEventListener('focus', onFocus);
        this.addEventListener('blur', onBlur);
        this.addEventListener('keydown', onKeydown);
    }

    setValue(value) {
        this.el.value = value;
    }
}

export default Input;
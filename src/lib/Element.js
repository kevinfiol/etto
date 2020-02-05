class Element {
    constructor(el, className) {
        if (typeof(el) === 'string') {
            this.el = document.createElement(el);
        } else {
            this.el = el;
        }

        if (className) this.el.className = className;
    }

    assignEl(el) {
        if (this.el) delete this.el;
        this.el = el;
    }

    setClassName(className) {
        this.el.className = className;
    }

    addClass(className) {
        this.el.classList.add(className);
    }

    removeClass(className) {
        this.el.classList.remove(className);
    }

    toggleClass(className) {
        this.el.classList.toggle(className);
    }

    containsClass(className) {
        return this.el.classList.contains(className);
    }

    addEventListener(event, callback, options) {
        this.el.addEventListener(event, callback, options);
    }

    setAttr(name, value) {
        this.el.setAttribute(name, value);
    }
}

export default Element;
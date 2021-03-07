class Element {
    constructor(el) {
        this.el = el;
        this.listeners = {};
    }

    addEventListener(event, callback) {
        if (!(event in this.listeners)) {
            this.listeners[event] = callback;
            this.el.addEventListener(event, callback);
        } else {
            console.warn('Cannot add multiple event listeners to Etto Element');
        }
    }

    removeEventListener(event) {
        if (event in this.listeners) {
            this.el.removeEventListener(event, this.listeners[event], false);
            delete this.listeners[event];
        }
    }

    removeAllEvents() {
        for (const event in this.listeners) {
            this.removeEventListener(event);
        }
    }

    applyClassList(classList) {
        this.el.classList.add(...classList);
    }

    applyAttributes(attributes) {
        for (let key in attributes) {
            this.el.setAttribute(key, attributes[key]);
        }
    }

    appendChild(child) {
        this.el.appendChild(child);
    }

    setDisplay(display) {
        this.el.style.display = display;
    }
}

export default Element;
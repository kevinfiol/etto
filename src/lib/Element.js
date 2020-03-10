class Element {
    constructor(el) {
        this.el = el;
    }

    addEventListener(event, callback) {
        this.el.addEventListener(event, callback);
    }

    applyClassList(classList) {
        for (let i = 0; i < classList; i++) {
            this.el.classList.add(classList[i]);
        }
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
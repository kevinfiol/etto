class Element {
    constructor(dom, className) {
        if (typeof(dom) === 'string') {
            this.dom = document.createElement(dom);
        } else {
            this.dom = dom;
        }

        if (className) this.dom.className = className;
        this.children = [];
    }

    assignEl(dom) {
        if (this.dom) delete this.dom;
        this.dom = dom;
    }

    setClassName(className) {
        this.dom.className = className;
    }

    addClass(className) {
        this.dom.classList.add(className);
    }

    removeClass(className) {
        this.dom.classList.remove(className);
    }

    toggleClass(className) {
        this.dom.classList.toggle(className);
    }

    containsClass(className) {
        return this.dom.classList.contains(className);
    }

    addEventListener(event, callback, options) {
        this.dom.addEventListener(event, callback, options);
    }

    setAttrs(attrs) {
        for (let key in attrs) {
            this.dom.setAttribute(key, attrs[key]);
        }
    }

    appendChild(element) {
        this.dom.appendChild(element.dom);
        this.children.push(element);
    }

    setInnerHtml(html) {
        this.dom.innerHTML = html;
    }
}

export default Element;
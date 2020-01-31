const Element = {
    el: null,

    init: function(tag, className) {
        this.el = document.createElement(tag);
        if (className) this.el.className = className;
    },

    setClassName: function(className) {
        this.el.className = className;
    },

    addClass: function(className) {
        this.el.classList.add(className);
    },

    removeClass: function(className) {
        this.el.classList.remove(className);
    },

    toggleClass: function(className) {
        this.el.classList.toggle(className);
    },

    containsClass: function(className) {
        return this.el.classList.contains(className);
    },

    addEventListener: function(event, callback, options) {
        this.el.addEventListener(event, callback, options);
    },

    setAttr: function(name, value) {
        this.el.setAttribute(name, value);
    }
};

export default Element;
const Element = {
    el: null,

    init: function(tag, className) {
        this.el = document.createElement(tag);
        if (className) this.el.className = className;
    },

    addEventListener: function(event, callback, options) {
        this.el.addEventListener(event, callback, options);
    },

    setAttr: function(name, value) {
        this.el.setAttribute(name, value);
    }
};

export default Element;
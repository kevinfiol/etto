const Element = {
    el: null,

    init: function(tag) {
        this.el = document.createElement(tag);
    },

    update: function(props) {
        this.el.innerHTML = this.template(props);
    },

    view: function() {
        return this.el.innerHTML;
    }
};

export default Element;
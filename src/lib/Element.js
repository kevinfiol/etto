const Element = {
    el: new document.createElement(),

    update: function(props) {
        this.el.innerHTML = this.template(props);
    },

    view: function() {
        return this.el.innerHTML;
    }
};

export default Element;
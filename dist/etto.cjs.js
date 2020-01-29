'use strict';

var Element = {
    el: new document.createElement(),

    update: function(props) {
        this.el.innerHTML = this.template(props);
    },

    view: function() {
        return this.el.innerHTML;
    }
};

var UnorderedList = Object.create(Element);

UnorderedList.template = function (props) { return ("\n    <div>\n        hello " + (props.state.name) + "\n        " + (props.children) + "\n    </div>\n"); };

var Foo = Object.create(Element);

Foo.template = function () { return "\n    <h2>test me</h2>\n"; };

var state = { name: 'kevin' };
var container = document.getElementById('demo-1');

UnorderedList.update({ state: state });

container.innerHTML = UnorderedList.view();
//# sourceMappingURL=etto.cjs.js.map

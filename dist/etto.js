
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
(function () {
    'use strict';

    var State = {
        props: null,
        redraw: null,

        init: function(initialState, redraw) {
            this.props = initialState;
            this.redraw = redraw;
            this.redraw();
        },

        update: function(newState) {
            this.props = newState;
            this.redraw();
        },

        setName: function(name) {
            this.update(Object.assign({}, this.props, {name: name}));
        }
    };

    var view = function (props) { return 'foo'; };

    var initialState = { name: 'kevin' };

    function Etto(root, config, choices) {
        var this$1 = this;

        this.state = Object.create(State);

        this.state.init(initialState, function () {
            var props = this$1.state.props;
            root.innerHTML = view();
        });
    }

    new Etto(document.getElementById('demo-1'), null, null);

}());
//# sourceMappingURL=etto.js.map

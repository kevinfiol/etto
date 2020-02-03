const State = {
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
    }
};

export default State;
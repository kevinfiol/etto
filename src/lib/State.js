const State = {
    props: null,

    update: function(props, callback) {
        this.props = props;
        if (callback) callback();
    }
};

export default State;
class State {
    constructor(props) {
        this.props = props || null;
    }

    update(props, callback) {
        this.props = props;
        if (callback) callback(this.props);
    }
}

export default State;
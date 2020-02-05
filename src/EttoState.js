import State from './lib/State';

class EttoState extends State {
    constructor(props) {
        super(props);
    }

    setChoices(choices) {
        this.update({ ...this.props, choices }, console.log);
    }
}

export default EttoState;
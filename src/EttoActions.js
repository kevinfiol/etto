class EttoActions {
    constructor(state) {
        this.state = state;
    }

    setInputVal(inputVal) {
        this.state.inputVal = inputVal;
    }

    setChoices(choices) {
        this.state.choices = choices;
    }

    setFiltered(filtered) {
        this.state.filtered = filtered;
    }
}

export default EttoActions;
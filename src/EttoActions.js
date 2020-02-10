class EttoActions {
    constructor(state) {
        this.state = state;
    }

    setCache(cache) {
        this.state.cache = cache;
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
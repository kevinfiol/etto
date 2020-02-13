class EttoActions {
    constructor(state) {
        this.state = state;
    }

    setSelected(selected) {
        this.state.selected = selected;
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

    setIsFetching(isFetching) {
        this.state.isFetching = isFetching;
    }

    setTimer(timer) {
        this.state.timer = timer;
    }

    clearTimer() {
        clearInterval(this.state.timer);
    }
}

export default EttoActions;
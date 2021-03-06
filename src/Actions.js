class Actions {
    constructor(state) {
        this.state = state;
    }

    setHighlighted(highlighted) {
        this.state.highlighted = highlighted;
    }

    setSelected(selected) {
        this.state.selected = selected;
    }

    setCache(cache) {
        this.state.cache = cache;
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

    setSpinnerTimer(spinnerTimer) {
        this.state.spinnerTimer = spinnerTimer;
    }

    clearSpinnerTimer() {
        clearInterval(this.state.spinnerTimer);
    }

    setFetchTimer(fetchTimer) {
        this.state.fetchTimer = fetchTimer;
    }

    clearFetchTimer() {
        clearTimeout(this.state.fetchTimer);
    }
}

export default Actions;
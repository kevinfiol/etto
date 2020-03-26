import EttoService from './EttoService';
import { choiceMap } from './util';

const SPINNER_TIMER = 300;

class InputService extends EttoService {
    constructor(root, config, choices) {
        super(root, config, choices);

        // Initial Render
        this.render(this.state.inputVal, this.state.filtered);
    }

    render(inputVal, filtered) {
        this.UnorderedList.populateList(inputVal, filtered, this.state.selected);
    }

    setShowDropdown(showDropdown) {
        // DOM Update
        this.Dropdown.setDisplay(showDropdown ? 'block' : 'none');

        // Reset Selected if Dropdown has been hidden
        if (!showDropdown && this.state.selected)
            this.actions.setSelected(null);
    }

    fetchFromSource(inputVal) {
        const key = inputVal.toUpperCase().trim();

        if (this.state.cache[key]) {
            this.onReceiveChoices(this.state.cache[key]);
        } else {
            if (this.state.fetchTimer) this.actions.clearFetchTimer();

            this.actions.setFetchTimer(
                setTimeout(() => {
                    this.actions.setIsFetching(true);
                    this.actions.setSpinnerTimer(
                        setInterval(this.Spinner.animateDots.bind(this.Spinner), SPINNER_TIMER)
                    );

                    this.Spinner.setDisplay('flex');

                    this.source(inputVal, res => {
                        const choices = res ? res.map(choiceMap) : [];

                        this.actions.setCache({ ...this.state.cache, [key]: choices });
                        this.actions.setIsFetching(false);

                        this.Spinner.setDisplay('none');
                        this.actions.clearSpinnerTimer();

                        this.onReceiveChoices(choices);
                    });
                }, this.requestDelay)
            );
        }
    }

    onReceiveChoices(choices) {
        const filtered = this.filterFn(
            this.state.inputVal,
            choices,
            this.matchFullWord,
            this.maxResults
        );

        this.actions.setChoices(choices);
        this.actions.setFiltered(filtered);

        this.render(this.state.inputVal, filtered);
        this.setShowDropdown(filtered.length > 0);
    }

    createItemMousedownEvt(choiceLabel, choiceValue) {
        return () => {
            const filtered = this.filterFn(
                choiceValue,
                this.state.choices,
                this.matchFullWord,
                this.maxResults
            );

            this.actions.setInputVal(choiceValue);
            this.actions.setFiltered(filtered);

            this.render(choiceLabel, filtered);
            this.setShowDropdown(filtered.length > 0);

            this.Input.setValue(choiceValue);
            this.Input.focus();
        };
    }

    onInput(e) {
        const inputVal = e.target.value;
        this.actions.setInputVal(inputVal);

        if (inputVal && inputVal.trim().length >= this.minChars) {
            if (this.source) this.fetchFromSource(inputVal);
            else this.onReceiveChoices(this.state.choices);
        } else {
            this.actions.setFiltered([]);
            this.render(inputVal, []);
            this.setShowDropdown(false);
        }
    }

    onFocus() {
        this.setShowDropdown(this.state.filtered.length > 0);
    }

    onBlur() {
        // Reset Selected
        if (this.state.selected) {
            this.actions.setSelected(null);
            this.render(this.state.inputVal, this.state.filtered);
        }

        this.setShowDropdown(false);
    }

    onKeydown(e) {
        let isDropdownVisible = this.Dropdown.el.style.display === 'block';

        if ((e.keyCode == 38 || e.keyCode == 40) && isDropdownVisible) {
            e.preventDefault();

            // Decrement (Go Up)
            if (e.keyCode == 38) {
                if (this.state.selected === null)
                    this.actions.setSelected(0);
                else if (this.state.selected !== 0)
                    this.actions.setSelected(this.state.selected - 1);
            }

            // Increment (Go Down)
            if (e.keyCode == 40) {
                if (this.state.selected === null)
                    this.actions.setSelected(0);
                else if (this.state.selected !== this.state.filtered.length - 1)
                    this.actions.setSelected(this.state.selected + 1);
            }

            this.render(this.state.inputVal, this.state.filtered);
            this.setShowDropdown(this.state.filtered.length > 0);
        }

        // Enter or Tab
        if (e.keyCode == 9 || e.keyCode == 13) {
            if (isDropdownVisible) {
                e.preventDefault();
                let inputVal = undefined;

                if (this.state.selected !== null) {
                    const choice = this.state.filtered[this.state.selected];
                    inputVal = choice.label;

                    this.actions.setInputVal(inputVal);
                    this.actions.setSelected(null);

                    // Update DOM
                    this.Input.setValue(inputVal);

                    const filtered = this.filterFn(
                        inputVal,
                        this.state.choices,
                        this.matchFullWord,
                        this.maxResults
                    );

                    this.render(inputVal, filtered);
                    this.setShowDropdown(false);
                }
            }
        }
    }
}

export default InputService;
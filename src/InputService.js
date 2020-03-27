import EttoService from './EttoService';
import { choiceMap } from './util';

const SPINNER_TIMER = 300;

class InputService extends EttoService {
    constructor(root, config, choices) {
        super(root, config, choices);

        // Initial Render
        this.render(this.state.inputVal, this.state.filtered);
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
        // Reset Highlighted
        if (this.state.highlighted) {
            this.actions.setHighlighted(null);
            this.render(this.state.inputVal, this.state.filtered);
        }

        this.setShowDropdown(false);
    }

    createItemMousedownEvt({ label, value }) {
        return () => {
            const filtered = this.filterFn(
                value,
                this.state.choices,
                this.matchFullWord,
                this.maxResults
            );

            this.actions.setInputVal(label);
            this.actions.setFiltered(filtered);

            this.render(label, filtered);
            this.setShowDropdown(filtered.length > 0);

            this.Input.setValue(value);
            this.Input.focus();
        };
    }
}

export default InputService;
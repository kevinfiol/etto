import EttoService from './EttoService';

class SelectService extends EttoService {
    constructor(root, config, choices) {
        super(root, config, choices);

        // Initial Render
        this.render(this.state.inputVal, this.state.filtered);
    }

    onInput(e) {
        const inputVal = e.target.value;
        this.actions.setInputVal(inputVal);

        if (inputVal) {
            if (this.source) this.fetchFromSource(inputVal);
            else this.onReceiveChoices(this.state.choices);
        } else {
            this.actions.setFiltered(this.state.choices);
            this.render(inputVal, this.state.filtered);
            this.setShowDropdown(true);
        }
    }

    onFocus() {
        this.setShowDropdown(true);
    }

    onBlur() {
        if (!this.state.selected) {
            this.actions.setInputVal('');
            this.Input.setValue('');
        } else {
            this.actions.setInputVal(this.state.selected.value);
            this.Input.setValue(this.state.selected.label);
        }

        // Reset List
        this.actions.setFiltered(this.state.choices);
        this.render(this.state.inputVal, this.state.filtered);
        this.setShowDropdown(false);
    }

    createItemMousedownEvt({ label, value }) {
        return () => {
            this.actions.setSelected({ label, value });
            this.actions.setInputVal(value);
            this.actions.setFiltered(this.state.choices);

            this.render(label, this.state.choices);
            this.setShowDropdown(false);

            setTimeout(() => {
                this.actions.setInputVal(value);
                this.Input.setValue(value);
            });
        };
    }
}

export default SelectService;
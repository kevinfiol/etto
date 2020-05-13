const AbstractEttoService = require('./AbstractEttoService');

class InputService extends AbstractEttoService {
    constructor(root, config, choices) {
        super(root, config, choices);

        // Initial Render
        this.render(this.Input.value, this.state.filtered);
    }

    clear() {
        this.actions.setSelected(null);
        this.actions.setFiltered([]);

        this.Input.setValue('');
        this.ClearBtn.hide();
        this.render(this.Input.value, this.state.filtered);
    }

    onInput(e) {
        const inputVal = e.target.value;

        if (inputVal) this.ClearBtn.show();
        else this.ClearBtn.hide();

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
        if (this.state.highlighted !== null) {
            this.actions.setHighlighted(null);
            this.render(this.Input.value, this.state.filtered);
        }

        this.setShowDropdown(false);
    }

    onSelection(choice) {
        const filtered = this.filterFn(
            choice.label,
            this.state.choices,
            this.matchFullWord,
            this.maxResults
        );

        this.Input.setValue(choice.value);

        this.actions.setFiltered(filtered);
        this.actions.setHighlighted(null);

        this.render(choice.label, filtered);
        this.setShowDropdown(false);

        // Custom onSelect callback
        if (this.onSelect) this.onSelect(choice);
    }

    createItemMousedownEvt(choice) {
        return () => {
            this.onSelection(choice);
            this.Input.focus();
        };
    }
}

module.exports = InputService;
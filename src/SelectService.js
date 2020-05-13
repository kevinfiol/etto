const AbstractEttoService = require('./AbstractEttoService');

class SelectService extends AbstractEttoService {
    constructor(root, config, choices) {
        super(root, config, choices);

        // SelectService filtered should be populated by default
        this.actions.setFiltered(this.state.choices);

        // Initial Render
        this.render(this.Input.value, this.state.filtered);
    }

    clear() {
        this.actions.setSelected(null);
        this.Input.setPlaceholder('');
        this.Input.setValue('');
        this.ClearBtn.hide();
        this.render(this.Input.value, this.state.filtered);
    }

    onInput(e) {
        const inputVal = e.target.value;

        if (inputVal) this.ClearBtn.show();
        else this.ClearBtn.hide();

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
        this.Input.setValue('');
        this.setShowDropdown(true);
    }

    onBlur() {
        if (!this.state.selected) {
            this.Input.setValue('');
            this.ClearBtn.hide();
        } else {
            this.Input.setValue(this.state.selected.value);
            this.ClearBtn.show();
        }

        // Reset List
        this.actions.setFiltered(this.state.choices);
        this.render(this.Input.value, this.state.filtered);
        this.setShowDropdown(false);
    }

    onSelection(choice) {
        setTimeout(() => {
            this.Input.setValue(choice.value);
            this.Input.setPlaceholder(choice.value);
        });

        this.actions.setFiltered(this.state.choices);
        this.actions.setHighlighted(null);
        this.actions.setSelected(choice);

        this.render(choice.label, this.state.filtered);
        this.setShowDropdown(false);

        this.ClearBtn.show();
        this.Input.blur();

        // Custom onSelect callback
        if (this.onSelect) this.onSelect(choice);
    }

    createItemMousedownEvt(choice) {
        return () => {
            this.onSelection(choice);
        };
    }
}

module.exports = SelectService;
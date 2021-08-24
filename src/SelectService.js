import AbstractEttoService from './AbstractEttoService.js';

class SelectService extends AbstractEttoService {
    constructor(root, config, choices) {
        super(root, config, choices);

        // SelectService filtered should be populated by default
        this.actions.setFiltered(this.state.choices);

        // add this to imitate select box hiding on second click
        this.Input.addEventListener('mousedown', () => {
            if (this.Dropdown.isVisible()) this.Dropdown.hide();
            else this.Dropdown.show();
        });

        this.Input.setPlaceholder(this.defaultPlaceholder);

        // Initial Render
        this.render(this.Input.value, this.state.filtered);
    }

    clear() {
        this.actions.setSelected(null);
        this.Input.setPlaceholder(this.defaultPlaceholder);
        this.Input.setValue('');
        this.ClearBtn.hide();
        this.render(this.Input.value, this.state.filtered);

        if (this.onClear) this.onClear();
    }

    onInput(e) {
        let inputVal = e.target.value;
        if (this.onValue) this.onValue(inputVal); // custom callback

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
        if (this.Input.value !== '')
            this.Input.setValue('');
        this.setShowDropdown(true);
    }

    onBlur() {
        if (!this.state.selected) {
            if (this.Input.value !== '')
                this.Input.setValue('');
            this.ClearBtn.hide();
        } else {
            setTimeout(() => {
                if (this.state.selected.value && this.Input.value.trim() !== this.state.selected.value)
                    this.Input.setValue(this.state.selected.value);
            });

            this.ClearBtn.show();
        }

        // Reset List
        this.actions.setFiltered(this.state.choices);
        this.render(this.Input.value, this.state.filtered);
        this.setShowDropdown(false);
    }

    onSelection(choice) {
        this.Input.setValue(choice.value);
        this.Input.setPlaceholder(choice.value);

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

    itemMouseDownEvt(choice) {
        this.onSelection(choice);
    }
}

export default SelectService;
import InputService from './InputService.js';
import SelectService from './SelectService.js';

class Etto {
    constructor(root, config, choices) {
        if (config.selectMode) {
            this.service = new SelectService(root, config, choices);
        } else {
            this.service = new InputService(root, config, choices);
        }
    }

    get value() {
        return this.service.Input.value;
    }

    set value(value) {
        this.service.Input.setValue(value);
    }

    get selected() {
        return this.service.state.selected;
    }

    clear() {
        this.service.clear();
    }
}

export default Etto;
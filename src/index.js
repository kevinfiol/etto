const InputService = require('./InputService');
const SelectService = require('./SelectService');

class Etto {
    constructor(root, config, choices) {
        if (config.selectMode) {
            this.service = new SelectService(root, config, choices);
        } else {
            this.service = new InputService(root, config, choices);
        }
    }
}

module.exports = Etto;
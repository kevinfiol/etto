import EttoService from './EttoService';

class SelectService extends EttoService {
    constructor(root, config, choices) {
        super(root, config, choices);
    }
}

export default SelectService;
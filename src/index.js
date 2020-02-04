import Element from './lib/Element';
import EttoState from './EttoState';

const initialState = {
    minChar: 3,
    maxResults: 7,

    cache: {},
    choices: [],
    filtered: [],

    inputVal: '',
};

function Etto(root, config, choices) {
    this.state = Object.create(EttoState);
    this.state.init(initialState);
    if (choices) this.state.update({ ...this.state.props, choices });
    
    this.root = Element.assignEl(root);

}

new Etto(document.getElementById('demo-1'), {}, ['wisconsin', 'connecticutt', 'minnesota', 'florida']);

// const state = {
//     showDropdown: false,
//     isFetching: false,
//     selected: null,
//     inputRef: null,
//     inputVal: '',
//     timer: undefined,

//     cache: {},
//     filtered: [],
//     all: choices || [],

//     // User Configurations
//     // Classes & Ids
//     inputId: config.inputId || null,
//     inputClass: config.inputClass || null,
//     divClass: config.divClass || null,
//     dropdownClass: config.dropdownClass || '',
//     ulClass: config.ulClass || '',
//     liClass: config.liClass || '',

//     showClearBtn: config.showClearBtn || true,
//     showSpinner: config.showSpinner || true,
//     emptyMsg: config.emptyMsg || 'No Options',
//     selectMode: config.selectMode || false,
//     matchFullWord: config.matchFullWord || false,
//     minChars: config.minChars || 3,
//     maxResults: config.maxResults || 7,
//     enterEvent: config.enterEvent || null,
//     valueEvent: config.valueEvent || null,
//     renderItem: config.renderItem || null,
//     selectEvent: config.selectEvent || null,
//     events: config.events || null,
//     source: config.source || null
// };
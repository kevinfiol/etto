import Element from './lib/Element';
// import EttoState from './EttoState';

const initialState = {
    minChar: 3,
    maxResults: 7,

    cache: {},
    choices: [],
    filtered: [],

    inputVal: '',
};

class Etto {
    constructor(root, config, choices) {
        // this.state = new EttoState(initialState);
        // if (choices) this.state.setChoices(choices);
        this.state = {
            minChar: 3,
            maxResults: 7,
        
            cache: {},
            choices: [],
            filtered: [],
        
            inputVal: '',
        };

        this.ul = this.createUnorderedList();
        this.ul.setInnerHtml(this.generateList(this.state.props.choices));

        this.dropdown = this.createDropdown();
        this.dropdown.appendChild(this.ul);

        this.input = this.createInput();

        this.root = new Element(root);
        this.root.appendChild(this.input);
        this.root.appendChild(this.dropdown);
    }

    createInput(className) {
        const input = new Element('input', className);
        input.setAttrs({
            autocomplete: 'off',
            value: '',
            style: 'box-sizing: border-box;'
        });

        return input;
    }

    createDropdown(className) {
        const dropdown = new Element('div', className);
        dropdown.setAttrs({
            style: 'position: absolute; max-height: 300px; width: 100%; background-color: white; overflow: hidden; overflow-y: auto; z-index: 99;'
        });

        return dropdown;
    }

    createUnorderedList(className) {
        const ul = new Element('ul', className);
        return ul;
    }

    generateList(choices) {
        let lis = '';

        for (let i = 0; i < choices.length; i++) {
            lis += `<li>${ choices[i] }</li>`;
        }

        return lis;
    }
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
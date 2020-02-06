import Element from './Element';
import EttoActions from './EttoActions';
import { removeHtml, createEmText } from './util';

// import EttoState from './EttoState';

class Etto {
    constructor(root, config, choices) {
        this.state = {
            cache: {},
            choices: choices || [],
            filtered: [],
            inputVal: ''
        };

        this.actions = new EttoActions(this.state);

        this.source = config.source || null;
        this.minChars = config.minChars || 3;
        this.maxResults = config.maxResults || 7;
        this.matchFullWord = config.matchFullWord || false;

        this.ul = this.createUnorderedList();
        this.renderList(this.state.inputVal, this.state.filtered);

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

        input.addEventListener('input', e => {
            const inputVal = e.target.value;
            this.actions.setInputVal(inputVal);

            if (inputVal && inputVal.trim().length >= this.minChars) {
                if (this.source) this.fetchFromSource(this.onReceiveChoices);
                else this.onReceiveChoices(this.state.choices);
            } else {
                this.renderList(inputVal, []);
            }
        });

        return input;
    }

    onReceiveChoices(choices) {
        const filtered = this.filter(
            this.state.inputVal,
            choices,
            this.matchFullWord,
            this.maxResults
        );

        this.actions.setChoices(choices);
        this.actions.setFiltered(filtered);
        this.renderList(this.state.inputVal, filtered);
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

    createListItem(choice, inputVal) {
        const li = document.createElement('li');
        li.setAttribute('style', 'list-style-type: none; cursor: default;');
        li.className = 'etto-li';
        li.innerHTML = createEmText(choice.label, inputVal);

        li.addEventListener('mousedown', e => {
            const filtered = this.filter(
                choice.value,
                this.choices,
                this.matchFullWord,
                this.maxResults
            );

            this.actions.setInputVal(choice.value);
            this.actions.setFiltered(filtered);
            // then Focus Input and Hide Dropdown
        });

        return li;
    }

    generateList(inputVal, choices, renderItem) {
        let items = [];

        for (let i = 0; i < choices.length; i++) {
            if (renderItem) {
                items.push( renderItem(choices[i], inputVal) );
            } else {
                items.push( this.createListItem(choices[i], inputVal) );
            }
        }

        return items;
    }

    filter(inputVal, choices, matchFullWord, maxResults) {
        const v = inputVal.toUpperCase();

        let filtered = choices.filter(c => {
            const label = c.label;
            let index = label.toUpperCase().indexOf(v);

            const passes = matchFullWord || false
                ? label[index - 1] === undefined || label[index - 1] === ' '
                : true
            ;

            return index > -1 && passes;
        });

        if (maxResults !== undefined)
            filtered = filtered.slice(0, maxResults);

        return filtered;
    }

    renderList(inputVal, filtered) {
        const items = this.generateList(inputVal, filtered, this.renderItem);

        this.ul.setInnerHtml('');
        for (let i = 0; i < items.length; i++) {
            this.ul.dom.appendChild(items[i]);
        }
    }
}



new Etto(document.getElementById('demo-1'), {}, [
    { label: 'Alabama' },
    { label: 'Alaska' },
    { label: 'Michigan' },
    { label: 'Minnesota' },
    { label: 'Wyoming' },
    { label: 'Doug' },
    { label: 'Omigod Records' },
    { label: 'Ganon' },
    { label: 'Little Bambam' },
    { label: 'Ness from Earthbound' },
    { label: 'Ghoul' },
    { label: 'Banana' }
]);

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
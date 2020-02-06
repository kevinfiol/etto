import Element from './lib/Element';
// import EttoState from './EttoState';

class Etto {
    constructor(root, config, choices) {
        this.state = {
            cache: {},
            choices: choices || [],
            filtered: [],
            inputVal: ''
        };

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

    setInputVal(inputVal) {
        this.state.inputVal = inputVal;
    }

    setChoices(choices) {
        this.state.choices = choices;
    }

    setFiltered(filtered) {
        this.state.filtered = filtered;
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
            this.setInputVal(inputVal);

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

        this.setChoices(choices);
        this.setFiltered(filtered);
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

    generateList(inputVal, choices, renderItem) {
        let items = '';

        for (let i = 0; i < choices.length; i++) {
            if (renderItem) {
                items += renderItem(choices[i], inputVal);
            } else {
                const choiceText = this.createEmText(choices[i], inputVal);
                items += `<li>${ choiceText }</li>`;
            }
        }

        return items;
    }

    createEmText(choice, inputVal) {
        const label = this.removeHtml(choice);
        const len = inputVal.length;
        const emIndex = choice.toUpperCase().indexOf(inputVal.toUpperCase());

        const beg = label.slice(0, emIndex);
        const mid = label.slice(emIndex, emIndex + len);
        const end = label.slice(emIndex + len);

        return `${ beg }<b>${ mid }</b>${ end }`;
    }

    filter(inputVal, choices, matchFullWord, maxResults) {
        const v = inputVal.toUpperCase();

        let filtered = choices.filter(c => {
            let index = c.toUpperCase().indexOf(v);

            const passes = matchFullWord || false
                ? c[index - 1] === undefined || c[index - 1] === ' '
                : true
            ;

            return index > -1 && passes;
        });

        if (maxResults !== undefined)
            filtered = filtered.slice(0, maxResults);

        return filtered;
    }

    renderList(inputVal, filtered) {
        this.ul.setInnerHtml(this.generateList(inputVal, filtered, this.renderItem));
    }

    removeHtml(s) {
        return s.replace(/&/g, '').replace(/</g, '').replace(/>/g, '');
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
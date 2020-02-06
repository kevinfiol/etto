'use strict';

var Element = function Element(dom, className) {
    if (typeof(dom) === 'string') {
        this.dom = document.createElement(dom);
    } else {
        this.dom = dom;
    }

    if (className) { this.dom.className = className; }
    this.children = [];
};

Element.prototype.assignEl = function assignEl (dom) {
    if (this.dom) { delete this.dom; }
    this.dom = dom;
};

Element.prototype.setClassName = function setClassName (className) {
    this.dom.className = className;
};

Element.prototype.addClass = function addClass (className) {
    this.dom.classList.add(className);
};

Element.prototype.removeClass = function removeClass (className) {
    this.dom.classList.remove(className);
};

Element.prototype.toggleClass = function toggleClass (className) {
    this.dom.classList.toggle(className);
};

Element.prototype.containsClass = function containsClass (className) {
    return this.dom.classList.contains(className);
};

Element.prototype.addEventListener = function addEventListener (event, callback, options) {
    this.dom.addEventListener(event, callback, options);
};

Element.prototype.setAttrs = function setAttrs (attrs) {
    for (var key in attrs) {
        this.dom.setAttribute(key, attrs[key]);
    }
};

Element.prototype.appendChild = function appendChild (element) {
    this.dom.appendChild(element.dom);
    this.children.push(element);
};

Element.prototype.setInnerHtml = function setInnerHtml (html) {
    this.dom.innerHTML = html;
};

var EttoActions = function EttoActions(state) {
    this.state = state;
};

EttoActions.prototype.setInputVal = function setInputVal (inputVal) {
    this.state.inputVal = inputVal;
};

EttoActions.prototype.setChoices = function setChoices (choices) {
    this.state.choices = choices;
};

EttoActions.prototype.setFiltered = function setFiltered (filtered) {
    this.state.filtered = filtered;
};

function removeHtml(s) {
    return s.replace(/&/g, '').replace(/</g, '').replace(/>/g, '');
}

function createEmText(choiceLabel, inputVal) {
    var label = removeHtml(choiceLabel);
    var len = inputVal.length;
    var emIndex = choiceLabel.toUpperCase().indexOf(inputVal.toUpperCase());

    var beg = label.slice(0, emIndex);
    var mid = label.slice(emIndex, emIndex + len);
    var end = label.slice(emIndex + len);

    return (beg + "<b>" + mid + "</b>" + end);
}

// import EttoState from './EttoState';

var Etto = function Etto(root, config, choices) {
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
};

Etto.prototype.createInput = function createInput (className) {
        var this$1 = this;

    var input = new Element('input', className);

    input.setAttrs({
        autocomplete: 'off',
        value: '',
        style: 'box-sizing: border-box;'
    });

    input.addEventListener('input', function (e) {
        var inputVal = e.target.value;
        this$1.actions.setInputVal(inputVal);

        if (inputVal && inputVal.trim().length >= this$1.minChars) {
            if (this$1.source) { this$1.fetchFromSource(this$1.onReceiveChoices); }
            else { this$1.onReceiveChoices(this$1.state.choices); }
        } else {
            this$1.renderList(inputVal, []);
        }
    });

    return input;
};

Etto.prototype.onReceiveChoices = function onReceiveChoices (choices) {
    var filtered = this.filter(
        this.state.inputVal,
        choices,
        this.matchFullWord,
        this.maxResults
    );

    this.actions.setChoices(choices);
    this.actions.setFiltered(filtered);
    this.renderList(this.state.inputVal, filtered);
};

Etto.prototype.createDropdown = function createDropdown (className) {
    var dropdown = new Element('div', className);
    dropdown.setAttrs({
        style: 'position: absolute; max-height: 300px; width: 100%; background-color: white; overflow: hidden; overflow-y: auto; z-index: 99;'
    });

    return dropdown;
};

Etto.prototype.createUnorderedList = function createUnorderedList (className) {
    var ul = new Element('ul', className);
    return ul;
};

Etto.prototype.createListItem = function createListItem (choice, inputVal) {
        var this$1 = this;

    var li = document.createElement('li');
    li.setAttribute('style', 'list-style-type: none; cursor: default;');
    li.className = 'etto-li';
    li.innerHTML = createEmText(choice.label, inputVal);

    li.addEventListener('mousedown', function (e) {
        var filtered = this$1.filter(
            choice.value,
            this$1.choices,
            this$1.matchFullWord,
            this$1.maxResults
        );

        this$1.actions.setInputVal(choice.value);
        this$1.actions.setFiltered(filtered);
        // then Focus Input and Hide Dropdown
    });

    return li;
};

Etto.prototype.generateList = function generateList (inputVal, choices, renderItem) {
    var items = [];

    for (var i = 0; i < choices.length; i++) {
        if (renderItem) {
            items.push( renderItem(choices[i], inputVal) );
        } else {
            items.push( this.createListItem(choices[i], inputVal) );
        }
    }

    return items;
};

Etto.prototype.filter = function filter (inputVal, choices, matchFullWord, maxResults) {
    var v = inputVal.toUpperCase();

    var filtered = choices.filter(function (c) {
        var label = c.label;
        var index = label.toUpperCase().indexOf(v);

        var passes = matchFullWord || false
            ? label[index - 1] === undefined || label[index - 1] === ' '
            : true
        ;

        return index > -1 && passes;
    });

    if (maxResults !== undefined)
        { filtered = filtered.slice(0, maxResults); }

    return filtered;
};

Etto.prototype.renderList = function renderList (inputVal, filtered) {
    var items = this.generateList(inputVal, filtered, this.renderItem);

    this.ul.setInnerHtml('');
    for (var i = 0; i < items.length; i++) {
        this.ul.dom.appendChild(items[i]);
    }
};



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
//# sourceMappingURL=etto.cjs.js.map

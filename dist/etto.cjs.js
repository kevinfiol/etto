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

var Etto = function Etto(root, config, choices) {
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
};

Etto.prototype.createInput = function createInput (className) {
    var input = new Element('input', className);
    input.setAttrs({
        autocomplete: 'off',
        value: '',
        style: 'box-sizing: border-box;'
    });

    return input;
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

Etto.prototype.generateList = function generateList (choices) {
    var lis = '';

    for (var i = 0; i < choices.length; i++) {
        lis += "<li>" + (choices[i]) + "</li>";
    }

    return lis;
};

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
//# sourceMappingURL=etto.cjs.js.map

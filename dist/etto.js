
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
(function () {
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

    // import EttoState from './EttoState';

    var Etto = function Etto(root, config, choices) {
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
    };

    Etto.prototype.setInputVal = function setInputVal (inputVal) {
        this.state.inputVal = inputVal;
    };

    Etto.prototype.setChoices = function setChoices (choices) {
        this.state.choices = choices;
    };

    Etto.prototype.setFiltered = function setFiltered (filtered) {
        this.state.filtered = filtered;
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
            this$1.setInputVal(inputVal);

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

        this.setChoices(choices);
        this.setFiltered(filtered);
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

    Etto.prototype.generateList = function generateList (inputVal, choices, renderItem) {
        var items = '';

        for (var i = 0; i < choices.length; i++) {
            if (renderItem) {
                items += renderItem(choices[i], inputVal);
            } else {
                var choiceText = this.createEmText(choices[i], inputVal);
                items += "<li>" + choiceText + "</li>";
            }
        }

        return items;
    };

    Etto.prototype.createEmText = function createEmText (choice, inputVal) {
        var label = this.removeHtml(choice);
        var len = inputVal.length;
        var emIndex = choice.toUpperCase().indexOf(inputVal.toUpperCase());

        var beg = label.slice(0, emIndex);
        var mid = label.slice(emIndex, emIndex + len);
        var end = label.slice(emIndex + len);

        return (beg + "<b>" + mid + "</b>" + end);
    };

    Etto.prototype.filter = function filter (inputVal, choices, matchFullWord, maxResults) {
        var v = inputVal.toUpperCase();

        var filtered = choices.filter(function (c) {
            var index = c.toUpperCase().indexOf(v);

            var passes = matchFullWord || false
                ? c[index - 1] === undefined || c[index - 1] === ' '
                : true
            ;

            return index > -1 && passes;
        });

        if (maxResults !== undefined)
            { filtered = filtered.slice(0, maxResults); }

        return filtered;
    };

    Etto.prototype.renderList = function renderList (inputVal, filtered) {
        this.ul.setInnerHtml(this.generateList(inputVal, filtered, this.renderItem));
    };

    Etto.prototype.removeHtml = function removeHtml (s) {
        return s.replace(/&/g, '').replace(/</g, '').replace(/>/g, '');
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

}());
//# sourceMappingURL=etto.js.map

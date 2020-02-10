'use strict';

var EttoActions = function EttoActions(state) {
    this.state = state;
};

EttoActions.prototype.setCache = function setCache (cache) {
    this.state.cache = cache;
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

EttoActions.prototype.setIsFetching = function setIsFetching (isFetching) {
    this.state.isFetching = isFetching;
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

function filterChoices(inputVal, choices, matchFullWord, maxResults) {
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
}

function choiceMap(choice) {
    return Object.assign({}, choice, {
        label: choice.label,
        value: choice.value || choice.label
    });
}

var Etto = function Etto(root, config, choices) {
    this.state = {
        isFetching: false,
        cache: config.initialCache || {},
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

    this.root = root;
    this.input = this.createInput();
    this.root.appendChild(this.input);
    this.root.appendChild(this.dropdown);
};

Etto.prototype.onReceiveChoices = function onReceiveChoices (choices) {
    var filtered = filterChoices(
        this.state.inputVal,
        choices,
        this.matchFullWord,
        this.maxResults
    );

    this.actions.setChoices(choices);
    this.actions.setFiltered(filtered);
    this.renderList(this.state.inputVal, filtered);
};

Etto.prototype.renderList = function renderList (inputVal, filtered) {
    // Use custom renderItem function if exists
    var renderItem = this.renderItem || this.createListItem.bind(this);

    // Clear & Repopulate List
    this.ul.innerHTML = '';

    for (var i = 0; i < filtered.length; i++) {
        this.ul.appendChild( renderItem(filtered[i], inputVal) );
    }
};

Etto.prototype.fetchFromSource = function fetchFromSource () {
        var this$1 = this;

    var key = this.state.inputVal.toUpperCase().trim();

    if (this.state.cache[key]) {
        this.onReceiveChoices(this.state.cache[key]);
    } else {
        this.actions.setIsFetching(true);

        this.source(this.state.inputVal, function (res) {
                var obj;

            var choices = res ? res.map(choiceMap) : [];

            this$1.actions.setCache(Object.assign({}, this$1.state.cache, ( obj = {}, obj[key] = choices, obj )));
            this$1.actions.setIsFetching(false);
            this$1.onReceiveChoices(choices);
        });
    }
};

Etto.prototype.createInput = function createInput () {
        var this$1 = this;

    var input = document.createElement('input');
    input.classList.add('etto-input');

    input.setAttribute('autocomplete', 'off');
    input.setAttribute('value', '');
    input.setAttribute('style', 'box-sizing: border-box;');

    input.addEventListener('input', function (e) {
        var inputVal = e.target.value;
        this$1.actions.setInputVal(inputVal);

        if (inputVal && inputVal.trim().length >= this$1.minChars) {
            if (this$1.source) { this$1.fetchFromSource(); }
            else { this$1.onReceiveChoices(this$1.state.choices); }
        } else {
            this$1.renderList(inputVal, []);
        }
    });

    return input;
};

Etto.prototype.createDropdown = function createDropdown () {
    var dropdown = document.createElement('div');
    dropdown.classList.add('etto-dropdown');

    dropdown.setAttribute(
        'style',
        'position: absolute; max-height: 300px; width: 100%; background-color: white; overflow: hidden; overflow-y: auto; z-index: 99;'
    );

    return dropdown;
};

Etto.prototype.createUnorderedList = function createUnorderedList () {
    var ul = document.createElement('ul');
    ul.classList.add('etto-ul');

    return ul;
};

Etto.prototype.createListItem = function createListItem (choice, inputVal) {
        var this$1 = this;

    var choiceValue = choice.value || choice.label;

    var li = document.createElement('li');
    li.classList.add('etto-li');

    li.setAttribute('style', 'list-style-type: none; cursor: default;');
    li.innerHTML = createEmText(choice.label, inputVal);

    // Set HTML5 data-* attributes
    li.dataset.label = choice.label;
    li.dataset.value = choiceValue;

    li.addEventListener('mousedown', function () {
        var filtered = filterChoices(
            choiceValue,
            this$1.state.choices,
            this$1.matchFullWord,
            this$1.maxResults
        );

        this$1.actions.setInputVal(choiceValue);
        this$1.actions.setFiltered(filtered);

        // Update DOM
        this$1.input.value = choiceValue;
        // then Focus Input and Hide Dropdown
    });

    return li;
};

var xhr = null;
var source = function(query, done) {
    // Abort last request
    if (xhr) {
        xhr.abort();
    }

    xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://swapi.co/api/people/?search=' + query, true);

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 400) {
            // Parse the response here...
            var choices = [];
            var json = JSON.parse(xhr.responseText);

            json.results.forEach(function(person) {
                choices.push({ label: person.name });
            });

            done(choices);
        } else {
            // Else return empty array
            done([]);
        }
    };

    // Returns empty array onerror
    xhr.onerror = function() { 
        done([]);
    };
    
    xhr.send();
};

new Etto(document.getElementById('demo-1'), { source: source });

// new Etto(document.getElementById('demo-1'), {}, [
//     { label: 'Alabama' },
//     { label: 'Alaska' },
//     { label: 'Michigan' },
//     { label: 'Minnesota' },
//     { label: 'Wyoming' },
//     { label: 'Doug' },
//     { label: 'Omigod Records' },
//     { label: 'Ganon' },
//     { label: 'Little Bambam' },
//     { label: 'Ness from Earthbound' },
//     { label: 'Ghoul' },
//     { label: 'Banana' }
// ]);

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

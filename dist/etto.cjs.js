'use strict';

var EttoActions = function EttoActions(state) {
    this.state = state;
};

EttoActions.prototype.setSelected = function setSelected (selected) {
    this.state.selected = selected;
    console.log(this.state.selected);
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
        choices: choices.map(choiceMap) || [],
        filtered: [],
        inputVal: '',
        selected: null
    };

    this.actions = new EttoActions(this.state);

    this.source = config.source || null;
    this.minChars = config.minChars || 3;
    this.maxResults = config.maxResults || 7;
    this.matchFullWord = config.matchFullWord || false;

    this.ul = this.createUnorderedList();
    this.dropdown = this.createDropdown();
    this.dropdown.appendChild(this.ul);
    this.input = this.createInput();

    // Containers
    this.container = document.createElement('div');
    this.container.classList.add('etto-container');
    this.container.setAttribute('style', 'position: relative;');

    var inputContainer = document.createElement('div');
    inputContainer.setAttribute('style', 'position: relative;');
    inputContainer.appendChild(this.input);

    this.container.appendChild(inputContainer);
    this.container.appendChild(this.dropdown);

    this.root = root;
    this.root.appendChild(this.container);

    // Initial Render
    this.renderList(this.state.inputVal, this.state.filtered);
};

Etto.prototype.setShowDropdownElement = function setShowDropdownElement (showDropdown) {
    // DOM Update
    this.dropdown.style.display = showDropdown ? 'block' : 'none';

    // Reset Selected if Dropdown has been hidden
    if (!showDropdown && this.state.selected) { this.actions.setSelected(null); }
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
    this.setShowDropdownElement(filtered.length > 0);
};

Etto.prototype.renderList = function renderList (inputVal, filtered) {
    // Use custom renderItem function if exists
    var renderItem = this.renderItem || this.createListItem.bind(this);

    // Clear & Repopulate List
    this.ul.innerHTML = '';

    for (var i = 0; i < filtered.length; i++) {
        var isSelected = i === this.state.selected;
        this.ul.appendChild( renderItem(filtered[i], inputVal, isSelected) );
    }

    console.log(this.ul);
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
            this$1.setShowDropdownElement(false);
        }
    });

    input.addEventListener('focus', function () {
        this$1.setShowDropdownElement(this$1.state.filtered.length > 0);
    });

    input.addEventListener('blur', function () {
        // Reset Selected
        if (this$1.state.selected) {
            this$1.renderList(this$1.state.inputVal, this$1.state.filtered);
            this$1.setShowDropdownElement(this$1.state.filtered.length > 0);
        }
    });

    input.addEventListener('keydown', function (e) {
        var showDropdown = this$1.dropdown.style.display === 'block';

        if ((e.keyCode == 38 || e.keyCode == 40) && showDropdown) {
            e.preventDefault();

            // Decrement (Go Up)
            if (e.keyCode == 38) {
                if (this$1.state.selected === null)
                    { this$1.actions.setSelected(0); }
                else if (this$1.state.selected !== 0)
                    { this$1.actions.setSelected(this$1.state.selected - 1); }
            }

            // Increment (Go Down)
            if (e.keyCode == 40) {
                if (this$1.state.selected === null)
                    { this$1.actions.setSelected(0); }
                else if (this$1.state.selected !== this$1.state.filtered.length - 1)
                    { this$1.actions.setSelected(this$1.state.selected + 1); }
            }

            this$1.renderList(this$1.state.inputVal, this$1.state.filtered);
            this$1.setShowDropdownElement(this$1.state.filtered.length > 0);
        }

        // Enter or Tab
        if (e.keyCode == 9 || e.keyCode == 13) {
            if (showDropdown) {
                e.preventDefault();
                var inputVal = undefined;

                if (this$1.state.selected !== null) {
                    var choice = this$1.state.filtered[this$1.state.selected];
                    inputVal = choice.label;

                    this$1.actions.setInputVal(inputVal);
                    this$1.actions.setSelected(null);

                    // Update DOM
                    this$1.input.value = inputVal;

                    var filtered = filterChoices(
                        inputVal,
                        this$1.state.choices,
                        this$1.matchFullWord,
                        this$1.maxResults
                    );

                    this$1.renderList(inputVal, filtered);
                    this$1.setShowDropdownElement(false);
                }
            }
        }
    });

    return input;
};

Etto.prototype.createDropdown = function createDropdown () {
    var dropdown = document.createElement('div');
    dropdown.classList.add('etto-dropdown');

    dropdown.setAttribute(
        'style',
        'position: absolute; width: 100%; background-color: white; overflow: hidden; z-index: 99;'
    );

    // Hidden by default
    dropdown.style.display = 'none';

    return dropdown;
};

Etto.prototype.createUnorderedList = function createUnorderedList () {
    var ul = document.createElement('ul');
    ul.classList.add('etto-ul');

    return ul;
};

Etto.prototype.createListItem = function createListItem (choice, inputVal, isSelected) {
        var this$1 = this;

    var choiceValue = choice.value || choice.label;

    var li = document.createElement('li');
    li.classList.add('etto-li');

    if (isSelected) { li.classList.add('etto-selected'); }
    else { li.classList.remove('etto-selected'); }

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

        this$1.renderList(choice.label, filtered);
        this$1.setShowDropdownElement(filtered.length > 0);

        // Update DOM
        this$1.input.value = choiceValue;
        this$1.input.focus();
    });

    return li;
};

// new Etto(document.getElementById('demo-1'), { source });

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
//# sourceMappingURL=etto.cjs.js.map

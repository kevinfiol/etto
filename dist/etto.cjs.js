'use strict';

var Element = function Element(el) {
    this.el = el;
};

Element.prototype.addEventListener = function addEventListener (event, callback) {
    this.el.addEventListener(event, callback);
};

Element.prototype.applyClassList = function applyClassList (classList) {
    for (var i = 0; i < classList.length; i++) {
        this.el.classList.add(classList[i]);
    }
};

Element.prototype.applyAttributes = function applyAttributes (attributes) {
    for (var key in attributes) {
        this.el.setAttribute(key, attributes[key]);
    }
};

Element.prototype.appendChild = function appendChild (child) {
    this.el.appendChild(child);
};

Element.prototype.setDisplay = function setDisplay (display) {
    this.el.style.display = display;
};

var Input = /*@__PURE__*/(function (Element) {
    function Input(
        el,
        onInput,
        onFocus,
        onBlur,
        onKeydown,
        isSelectMode
    ) {
        Element.call(this, el);

        this.applyClassList(['etto-input']);
        this.applyAttributes({
            autocomplete: 'off',
            value: '',
            style: ("box-sizing: border-box; cursor: " + (isSelectMode ? 'default' : 'text') + ";")
        });

        this.addEventListener('input', onInput);
        this.addEventListener('focus', onFocus);
        this.addEventListener('blur', onBlur);
        this.addEventListener('keydown', onKeydown);
    }

    if ( Element ) Input.__proto__ = Element;
    Input.prototype = Object.create( Element && Element.prototype );
    Input.prototype.constructor = Input;

    var prototypeAccessors = { offsetHeight: { configurable: true } };

    prototypeAccessors.offsetHeight.get = function () {
        return this.el.offsetHeight;
    };

    Input.prototype.setValue = function setValue (value) {
        this.el.value = value;
    };

    Input.prototype.focus = function focus () {
        this.el.focus();
    };

    Object.defineProperties( Input.prototype, prototypeAccessors );

    return Input;
}(Element));

var Dropdown = /*@__PURE__*/(function (Element) {
    function Dropdown(el) {
        Element.call(this, el);

        this.applyClassList(['etto-dropdown']);
        this.applyAttributes({
            style: 'position: absolute; width: 100%; background-color: white; overflow: hidden; z-index: 99;'
        });

        // Hide by default
        this.setDisplay('none');
    }

    if ( Element ) Dropdown.__proto__ = Element;
    Dropdown.prototype = Object.create( Element && Element.prototype );
    Dropdown.prototype.constructor = Dropdown;

    return Dropdown;
}(Element));

var Spinner = /*@__PURE__*/(function (Element) {
    function Spinner(
        el,
        dotSize,
        topPosition
    ) {
        Element.call(this, el);

        this.dotSize = 6;
        this.dots = [];
        this.currentDot = 0;

        this.loOpacity = '0.3';
        this.hiOpacity = '0.7';

        this.applyClassList(['etto-spinner']);
        this.applyAttributes({
            style: 'position: absolute; display: none; align-items: center; right: 1em;'
        });

        this.el.style.top = topPosition;

        // Initialize Dots
        this.createDots();
        this.animateDots();
    }

    if ( Element ) Spinner.__proto__ = Element;
    Spinner.prototype = Object.create( Element && Element.prototype );
    Spinner.prototype.constructor = Spinner;

    Spinner.prototype.createDots = function createDots () {
        // Create Dots
        for (var i = 0; i < 3; i++) {
            var dot = document.createElement('div');
            dot.classList.add('etto-spinner-dot');
            dot.setAttribute(
                'style',
                'border-radius: 2em; margin: 0 0.1em; display: inline-block; transition: all 0.3s ease;'
            );

            dot.style.height = this.dotSize + 'px';
            dot.style.width  = this.dotSize + 'px';

            this.dots.push(dot);
            this.el.appendChild(dot);
        }

        // Animate one step
        this.animateDots();
    };

    Spinner.prototype.animateDots = function animateDots () {
        for (var i = 0; i < this.dots.length; i++) {
            this.dots[i].style.opacity = this.loOpacity;
        }

        if (this.currentDot == this.dots.length)
            { this.currentDot = 0; }

        this.dots[this.currentDot].style.opacity = this.hiOpacity;
        this.currentDot += 1;
    };

    return Spinner;
}(Element));

function removeHtml(s) {
    return s.replace(/&/g, '').replace(/</g, '').replace(/>/g, '');
}

function createEmText(choiceLabel, inputVal) {
    var label = removeHtml(choiceLabel);
    var len = inputVal.length;
    var emIndex = choiceLabel.toUpperCase().indexOf(inputVal.toUpperCase());

    if (emIndex < 0)
        { return label; }

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

var UnorderedList = /*@__PURE__*/(function (Element) {
    function UnorderedList(el, createItemMousedownEvt, createItemFn) {
        Element.call(this, el);
        this.createItemMousedownEvt = createItemMousedownEvt;

        // Use custom createItemFn or default to this.createListItem
        this.createItemFn = createItemFn || this.createListItem;

        this.applyClassList(['etto-ul']);
    }

    if ( Element ) UnorderedList.__proto__ = Element;
    UnorderedList.prototype = Object.create( Element && Element.prototype );
    UnorderedList.prototype.constructor = UnorderedList;

    UnorderedList.prototype.setInnerHtml = function setInnerHtml (html) {
        this.el.innerHTML = html;
    };

    UnorderedList.prototype.createListItem = function createListItem (choice, inputVal, isSelected) {
        return "<li class=\"" + (isSelected ? 'etto-selected ' : '') + "etto-li\"" +
                ' style="list-style-type: none; cursor: default"' +
                " data-label=\"" + (choice.label) + "\"" +
                " data-value=\"" + (choice.value) + "\"" +
            '>' +
                createEmText(choice.label, inputVal) +
            '</li>'
        ;
    };

    UnorderedList.prototype.populateList = function populateList (inputVal, list, selectedIndex) {
        this.setInnerHtml('');
        var html = '';

        // Build HTML
        for (var i = 0; i < list.length; i++) {
            var choice = list[i];
            var isSelected = i === selectedIndex;
            html += this.createItemFn(choice, inputVal, isSelected);
        }

        this.setInnerHtml(html);

        // Dynamically creates and adds event listeners to list items
        // Requires HTML5 data attributes
        for (var i$1 = 0; i$1 < this.el.children.length; i$1++) {
            var li = this.el.children[i$1];
            var choiceLabel = li.dataset.label;
            var choiceValue = li.dataset.value;
            var onMousedownEvt = this.createItemMousedownEvt(choiceLabel, choiceValue);
            li.addEventListener('mousedown', onMousedownEvt);
        }
    };

    return UnorderedList;
}(Element));

var Actions = function Actions(state) {
    this.state = state;
};

Actions.prototype.setSelected = function setSelected (selected) {
    this.state.selected = selected;
};

Actions.prototype.setCache = function setCache (cache) {
    this.state.cache = cache;
};

Actions.prototype.setInputVal = function setInputVal (inputVal) {
    this.state.inputVal = inputVal;
};

Actions.prototype.setChoices = function setChoices (choices) {
    this.state.choices = choices;
};

Actions.prototype.setFiltered = function setFiltered (filtered) {
    this.state.filtered = filtered;
};

Actions.prototype.setIsFetching = function setIsFetching (isFetching) {
    this.state.isFetching = isFetching;
};

Actions.prototype.setSpinnerTimer = function setSpinnerTimer (spinnerTimer) {
    this.state.spinnerTimer = spinnerTimer;
};

Actions.prototype.clearSpinnerTimer = function clearSpinnerTimer () {
    clearInterval(this.state.spinnerTimer);
};

Actions.prototype.setFetchTimer = function setFetchTimer (fetchTimer) {
    this.state.fetchTimer = fetchTimer;
};

Actions.prototype.clearFetchTimer = function clearFetchTimer () {
    clearTimeout(this.state.fetchTimer);
};

var MIN_CHARS = 3;
var MAX_RESULTS = 7;
var REQUEST_DELAY = 350;
var SPINNER_DOT_SIZE = 6;

var EttoService = function EttoService(root, config, choices) {
    /**
    * Configuration
    **/
    this.selectMode= config.selectMode|| false;
    this.source    = config.source    || undefined;
    this.minChars  = this.selectMode ? 0 : (config.minChars || MIN_CHARS);
    this.maxResults= config.maxResults|| MAX_RESULTS;
    this.requestDelay  = config.requestDelay  || REQUEST_DELAY;
    this.matchFullWord = config.matchFullWord || false;

    // Custom Functions
    this.createItemFn  = config.createItemFn  || undefined;
    this.filterFn  = config.filterFn  || filterChoices;

    /**
    * State Management
    **/
    var initialChoices = choices ? choices.map(choiceMap) : [];

    this.state = {
        isFetching: false,
        cache: config.initialCache || {},
        choices: initialChoices,
        filtered: this.selectMode ? initialChoices : [],
        inputVal: '',
        selected: null,
        spinnerTimer: null,
        fetchTimer: null
    };

    this.actions = new Actions(this.state);

    /**
    * Elements
    **/
    this.Input = new Input(document.createElement('input'),
        this.onInput.bind(this),
        this.onFocus.bind(this),
        this.onBlur.bind(this),
        this.onKeydown.bind(this),
        this.selectMode
    );

    this.UnorderedList = new UnorderedList(document.createElement('ul'),
        this.createItemMousedownEvt.bind(this),
        this.createItemFn
    );

    this.Dropdown = new Dropdown(document.createElement('div'));
    this.Dropdown.appendChild(this.UnorderedList.el);

    // Containers
    this.container = document.createElement('div');
    this.container.classList.add('etto-container');
    this.container.setAttribute('style', 'position: relative;');

    var inputContainer = document.createElement('div');
    inputContainer.setAttribute('style', 'position: relative;');
    inputContainer.appendChild(this.Input.el);

    this.container.appendChild(inputContainer);
    this.container.appendChild(this.Dropdown.el);

    this.root = root;
    this.root.appendChild(this.container);

    // Append spinner after appending container to calc appropriate offsetHeight
    var spinnerTopPosition = ((this.Input.offsetHeight / 2) - (SPINNER_DOT_SIZE / 2)) + 'px';

    this.Spinner = new Spinner(document.createElement('div'),
        SPINNER_DOT_SIZE,
        spinnerTopPosition
    );

    this.container.appendChild(this.Spinner.el);

    // Initial Render
    // this.render(this.state.inputVal, this.state.filtered);
};

var SPINNER_TIMER = 300;

var InputService = /*@__PURE__*/(function (EttoService) {
    function InputService(root, config, choices) {
        EttoService.call(this, root, config, choices);

        // Initial Render
        this.render(this.state.inputVal, this.state.filtered);
    }

    if ( EttoService ) InputService.__proto__ = EttoService;
    InputService.prototype = Object.create( EttoService && EttoService.prototype );
    InputService.prototype.constructor = InputService;

    InputService.prototype.render = function render (inputVal, filtered) {
        this.UnorderedList.populateList(inputVal, filtered, this.state.selected);
    };

    InputService.prototype.setShowDropdown = function setShowDropdown (showDropdown) {
        // DOM Update
        this.Dropdown.setDisplay(showDropdown ? 'block' : 'none');

        // Reset Selected if Dropdown has been hidden
        if (!showDropdown && this.state.selected)
            { this.actions.setSelected(null); }
    };

    InputService.prototype.fetchFromSource = function fetchFromSource (inputVal) {
        var this$1 = this;

        var key = inputVal.toUpperCase().trim();

        if (this.state.cache[key]) {
            this.onReceiveChoices(this.state.cache[key]);
        } else {
            if (this.state.fetchTimer) { this.actions.clearFetchTimer(); }

            this.actions.setFetchTimer(
                setTimeout(function () {
                    this$1.actions.setIsFetching(true);
                    this$1.actions.setSpinnerTimer(
                        setInterval(this$1.Spinner.animateDots.bind(this$1.Spinner), SPINNER_TIMER)
                    );

                    this$1.Spinner.setDisplay('flex');

                    this$1.source(inputVal, function (res) {
                        var obj;

                        var choices = res ? res.map(choiceMap) : [];

                        this$1.actions.setCache(Object.assign({}, this$1.state.cache, ( obj = {}, obj[key] = choices, obj )));
                        this$1.actions.setIsFetching(false);

                        this$1.Spinner.setDisplay('none');
                        this$1.actions.clearSpinnerTimer();

                        this$1.onReceiveChoices(choices);
                    });
                }, this.requestDelay)
            );
        }
    };

    InputService.prototype.onReceiveChoices = function onReceiveChoices (choices) {
        var filtered = this.filterFn(
            this.state.inputVal,
            choices,
            this.matchFullWord,
            this.maxResults
        );

        this.actions.setChoices(choices);
        this.actions.setFiltered(filtered);

        this.render(this.state.inputVal, filtered);
        this.setShowDropdown(filtered.length > 0);
    };

    InputService.prototype.createItemMousedownEvt = function createItemMousedownEvt (choiceLabel, choiceValue) {
        var this$1 = this;

        return function () {
            var filtered = this$1.filterFn(
                choiceValue,
                this$1.state.choices,
                this$1.matchFullWord,
                this$1.maxResults
            );

            this$1.actions.setInputVal(choiceValue);
            this$1.actions.setFiltered(filtered);

            this$1.render(choiceLabel, filtered);
            this$1.setShowDropdown(filtered.length > 0);

            this$1.Input.setValue(choiceValue);
            this$1.Input.focus();
        };
    };

    InputService.prototype.onInput = function onInput (e) {
        var inputVal = e.target.value;
        this.actions.setInputVal(inputVal);

        if (inputVal && inputVal.trim().length >= this.minChars) {
            if (this.source) { this.fetchFromSource(inputVal); }
            else { this.onReceiveChoices(this.state.choices); }
        } else {
            this.actions.setFiltered([]);
            this.render(inputVal, []);
            this.setShowDropdown(false);
        }
    };

    InputService.prototype.onFocus = function onFocus () {
        this.setShowDropdown(this.state.filtered.length > 0);
    };

    InputService.prototype.onBlur = function onBlur () {
        // Reset Selected
        if (this.state.selected) {
            this.actions.setSelected(null);
            this.render(this.state.inputVal, this.state.filtered);
        }

        this.setShowDropdown(false);
    };

    InputService.prototype.onKeydown = function onKeydown (e) {
        var isDropdownVisible = this.Dropdown.el.style.display === 'block';

        if ((e.keyCode == 38 || e.keyCode == 40) && isDropdownVisible) {
            e.preventDefault();

            // Decrement (Go Up)
            if (e.keyCode == 38) {
                if (this.state.selected === null)
                    { this.actions.setSelected(0); }
                else if (this.state.selected !== 0)
                    { this.actions.setSelected(this.state.selected - 1); }
            }

            // Increment (Go Down)
            if (e.keyCode == 40) {
                if (this.state.selected === null)
                    { this.actions.setSelected(0); }
                else if (this.state.selected !== this.state.filtered.length - 1)
                    { this.actions.setSelected(this.state.selected + 1); }
            }

            this.render(this.state.inputVal, this.state.filtered);
            this.setShowDropdown(this.state.filtered.length > 0);
        }

        // Enter or Tab
        if (e.keyCode == 9 || e.keyCode == 13) {
            if (isDropdownVisible) {
                e.preventDefault();
                var inputVal = undefined;

                if (this.state.selected !== null) {
                    var choice = this.state.filtered[this.state.selected];
                    inputVal = choice.label;

                    this.actions.setInputVal(inputVal);
                    this.actions.setSelected(null);

                    // Update DOM
                    this.Input.setValue(inputVal);

                    var filtered = this.filterFn(
                        inputVal,
                        this.state.choices,
                        this.matchFullWord,
                        this.maxResults
                    );

                    this.render(inputVal, filtered);
                    this.setShowDropdown(false);
                }
            }
        }
    };

    return InputService;
}(EttoService));

var SelectService = /*@__PURE__*/(function (EttoService) {
    function SelectService(root, config, choices) {
        EttoService.call(this, root, config, choices);
    }

    if ( EttoService ) SelectService.__proto__ = EttoService;
    SelectService.prototype = Object.create( EttoService && EttoService.prototype );
    SelectService.prototype.constructor = SelectService;

    return SelectService;
}(EttoService));

var Etto = function Etto(root, config, choices) {
    if (config.selectMode)
        { this.etto = new SelectService(root, config, choices); }
    else
        { this.etto = new InputService(root, config, choices); }
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

var etto_list = [
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
];

// for (let i = 0; i < 10000; i++) {
//     etto_list.push({ label: 'Alabama' });
// }

new Etto(document.getElementById('demo-2'), {
    // filterFn: (inputVal, choices, matchFullWord, maxResults) => {
    //     return [
    //         { label: 'banana', value: 'banana' },
    //         { label: 'apple', value: 'apple' }
    //     ];
    // }
}, etto_list);
//# sourceMappingURL=etto.cjs.js.map

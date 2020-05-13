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

var Element_1 = Element;

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
            style: ("box-sizing: border-box; cursor: " + (isSelectMode ? 'default' : 'text') + ";"),
            tabIndex: isSelectMode ? '-1' : '0'
        });

        this.addEventListener('input', onInput);
        this.addEventListener('focus', onFocus);
        this.addEventListener('blur', onBlur);
        this.addEventListener('keydown', onKeydown);
    }

    if ( Element ) Input.__proto__ = Element;
    Input.prototype = Object.create( Element && Element.prototype );
    Input.prototype.constructor = Input;

    var prototypeAccessors = { offsetHeight: { configurable: true },value: { configurable: true } };

    prototypeAccessors.offsetHeight.get = function () {
        return this.el.offsetHeight;
    };

    prototypeAccessors.value.get = function () {
        return this.el.value;
    };

    Input.prototype.setValue = function setValue (value) {
        this.el.value = value;
    };

    Input.prototype.setPlaceholder = function setPlaceholder (placeholder) {
        this.el.placeholder = placeholder;
    };

    Input.prototype.focus = function focus () {
        this.el.focus();
    };

    Input.prototype.blur = function blur () {
        this.el.blur();
    };

    Object.defineProperties( Input.prototype, prototypeAccessors );

    return Input;
}(Element_1));

var Input_1 = Input;

var Dropdown = /*@__PURE__*/(function (Element) {
    function Dropdown(el, isSelectMode) {
        Element.call(this, el);

        this.applyClassList(['etto-dropdown']);
        this.applyAttributes({
            style: "" + (isSelectMode ? 'max-height: 300px; ' : '') +
            "" + (isSelectMode ? 'overflow: hidden auto; ' : 'overflow: hidden; ') +
            'position: absolute; ' +
            'width: 100%; ' +
            'background-color: white; ' +
            'z-index: 99;'
        });

        // Hide by default
        this.hide();
    }

    if ( Element ) Dropdown.__proto__ = Element;
    Dropdown.prototype = Object.create( Element && Element.prototype );
    Dropdown.prototype.constructor = Dropdown;

    Dropdown.prototype.isVisible = function isVisible () {
        return this.el.style.display === 'block';
    };

    Dropdown.prototype.hide = function hide () {
        this.setDisplay('none');
    };

    Dropdown.prototype.show = function show () {
        this.setDisplay('block');
    };

    return Dropdown;
}(Element_1));

var Dropdown_1 = Dropdown;

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
            style: 'position: absolute; display: none; align-items: center; right: 2em;'
        });

        this.el.style.top = topPosition + "px";

        // Initialize Dots
        this.createDots();
        this.animateDots();
    }

    if ( Element ) Spinner.__proto__ = Element;
    Spinner.prototype = Object.create( Element && Element.prototype );
    Spinner.prototype.constructor = Spinner;

    Spinner.prototype.hide = function hide () {
        this.setDisplay('none');
    };

    Spinner.prototype.show = function show () {
        this.setDisplay('flex');
    };

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
}(Element_1));

var Spinner_1 = Spinner;

var ClearBtn = /*@__PURE__*/(function (Element) {
    function ClearBtn(
        el,
        btnHeight,
        clearBtnTopPosition,
        clickEvt
    ) {
        Element.call(this, el);

        this.applyClassList(['etto-clear-btn']);
        this.applyAttributes({
            style: 'opacity: 0.7; ' +
                'position: absolute; ' +
                'display: none; ' + 
                'align-items: center; ' +
                'right: 0.6em; ' +
                'cursor: pointer; ' +
                'font-family: sans-serif; ' +
                'font-size: 20px; ' +
                'font-weight: 400; ' +
                "height: " + btnHeight + "px; " +
                "top: " + clearBtnTopPosition + "px;"
        });

        this.addEventListener('click', clickEvt);

        this.el.innerHTML = '&times;';
    }

    if ( Element ) ClearBtn.__proto__ = Element;
    ClearBtn.prototype = Object.create( Element && Element.prototype );
    ClearBtn.prototype.constructor = ClearBtn;

    ClearBtn.prototype.show = function show () {
        this.el.style.display = 'flex';
    };

    ClearBtn.prototype.hide = function hide () {
        this.el.style.display = 'none';
    };

    return ClearBtn;
}(Element_1));

var ClearBtn_1 = ClearBtn;

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

var util = { removeHtml: removeHtml, createEmText: createEmText, filterChoices: filterChoices, choiceMap: choiceMap };

var createEmText$1 = util.createEmText;

var UnorderedList = /*@__PURE__*/(function (Element) {
    function UnorderedList(el, createItemMousedownEvt, createItemFn, customEmptyHtml) {
        Element.call(this, el);
        this.createItemMousedownEvt = createItemMousedownEvt;

        // Use custom createItemFn or default to this.createListItem
        this.createItemFn = createItemFn || this.createListItem;

        // Use custom emptyMsg
        this.emptyHtml = customEmptyHtml || '<em>No results.</em>';

        this.applyClassList(['etto-ul']);
    }

    if ( Element ) UnorderedList.__proto__ = Element;
    UnorderedList.prototype = Object.create( Element && Element.prototype );
    UnorderedList.prototype.constructor = UnorderedList;

    UnorderedList.prototype.setInnerHtml = function setInnerHtml (html) {
        this.el.innerHTML = html;
    };

    UnorderedList.prototype.createListItem = function createListItem (choice, inputVal, isHighlighted, isSelected) {
        var liClass = 'etto-li';
        if (isHighlighted) { liClass += ' etto-highlighted'; }
        if (isSelected) { liClass += ' etto-selected'; }

        return "<li class=\"" + liClass + "\"" +
                ' style="list-style-type: none; cursor: default"' +
                " data-label=\"" + (choice.label) + "\"" +
                " data-value=\"" + (choice.value) + "\"" +
            '>' +
                createEmText$1(choice.label, inputVal) +
            '</li>'
        ;
    };

    UnorderedList.prototype.populateList = function populateList (inputVal, list, highlightedIndex, selected) {
        this.setInnerHtml('');
        var html = '';

        var listLen = list.length;
        if (listLen > 0) {
            // Build HTML
            for (var i = 0; i < listLen; i++) {
                var isSelected = selected ? (list[i].value === selected.value) : false;
                var isHighlighted = i === highlightedIndex;
                html += this.createItemFn(list[i], inputVal, isHighlighted, isSelected);
            }

            this.setInnerHtml(html);

            // Iterate on newly created list items
            for (var i$1 = 0; i$1 < listLen; i$1++) {
                var li = this.el.children[i$1];
                li.addEventListener('mousedown', this.createItemMousedownEvt(list[i$1]));
            }
        } else {
            html += '<li class="etto-li etto-empty">' + this.emptyHtml + '</li>';
            this.setInnerHtml(html);
        }
    };

    return UnorderedList;
}(Element_1));

var UnorderedList_1 = UnorderedList;

var Actions = function Actions(state) {
    this.state = state;
};

Actions.prototype.setHighlighted = function setHighlighted (highlighted) {
    this.state.highlighted = highlighted;
};

Actions.prototype.setSelected = function setSelected (selected) {
    this.state.selected = selected;
};

Actions.prototype.setCache = function setCache (cache) {
    this.state.cache = cache;
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

var Actions_1 = Actions;

var filterChoices$1 = util.filterChoices;
var choiceMap$1 = util.choiceMap;

var MIN_CHARS = 3;
var MAX_RESULTS = 7;
var REQUEST_DELAY = 350;
var SPINNER_DOT_SIZE = 6;
var SPINNER_TIMER = 300;
var CLEAR_BTN_HEIGHT = 22;

var AbstractEttoService = function AbstractEttoService(root, config, choices) {
    /**
    * Configuration
    **/
    this.selectMode= config.selectMode|| false;
    this.source    = config.source    || undefined;
    this.minChars  = config.minChars  || MIN_CHARS;
    this.maxResults= config.maxResults|| MAX_RESULTS;
    this.requestDelay  = config.requestDelay  || REQUEST_DELAY;
    this.matchFullWord = config.matchFullWord || false;
    this.showEmptyMsg  = (config.showEmptyMsg !== undefined ? config.showEmptyMsg : true);

    // Custom Properties
    this.emptyHtml= config.emptyHtml|| undefined;
    this.createItemFn = config.createItemFn || undefined;
    this.filterFn = config.filterFn || filterChoices$1;
    this.onSelect = config.onSelect || undefined;

    /**
    * State Management
    **/
    var initialChoices = choices ? choices.map(choiceMap$1) : [];

    this.state = {
        isFetching: false,
        cache: config.initialCache || {},
        choices: initialChoices,
        filtered: [],
        selected: null,
        highlighted: null,
        spinnerTimer: null,
        fetchTimer: null
    };

    this.actions = new Actions_1(this.state);

    /**
    * Elements
    **/
    this.Input = new Input_1(document.createElement('input'),
        this.onInput.bind(this),
        this.onFocus.bind(this),
        this.onBlur.bind(this),
        this.onKeydown.bind(this),
        this.selectMode
    );

    this.UnorderedList = new UnorderedList_1(document.createElement('ul'),
        this.createItemMousedownEvt.bind(this),
        this.createItemFn,
        this.emptyHtml
    );

    this.Dropdown = new Dropdown_1(document.createElement('div'), this.selectMode);
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

    // Append Spinner
    var spinnerTopPosition = ((this.Input.offsetHeight / 2) - (SPINNER_DOT_SIZE / 2));

    this.Spinner = new Spinner_1(document.createElement('div'),
        SPINNER_DOT_SIZE,
        spinnerTopPosition
    );

    this.container.appendChild(this.Spinner.el);

    // Append Clear Btn
    var clearBtnTopPosition = ((this.Input.offsetHeight / 2) - (CLEAR_BTN_HEIGHT / 2));

    this.ClearBtn = new ClearBtn_1(document.createElement('div'),
        CLEAR_BTN_HEIGHT,
        clearBtnTopPosition,
        this.clear.bind(this)
    );

    this.container.appendChild(this.ClearBtn.el);
};

AbstractEttoService.prototype.render = function render (inputVal, filtered) {
    this.UnorderedList.populateList(
        inputVal,
        filtered,
        this.state.highlighted,
        this.state.selected
    );
};

AbstractEttoService.prototype.setShowDropdown = function setShowDropdown (showDropdown) {
    // DOM Update
    if (showDropdown) { this.Dropdown.show(); }
    else { this.Dropdown.hide(); }

    // Reset Highlighted if Dropdown has been hidden
    if (!showDropdown && this.state.highlighted)
        { this.actions.setHighlighted(null); }
};

AbstractEttoService.prototype.fetchFromSource = function fetchFromSource (inputVal) {
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

                this$1.Spinner.show();

                this$1.source(inputVal, function (res) {
                        var obj;

                    var choices = res ? res.map(choiceMap$1) : [];

                    this$1.actions.setCache(Object.assign({}, this$1.state.cache, ( obj = {}, obj[key] = choices, obj )));
                    this$1.actions.setIsFetching(false);

                    this$1.Spinner.hide();
                    this$1.actions.clearSpinnerTimer();

                    this$1.onReceiveChoices(choices);
                });
            }, this.requestDelay)
        );
    }
};

AbstractEttoService.prototype.onReceiveChoices = function onReceiveChoices (choices) {
    var filtered = this.filterFn(
        this.Input.value,
        choices,
        this.matchFullWord,
        this.maxResults
    );

    this.actions.setChoices(choices);
    this.actions.setFiltered(filtered);

    this.render(this.Input.value, filtered);

    if (this.showEmptyMsg)
        { this.setShowDropdown(true); }
    else
        { this.setShowDropdown(filtered.length > 0); }
};

AbstractEttoService.prototype.onKeydown = function onKeydown (e) {
    var isDropdownVisible = this.Dropdown.isVisible();

    if ((e.keyCode == 38 || e.keyCode == 40) && isDropdownVisible) {
        e.preventDefault();

        // Decrement (Up Key)
        if (e.keyCode == 38) {
            if (this.state.highlighted === null)
                { this.actions.setHighlighted(0); }
            else if (this.state.highlighted !== 0)
                { this.actions.setHighlighted(this.state.highlighted - 1); }
        }

        // Increment (Down Key)
        if (e.keyCode == 40) {
            if (this.state.highlighted === null)
                { this.actions.setHighlighted(0); }
            else if (this.state.highlighted !== this.state.filtered.length - 1)
                { this.actions.setHighlighted(this.state.highlighted + 1); }
        }

        this.render(this.Input.value, this.state.filtered);
        this.setShowDropdown(this.state.filtered.length > 0);

        var highlightedItem = this.UnorderedList.el.getElementsByClassName('etto-highlighted')[0];
        if (highlightedItem !== undefined && highlightedItem !== null) {
            try { highlightedItem.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
            catch (TypeError) { /** jsdom **/ }
        }
    }

    // Enter or Tab
    if (e.keyCode == 9 || e.keyCode == 13) {
        if (isDropdownVisible) {
            e.preventDefault();

            if (this.state.highlighted !== null) {
                var choice = this.state.filtered[this.state.highlighted];
                this.onSelection(choice);
            }
        }
    }
};

var AbstractEttoService_1 = AbstractEttoService;

var InputService = /*@__PURE__*/(function (AbstractEttoService) {
    function InputService(root, config, choices) {
        AbstractEttoService.call(this, root, config, choices);

        // Initial Render
        this.render(this.Input.value, this.state.filtered);
    }

    if ( AbstractEttoService ) InputService.__proto__ = AbstractEttoService;
    InputService.prototype = Object.create( AbstractEttoService && AbstractEttoService.prototype );
    InputService.prototype.constructor = InputService;

    InputService.prototype.clear = function clear () {
        this.actions.setSelected(null);
        this.actions.setFiltered([]);

        this.Input.setValue('');
        this.ClearBtn.hide();
        this.render(this.Input.value, this.state.filtered);
    };

    InputService.prototype.onInput = function onInput (e) {
        var inputVal = e.target.value;

        if (inputVal) { this.ClearBtn.show(); }
        else { this.ClearBtn.hide(); }

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
        // Reset Highlighted
        if (this.state.highlighted !== null) {
            this.actions.setHighlighted(null);
            this.render(this.Input.value, this.state.filtered);
        }

        this.setShowDropdown(false);
    };

    InputService.prototype.onSelection = function onSelection (choice) {
        var filtered = this.filterFn(
            choice.label,
            this.state.choices,
            this.matchFullWord,
            this.maxResults
        );

        this.Input.setValue(choice.value);

        this.actions.setFiltered(filtered);
        this.actions.setHighlighted(null);

        this.render(choice.label, filtered);
        this.setShowDropdown(false);

        // Custom onSelect callback
        if (this.onSelect) { this.onSelect(choice); }
    };

    InputService.prototype.createItemMousedownEvt = function createItemMousedownEvt (choice) {
        var this$1 = this;

        return function () {
            this$1.onSelection(choice);
            this$1.Input.focus();
        };
    };

    return InputService;
}(AbstractEttoService_1));

var InputService_1 = InputService;

var SelectService = /*@__PURE__*/(function (AbstractEttoService) {
    function SelectService(root, config, choices) {
        AbstractEttoService.call(this, root, config, choices);

        // SelectService filtered should be populated by default
        this.actions.setFiltered(this.state.choices);

        // Initial Render
        this.render(this.Input.value, this.state.filtered);
    }

    if ( AbstractEttoService ) SelectService.__proto__ = AbstractEttoService;
    SelectService.prototype = Object.create( AbstractEttoService && AbstractEttoService.prototype );
    SelectService.prototype.constructor = SelectService;

    SelectService.prototype.clear = function clear () {
        this.actions.setSelected(null);
        this.Input.setPlaceholder('');
        this.Input.setValue('');
        this.ClearBtn.hide();
        this.render(this.Input.value, this.state.filtered);
    };

    SelectService.prototype.onInput = function onInput (e) {
        var inputVal = e.target.value;

        if (inputVal) { this.ClearBtn.show(); }
        else { this.ClearBtn.hide(); }

        if (inputVal) {
            if (this.source) { this.fetchFromSource(inputVal); }
            else { this.onReceiveChoices(this.state.choices); }
        } else {
            this.actions.setFiltered(this.state.choices);
            this.render(inputVal, this.state.filtered);
            this.setShowDropdown(true);
        }
    };

    SelectService.prototype.onFocus = function onFocus () {
        this.Input.setValue('');
        this.setShowDropdown(true);
    };

    SelectService.prototype.onBlur = function onBlur () {
        if (!this.state.selected) {
            this.Input.setValue('');
            this.ClearBtn.hide();
        } else {
            this.Input.setValue(this.state.selected.value);
            this.ClearBtn.show();
        }

        // Reset List
        this.actions.setFiltered(this.state.choices);
        this.render(this.Input.value, this.state.filtered);
        this.setShowDropdown(false);
    };

    SelectService.prototype.onSelection = function onSelection (choice) {
        var this$1 = this;

        setTimeout(function () {
            this$1.Input.setValue(choice.value);
            this$1.Input.setPlaceholder(choice.value);
        });

        this.actions.setFiltered(this.state.choices);
        this.actions.setHighlighted(null);
        this.actions.setSelected(choice);

        this.render(choice.label, this.state.filtered);
        this.setShowDropdown(false);

        this.ClearBtn.show();
        this.Input.blur();

        // Custom onSelect callback
        if (this.onSelect) { this.onSelect(choice); }
    };

    SelectService.prototype.createItemMousedownEvt = function createItemMousedownEvt (choice) {
        var this$1 = this;

        return function () {
            this$1.onSelection(choice);
        };
    };

    return SelectService;
}(AbstractEttoService_1));

var SelectService_1 = SelectService;

var Etto = function Etto(root, config, choices) {
    if (config.selectMode) {
        this.service = new SelectService_1(root, config, choices);
    } else {
        this.service = new InputService_1(root, config, choices);
    }
};

var src = Etto;

export default src;

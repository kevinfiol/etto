class Element {
    constructor(el) {
        this.el = el;
        this.listeners = {};
    }

    addEventListener(event, callback) {
        if (!(event in this.listeners)) {
            this.listeners[event] = callback;
            this.el.addEventListener(event, callback);
        } else {
            console.warn('Cannot add multiple event listeners to Etto Element');
        }
    }

    removeEventListener(event) {
        if (event in this.listeners) {
            this.el.removeEventListener(event, this.listeners[event], false);
            delete this.listeners[event];
        }
    }

    removeAllEvents() {
        for (const event in this.listeners) {
            this.removeEventListener(event);
        }
    }

    applyClassList(classList) {
        for (let i = 0; i < classList.length; i++) {
            this.el.classList.add(classList[i]);
        }
    }

    applyAttributes(attributes) {
        for (let key in attributes) {
            this.el.setAttribute(key, attributes[key]);
        }
    }

    appendChild(child) {
        this.el.appendChild(child);
    }

    setDisplay(display) {
        this.el.style.display = display;
    }
}

class Input extends Element {
    constructor(
        el,
        onInput,
        onFocus,
        onBlur,
        onKeydown,
        onValue,
        isSelectMode
    ) {
        super(el);

        this.applyClassList(['etto-input']);
        this.applyAttributes({
            autocomplete: 'off',
            value: '',
            style: `box-sizing: border-box; cursor: ${isSelectMode ? 'default' : 'text'};`,
            tabIndex: isSelectMode ? '-1' : '0'
        });

        this.onValue = onValue;
        this.addEventListener('input', onInput);
        this.addEventListener('focus', onFocus);
        this.addEventListener('blur', onBlur);
        this.addEventListener('keydown', onKeydown);
    }

    get offsetHeight() {
        return this.el.offsetHeight;
    }

    get value() {
        return this.el.value;
    }

    setValue(value) {
        this.el.value = value;
        if (this.onValue) this.onValue(value); // custom callback
    }

    setPlaceholder(placeholder) {
        this.el.placeholder = placeholder;
    }

    focus() {
        this.el.focus();
    }

    blur() {
        this.el.blur();
    }

    setCursorToEnd() {
        this.el.selectionStart = this.el.selectionEnd = this.el.value.length;
    }
}

class Dropdown extends Element {
    constructor(el, isSelectMode) {
        super(el);

        this.applyClassList(['etto-dropdown']);
        this.applyAttributes({
            style: `${isSelectMode ? 'max-height: 300px; ' : ''}` +
            `${isSelectMode ? 'overflow: hidden auto; ' : 'overflow: hidden; '}` +
            'position: absolute; ' +
            'width: 100%; ' +
            'z-index: 99;'
        });

        // Hide by default
        this.hide();
    }

    isVisible() {
        return this.el.style.display === 'block';
    }

    hide() {
        this.setDisplay('none');
    }

    show() {
        this.setDisplay('block');
    }
}

class Spinner extends Element {
    constructor(
        el,
        dotSize
    ) {
        super(el);

        this.dotSize = dotSize || 6;
        this.dots = [];
        this.currentDot = 0;

        this.loOpacity = '0.3';
        this.hiOpacity = '0.7';

        this.applyClassList(['etto-spinner']);
        this.applyAttributes({
            style: 'position: absolute; display: none; align-items: center; right: 2rem;'
        });

        // Initialize Dots
        this.createDots();
        this.animateDots();
    }

    hide() {
        this.setDisplay('none');
    }

    show() {
        this.setDisplay('flex');
    }

    createDots() {
        // Create Dots
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
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
    }

    animateDots() {
        for (let i = 0; i < this.dots.length; i++) {
            this.dots[i].style.opacity = this.loOpacity;
        }

        if (this.currentDot == this.dots.length)
            this.currentDot = 0;

        this.dots[this.currentDot].style.opacity = this.hiOpacity;
        this.currentDot += 1;
    }
}

class ClearBtn extends Element {
    constructor(
        el,
        clickEvt
    ) {
        super(el);

        this.applyClassList(['etto-clear-btn']);
        this.applyAttributes({
            style: 'opacity: 0.7; ' +
                'position: absolute; ' +
                'display: none; ' + 
                'right: 0.8rem; ' +
                'cursor: pointer; ' +
                'font-family: sans-serif; ' +
                'font-size: 20px; ' +
                'font-weight: 400; '
        });

        this.addEventListener('click', clickEvt);

        this.el.innerHTML = '&times;';
    }

    show() {
        this.el.style.display = 'flex';
    }

    hide() {
        this.el.style.display = 'none';
    }
}

function removeHtml(s) {
    return s.replace(/&/g, '').replace(/</g, '').replace(/>/g, '');
}

function createEmText(choiceLabel, inputVal) {
    const label = removeHtml(choiceLabel);
    const len = inputVal.length;
    const emIndex = choiceLabel.toUpperCase().indexOf(inputVal.toUpperCase());

    if (emIndex < 0)
        return label;

    const beg = label.slice(0, emIndex);
    const mid = label.slice(emIndex, emIndex + len);
    const end = label.slice(emIndex + len);

    return `${ beg }<b>${ mid }</b>${ end }`;
}

function filterChoices(inputVal, choices, matchFullWord, maxResults) {
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

function choiceMap(choice) {
    return Object.assign({}, choice, {
        label: choice.label,
        value: (choice.value !== undefined && choice.value !== null) 
            ? choice.value
            : choice.label
    });
}

class UnorderedList extends Element {
    constructor(el, itemMouseDownEvt, createItemFn, customEmptyHtml) {
        super(el);
        this.itemMouseDownEvt = itemMouseDownEvt;

        // Use custom createItemFn or default to this.createListItem
        this.createItemFn = createItemFn || this.createListItem;

        // Use custom emptyMsg
        this.emptyHtml = customEmptyHtml || '<em>No results.</em>';

        this.applyClassList(['etto-ul']);
    }

    setInnerHtml(html) {
        this.el.innerHTML = html;
    }

    createListItem(choice, index, inputVal, isHighlighted, isSelected) {
        let liClass = 'etto-li';
        if (isHighlighted) liClass += ' etto-highlighted';
        if (isSelected) liClass += ' etto-selected';

        return `<li class="${liClass}"` +
                ' style="list-style-type: none; cursor: default"' +
                ` data-label="${choice.label}"` +
                ` data-value="${choice.value}"` +
                ` data-index="${index}"` +
            '>' +
                createEmText(choice.label, inputVal) +
            '</li>'
        ;
    }

    populateList(inputVal, list, highlightedIndex, selected) {
        this.setInnerHtml('');
        let html = '';

        const listLen = list.length;
        if (listLen > 0) {
            // Build HTML
            for (let i = 0; i < listLen; i++) {
                const isSelected = selected ? (list[i].value === selected.value) : false;
                const isHighlighted = i === highlightedIndex;
                html += this.createItemFn(list[i], i, inputVal, isHighlighted, isSelected);
            }

            this.setInnerHtml(html);
            this.removeEventListener('mousedown'); // remove old event listener if exists
            this.addEventListener('mousedown', ev => {
                this.itemMouseDownEvt(list[ev.target.dataset.index]);
            });
        } else {
            html += '<li class="etto-li etto-empty">' + this.emptyHtml + '</li>';
            this.setInnerHtml(html);
        }
    }
}

class Actions {
    constructor(state) {
        this.state = state;
    }

    setHighlighted(highlighted) {
        this.state.highlighted = highlighted;
    }

    setSelected(selected) {
        this.state.selected = selected;
    }

    setCache(cache) {
        this.state.cache = cache;
    }

    setChoices(choices) {
        this.state.choices = choices;
    }

    setFiltered(filtered) {
        this.state.filtered = filtered;
    }

    setIsFetching(isFetching) {
        this.state.isFetching = isFetching;
    }

    setSpinnerTimer(spinnerTimer) {
        this.state.spinnerTimer = spinnerTimer;
    }

    clearSpinnerTimer() {
        clearInterval(this.state.spinnerTimer);
    }

    setFetchTimer(fetchTimer) {
        this.state.fetchTimer = fetchTimer;
    }

    clearFetchTimer() {
        clearTimeout(this.state.fetchTimer);
    }
}

const MIN_CHARS = 3;
const MAX_RESULTS = 7;
const REQUEST_DELAY = 350;
const SPINNER_DOT_SIZE = 6;
const SPINNER_TIMER = 300;

class AbstractEttoService {
    constructor(root, config, choices) {
        /**
        * Configuration
        **/
        this.selectMode        = config.selectMode    || false;
        this.source            = config.source        || undefined;
        this.minChars          = config.minChars      || MIN_CHARS;
        this.maxResults        = config.maxResults    || MAX_RESULTS;
        this.requestDelay      = config.requestDelay  || REQUEST_DELAY;
        this.matchFullWord     = config.matchFullWord || false;
        this.showEmptyMsg      = (config.showEmptyMsg !== undefined ? config.showEmptyMsg : true);
        this.initialCache      = config.initialCache || {}; // initial cache for ajax results
        this.selectPlaceholder = config.selectPlaceholder || 'Select...';

        // Custom Properties
        this.emptyHtml    = config.emptyHtml    || undefined;
        this.createItemFn = config.createItemFn || undefined;
        this.filterFn     = config.filterFn     || filterChoices;
        this.onSelect     = config.onSelect     || undefined;
        this.onClear      = config.onClear      || undefined;
        this.onValue      = config.onValue      || undefined;

        /**
        * State Management
        **/
        const initialChoices = choices ? choices.map(choiceMap) : [];

        this.state = {
            isFetching: false,
            cache: this.initialCache,
            choices: initialChoices,
            filtered: [],
            selected: null,
            highlighted: null,
            spinnerTimer: null,
            fetchTimer: null
        };

        this.actions = new Actions(this.state);

        /**
        * Elements
        **/
        this.Input = new Input(
            document.createElement('input'),
            this.onInput.bind(this),
            this.onFocus.bind(this),
            this.onBlur.bind(this),
            this.onKeydown.bind(this),
            this.onValue,
            this.selectMode
        );

        this.Spinner = new Spinner(
            document.createElement('div'),
            SPINNER_DOT_SIZE
        );

        this.ClearBtn = new ClearBtn(
            document.createElement('div'),
            this.clear.bind(this)
        );

        this.UnorderedList = new UnorderedList(
            document.createElement('ul'),
            this.itemMouseDownEvt.bind(this),
            this.createItemFn,
            this.emptyHtml
        );

        this.Dropdown = new Dropdown(document.createElement('div'), this.selectMode);
        this.Dropdown.appendChild(this.UnorderedList.el);

        // Containers
        this.container = document.createElement('div');
        this.container.classList.add('etto-container');
        this.container.setAttribute('style', 'position: relative;');

        const inputContainer = document.createElement('div');
        inputContainer.classList.add('etto-input-container');
        inputContainer.setAttribute('style', 'position: relative;');
        inputContainer.appendChild(this.Input.el);
        inputContainer.appendChild(this.ClearBtn.el);
        inputContainer.appendChild(this.Spinner.el);

        this.container.appendChild(inputContainer);
        this.container.appendChild(this.Dropdown.el);

        this.root = root;
        this.root.appendChild(this.container);
    }

    render(inputVal, filtered) {
        this.UnorderedList.populateList(
            inputVal,
            filtered,
            this.state.highlighted,
            this.state.selected
        );
    }

    setShowDropdown(showDropdown) {
        // DOM Update
        if (showDropdown) this.Dropdown.show();
        else this.Dropdown.hide();

        // Reset Highlighted if Dropdown has been hidden
        if (!showDropdown && this.state.highlighted)
            this.actions.setHighlighted(null);
    }

    fetchFromSource(inputVal) {
        const key = inputVal.toUpperCase().trim();

        if (this.state.cache[key]) {
            this.onReceiveChoices(this.state.cache[key]);
        } else {
            if (this.state.fetchTimer) this.actions.clearFetchTimer();

            this.actions.setFetchTimer(
                setTimeout(() => {
                    this.actions.setIsFetching(true);
                    this.actions.setSpinnerTimer(
                        setInterval(this.Spinner.animateDots.bind(this.Spinner), SPINNER_TIMER)
                    );

                    this.Spinner.show();

                    this.source(inputVal, res => {
                        const choices = res ? res.map(choiceMap) : [];

                        this.actions.setCache({ ...this.state.cache, [key]: choices });
                        this.actions.setIsFetching(false);

                        this.Spinner.hide();
                        this.actions.clearSpinnerTimer();

                        this.onReceiveChoices(choices);
                    });
                }, this.requestDelay)
            );
        }
    }

    onReceiveChoices(choices) {
        const filtered = this.filterFn(
            this.Input.value,
            choices,
            this.matchFullWord,
            this.maxResults
        );

        this.actions.setChoices(choices);
        this.actions.setFiltered(filtered);

        this.render(this.Input.value, filtered);

        if (this.showEmptyMsg)
            this.setShowDropdown(true);
        else
            this.setShowDropdown(filtered.length > 0);
    }

    onKeydown(e) {
        let isDropdownVisible = this.Dropdown.isVisible();

        if ((e.keyCode == 38 || e.keyCode == 40) && isDropdownVisible) {
            e.preventDefault();

            // Decrement (Up Key)
            if (e.keyCode == 38) {
                if (this.state.highlighted === null)
                    this.actions.setHighlighted(0);
                else if (this.state.highlighted !== 0)
                    this.actions.setHighlighted(this.state.highlighted - 1);
            }

            // Increment (Down Key)
            if (e.keyCode == 40) {
                if (this.state.highlighted === null)
                    this.actions.setHighlighted(0);
                else if (this.state.highlighted !== this.state.filtered.length - 1)
                    this.actions.setHighlighted(this.state.highlighted + 1);
            }

            this.render(this.Input.value, this.state.filtered);
            this.setShowDropdown(this.state.filtered.length > 0);

            const highlightedItem = this.UnorderedList.el.getElementsByClassName('etto-highlighted')[0];
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
                    const choice = this.state.filtered[this.state.highlighted];
                    this.onSelection(choice);
                }
            }
        }
    }
}

class InputService extends AbstractEttoService {
    constructor(root, config, choices) {
        super(root, config, choices);

        // Initial Render
        this.render(this.Input.value, this.state.filtered);
    }

    clear() {
        this.actions.setSelected(null);
        this.actions.setFiltered([]);
        this.Input.setValue('');
        this.ClearBtn.hide();
        this.render(this.Input.value, this.state.filtered);

        if (this.onClear) this.onClear();
    }

    onInput(e) {
        const inputVal = e.target.value;
        if (this.onValue) this.onValue(inputVal); // custom callback

        if (inputVal) this.ClearBtn.show();
        else this.ClearBtn.hide();

        if (inputVal && inputVal.trim().length >= this.minChars) {
            if (this.source) this.fetchFromSource(inputVal);
            else this.onReceiveChoices(this.state.choices);
        } else {
            this.actions.setFiltered([]);
            this.render(inputVal, []);
            this.setShowDropdown(false);
        }
    }

    onFocus() {
        this.setShowDropdown(this.state.filtered.length > 0);
        this.Input.setCursorToEnd();
    }

    onBlur() {
        // Reset Highlighted
        if (this.state.highlighted !== null) {
            this.actions.setHighlighted(null);
            this.render(this.Input.value, this.state.filtered);
        }

        this.setShowDropdown(false);
    }

    onSelection(choice) {
        const filtered = this.filterFn(
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
        if (this.onSelect) this.onSelect(choice);
    }

    itemMouseDownEvt(choice) {
        this.onSelection(choice);
        this.Input.focus();
    }
}

class SelectService extends AbstractEttoService {
    constructor(root, config, choices) {
        super(root, config, choices);

        // SelectService filtered should be populated by default
        this.actions.setFiltered(this.state.choices);

        // add this to imitate select box hiding on second click
        this.Input.addEventListener('mousedown', () => {
            if (this.Dropdown.isVisible()) this.Dropdown.hide();
            else this.Dropdown.show();
        });

        this.Input.setPlaceholder(this.selectPlaceholder);

        // Initial Render
        this.render(this.Input.value, this.state.filtered);
    }

    clear() {
        this.actions.setSelected(null);
        this.Input.setPlaceholder(this.selectPlaceholder);
        this.Input.setValue('');
        this.ClearBtn.hide();
        this.render(this.Input.value, this.state.filtered);

        if (this.onClear) this.onClear();
    }

    onInput(e) {
        const inputVal = e.target.value;
        if (this.onValue) this.onValue(inputVal); // custom callback

        if (inputVal) this.ClearBtn.show();
        else this.ClearBtn.hide();

        if (inputVal) {
            if (this.source) this.fetchFromSource(inputVal);
            else this.onReceiveChoices(this.state.choices);
        } else {
            this.actions.setFiltered(this.state.choices);
            this.render(inputVal, this.state.filtered);
            this.setShowDropdown(true);
        }
    }

    onFocus() {
        if (this.Input.value !== '')
            this.Input.setValue('');
        this.setShowDropdown(true);
    }

    onBlur() {
        if (!this.state.selected) {
            if (this.Input.value !== '')
                this.Input.setValue('');
            this.ClearBtn.hide();
        } else {
            setTimeout(() => {
                if (this.state.selected.value && this.Input.value.trim() !== this.state.selected.value)
                    this.Input.setValue(this.state.selected.value);
            });

            this.ClearBtn.show();
        }

        // Reset List
        this.actions.setFiltered(this.state.choices);
        this.render(this.Input.value, this.state.filtered);
        this.setShowDropdown(false);
    }

    onSelection(choice) {
        this.Input.setValue(choice.value);
        this.Input.setPlaceholder(choice.value);

        this.actions.setFiltered(this.state.choices);
        this.actions.setHighlighted(null);
        this.actions.setSelected(choice);

        this.render(choice.label, this.state.filtered);
        this.setShowDropdown(false);

        this.ClearBtn.show();
        this.Input.blur();

        // Custom onSelect callback
        if (this.onSelect) this.onSelect(choice);
    }

    itemMouseDownEvt(choice) {
        this.onSelection(choice);
    }
}

class Etto {
    constructor(root, config, choices) {
        if (config.selectMode) {
            this.service = new SelectService(root, config, choices);
        } else {
            this.service = new InputService(root, config, choices);
        }
    }

    get value() {
        return this.service.Input.value;
    }

    set value(value) {
        this.service.Input.setValue(value);
    }

    get selected() {
        return this.service.state.selected;
    }

    clear() {
        this.service.clear();
    }

    destroy() {
        this.service.Input.removeAllEvents();
        this.service.ClearBtn.removeAllEvents();
        this.service.Dropdown.removeAllEvents();
        this.service.UnorderedList.removeAllEvents();
        delete this.service;
    }
}

export default Etto;

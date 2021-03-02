import Input from './components/Input.js';
import Dropdown from './components/Dropdown.js';
import Spinner from './components/Spinner.js';
import ClearBtn from './components/ClearBtn.js';
import UnorderedList from './components/UnorderedList.js';
import Actions from './Actions.js';
import { filterChoices, choiceMap } from './util.js';

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

export default AbstractEttoService;
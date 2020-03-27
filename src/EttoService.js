import Input from './components/Input';
import Dropdown from './components/Dropdown';
import Spinner from './components/Spinner';
import UnorderedList from './components/UnorderedList';
import Actions from './Actions';
import { filterChoices, choiceMap } from './util';

const MIN_CHARS = 3;
const MAX_RESULTS = 7;
const REQUEST_DELAY = 350;
const SPINNER_DOT_SIZE = 6;

class EttoService {
    constructor(root, config, choices) {
        /**
        * Configuration
        **/
        this.selectMode    = config.selectMode    || false;
        this.source        = config.source        || undefined;
        this.minChars      = config.minChars      || MIN_CHARS;
        this.maxResults    = config.maxResults    || MAX_RESULTS;
        this.requestDelay  = config.requestDelay  || REQUEST_DELAY;
        this.matchFullWord = config.matchFullWord || false;

        // Custom Functions
        this.createItemFn  = config.createItemFn  || undefined;
        this.filterFn      = config.filterFn      || filterChoices;

        /**
        * State Management
        **/
        const initialChoices = choices ? choices.map(choiceMap) : [];

        this.state = {
            isFetching: false,
            cache: config.initialCache || {},
            choices: initialChoices,
            filtered: this.selectMode ? initialChoices : [],
            inputVal: '',
            selected: null,
            highlighted: null,
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

        const inputContainer = document.createElement('div');
        inputContainer.setAttribute('style', 'position: relative;');
        inputContainer.appendChild(this.Input.el);

        this.container.appendChild(inputContainer);
        this.container.appendChild(this.Dropdown.el);

        this.root = root;
        this.root.appendChild(this.container);

        // Append spinner after appending container to calc appropriate offsetHeight
        const spinnerTopPosition = ((this.Input.offsetHeight / 2) - (SPINNER_DOT_SIZE / 2)) + 'px';

        this.Spinner = new Spinner(document.createElement('div'),
            SPINNER_DOT_SIZE,
            spinnerTopPosition
        );

        this.container.appendChild(this.Spinner.el);
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
            this.state.inputVal,
            choices,
            this.matchFullWord,
            this.maxResults
        );

        this.actions.setChoices(choices);
        this.actions.setFiltered(filtered);

        this.render(this.state.inputVal, filtered);
        this.setShowDropdown(filtered.length > 0);
    }

    onKeydown(e) {
        let isDropdownVisible = this.Dropdown.isVisible();

        if ((e.keyCode == 38 || e.keyCode == 40) && isDropdownVisible) {
            e.preventDefault();

            // Decrement (Go Up)
            if (e.keyCode == 38) {
                if (this.state.highlighted === null)
                    this.actions.setHighlighted(0);
                else if (this.state.highlighted !== 0)
                    this.actions.setHighlighted(this.state.highlighted - 1);
            }

            // Increment (Go Down)
            if (e.keyCode == 40) {
                if (this.state.highlighted === null)
                    this.actions.setHighlighted(0);
                else if (this.state.highlighted !== this.state.filtered.length - 1)
                    this.actions.setHighlighted(this.state.highlighted + 1);
            }

            this.render(this.state.inputVal, this.state.filtered);
            this.setShowDropdown(this.state.filtered.length > 0);
        }

        // Enter or Tab
        if (e.keyCode == 9 || e.keyCode == 13) {
            if (isDropdownVisible) {
                e.preventDefault();
                let inputVal = undefined;

                if (this.state.highlighted !== null) {
                    const choice = this.state.filtered[this.state.highlighted];
                    inputVal = choice.label;

                    this.actions.setInputVal(inputVal);
                    this.actions.setHighlighted(null);

                    // Update DOM
                    this.Input.setValue(inputVal);

                    const filtered = this.filterFn(
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
    }
}

export default EttoService;
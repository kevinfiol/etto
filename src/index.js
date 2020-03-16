import Input from './components/Input';
import Dropdown from './components/Dropdown';
import Spinner from './components/Spinner';
import UnorderedList from './components/UnorderedList';

import EttoActions from './EttoActions';
import { filterChoices, choiceMap } from './util';

const MIN_CHARS = 3;
const MAX_RESULTS = 7;
const REQUEST_DELAY = 350;
const SPINNER_DOT_SIZE = 6;
const SPINNER_TIMER = 300;

class Etto {
    constructor(root, config, choices) {
        this.state = {
            isFetching: false,
            cache: config.initialCache || {},
            choices: choices ? choices.map(choiceMap) : [],
            filtered: [],
            inputVal: '',
            selected: null,
            spinnerTimer: null,
            fetchTimer: null
        };

        this.actions = new EttoActions(this.state);

        this.selectMode    = config.selectMode    || false;
        this.source        = config.source        || undefined;
        this.minChars      = config.minChars      || MIN_CHARS;
        this.maxResults    = config.maxResults    || MAX_RESULTS;
        this.requestDelay  = config.requestDelay  || REQUEST_DELAY;
        this.matchFullWord = config.matchFullWord || false;
        this.createItemFn  = config.createItemFn  || undefined;

        this.Input = new Input(document.createElement('input'),
            this.onInput.bind(this),
            this.onFocus.bind(this),
            this.onBlur.bind(this),
            this.onKeydown.bind(this)
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

        // Initial Render
        this.render(this.state.inputVal, this.state.filtered);
    }

    render(inputVal, filtered) {
        this.UnorderedList.populateList(inputVal, filtered, this.state.selected);
    }

    setShowDropdown(showDropdown) {
        // DOM Update
        this.Dropdown.setDisplay(showDropdown ? 'block' : 'none');

        // Reset Selected if Dropdown has been hidden
        if (!showDropdown && this.state.selected)
            this.actions.setSelected(null);
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
                    this.actions.setSpinnerTimer(setInterval(this.Spinner.animateDots.bind(this.Spinner), SPINNER_TIMER));
                    this.Spinner.setDisplay('flex');

                    this.source(inputVal, res => {
                        const choices = res ? res.map(choiceMap) : [];

                        this.actions.setCache({ ...this.state.cache, [key]: choices });
                        this.actions.setIsFetching(false);

                        this.Spinner.setDisplay('none');
                        this.actions.clearSpinnerTimer();

                        this.onReceiveChoices(choices);
                    });
                }, this.requestDelay)
            );
        }
    }

    onReceiveChoices(choices) {
        const filtered = filterChoices(
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

    createItemMousedownEvt(choiceLabel, choiceValue) {
        return () => {
            const filtered = filterChoices(
                choiceValue,
                this.state.choices,
                this.matchFullWord,
                this.maxResults
            );

            this.actions.setInputVal(choiceValue);
            this.actions.setFiltered(filtered);

            this.render(choiceLabel, filtered);
            this.setShowDropdown(filtered.length > 0);

            this.Input.setValue(choiceValue);
            this.Input.focus();
        };
    }

    onInput(e) {
        const inputVal = e.target.value;
        this.actions.setInputVal(inputVal);

        if (inputVal && inputVal.trim().length >= this.minChars) {
            if (this.source) this.fetchFromSource(inputVal);
            else this.onReceiveChoices(this.state.choices);
        } else {
            this.render(inputVal, []);
            this.setShowDropdown(false);
        }
    }

    onFocus() {
        this.setShowDropdown(this.state.filtered.length > 0);
    }

    onBlur() {
        // Reset Selected
        if (this.state.selected) {
            this.actions.setSelected(null);
            this.render(this.state.inputVal, this.state.filtered);
        }

        this.setShowDropdown(false);
    }

    onKeydown(e) {
        let isDropdownVisible = this.Dropdown.el.style.display === 'block';

        if ((e.keyCode == 38 || e.keyCode == 40) && isDropdownVisible) {
            e.preventDefault();

            // Decrement (Go Up)
            if (e.keyCode == 38) {
                if (this.state.selected === null)
                    this.actions.setSelected(0);
                else if (this.state.selected !== 0)
                    this.actions.setSelected(this.state.selected - 1);
            }

            // Increment (Go Down)
            if (e.keyCode == 40) {
                if (this.state.selected === null)
                    this.actions.setSelected(0);
                else if (this.state.selected !== this.state.filtered.length - 1)
                    this.actions.setSelected(this.state.selected + 1);
            }

            this.render(this.state.inputVal, this.state.filtered);
            this.setShowDropdown(this.state.filtered.length > 0);
        }

        // Enter or Tab
        if (e.keyCode == 9 || e.keyCode == 13) {
            if (isDropdownVisible) {
                e.preventDefault();
                let inputVal = undefined;

                if (this.state.selected !== null) {
                    const choice = this.state.filtered[this.state.selected];
                    inputVal = choice.label;

                    this.actions.setInputVal(inputVal);
                    this.actions.setSelected(null);

                    // Update DOM
                    this.Input.setValue(inputVal);

                    const filtered = filterChoices(
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

let xhr = null;
const source = function(query, done) {
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

new Etto(document.getElementById('demo-1'), { source });

const etto_list = [
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

new Etto(document.getElementById('demo-2'), {}, etto_list);
import EttoActions from './EttoActions';
import { createEmText, filterChoices, choiceMap } from './util';

const MIN_CHARS = 3;
const MAX_RESULTS = 7;
const REQUEST_DELAY = 350;
const DOT_SIZE = 6;
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

        this.selectMode    = config.selectMode || false;
        this.source        = config.source || null;
        this.minChars      = config.minChars || MIN_CHARS;
        this.maxResults    = config.maxResults || MAX_RESULTS;
        this.matchFullWord = config.matchFullWord || false;
        this.requestDelay  = config.requestDelay || REQUEST_DELAY;

        this.input    = this.createInput();
        this.ul       = this.createUnorderedList();
        this.dropdown = this.createDropdown();
        this.dropdown.appendChild(this.ul);

        // Containers
        this.container = document.createElement('div');
        this.container.classList.add('etto-container');
        this.container.setAttribute('style', 'position: relative;');

        const inputContainer = document.createElement('div');
        inputContainer.setAttribute('style', 'position: relative;');
        inputContainer.appendChild(this.input);

        this.container.appendChild(inputContainer);
        this.container.appendChild(this.dropdown);

        this.root = root;
        this.root.appendChild(this.container);

        // Append spinner after appending container to calculate appropriate offsetHeight
        const spinnerTopPosition = ((this.input.offsetHeight / 2) - (DOT_SIZE / 2)) + 'px';
        
        this.spinner = this.createSpinner(DOT_SIZE, spinnerTopPosition);
        this.container.appendChild(this.spinner.container);

        // Initial Render
        this.renderList(this.state.inputVal, this.state.filtered);
    }

    setShowSpinner(showSpinner) {
        this.spinner.container.style.display = showSpinner ? 'flex' : 'none';
    }

    setShowDropdown(showDropdown) {
        // DOM Update
        this.dropdown.style.display = showDropdown ? 'block' : 'none';

        // Reset Selected if Dropdown has been hidden
        if (!showDropdown && this.state.selected) this.actions.setSelected(null);
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
                    this.setShowSpinner(true);
                    this.actions.setSpinnerTimer(setInterval(this.spinner.animateDots, SPINNER_TIMER));

                    this.source(inputVal, res => {
                        const choices = res ? res.map(choiceMap) : [];

                        this.actions.setCache({ ...this.state.cache, [key]: choices });
                        this.actions.setIsFetching(false);

                        this.setShowSpinner(false);
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

        this.renderList(this.state.inputVal, filtered);
        this.setShowDropdown(filtered.length > 0);
    }

    renderList(inputVal, filtered) {
        // Use custom renderItem function if exists
        const renderItem = this.renderItem || this.createListItem.bind(this);

        // Clear & Repopulate List
        this.ul.innerHTML = '';

        for (let i = 0; i < filtered.length; i++) {
            const isSelected = i === this.state.selected;
            this.ul.appendChild( renderItem(filtered[i], inputVal, isSelected) );
        }
    }

    createInput() {
        const input = document.createElement('input');
        input.classList.add('etto-input');

        input.setAttribute('autocomplete', 'off');
        input.setAttribute('value', '');
        input.setAttribute('style', 'box-sizing: border-box;');

        input.addEventListener('input', e => {
            const inputVal = e.target.value;
            this.actions.setInputVal(inputVal);

            if (inputVal && inputVal.trim().length >= this.minChars) {
                if (this.source) this.fetchFromSource(inputVal);
                else this.onReceiveChoices(this.state.choices);
            } else {
                this.renderList(inputVal, []);
                this.setShowDropdown(false);
            }
        });

        input.addEventListener('focus', () => {
            this.setShowDropdown(this.state.filtered.length > 0);
        });

        input.addEventListener('blur', () => {
            // Reset Selected
            if (this.state.selected) {
                this.actions.setSelected(null);
                this.renderList(this.state.inputVal, this.state.filtered);
            }

            this.setShowDropdown(false);
        });

        input.addEventListener('keydown', e => {
            let showDropdown = this.dropdown.style.display === 'block';

            if ((e.keyCode == 38 || e.keyCode == 40) && showDropdown) {
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

                this.renderList(this.state.inputVal, this.state.filtered);
                this.setShowDropdown(this.state.filtered.length > 0);
            }

            // Enter or Tab
            if (e.keyCode == 9 || e.keyCode == 13) {
                if (showDropdown) {
                    e.preventDefault();
                    let inputVal = undefined;

                    if (this.state.selected !== null) {
                        const choice = this.state.filtered[this.state.selected];
                        inputVal = choice.label;

                        this.actions.setInputVal(inputVal);
                        this.actions.setSelected(null);

                        // Update DOM
                        this.input.value = inputVal;

                        const filtered = filterChoices(
                            inputVal,
                            this.state.choices,
                            this.matchFullWord,
                            this.maxResults
                        );

                        this.renderList(inputVal, filtered);
                        this.setShowDropdown(false);
                    }
                }
            }
        });

        return input;
    }

    createListItem(choice, inputVal, isSelected) {
        const choiceValue = choice.value || choice.label;

        const li = document.createElement('li');
        li.classList.add('etto-li');

        if (isSelected) li.classList.add('etto-selected');
        else li.classList.remove('etto-selected');

        li.setAttribute('style', 'list-style-type: none; cursor: default;');
        li.innerHTML = createEmText(choice.label, inputVal);

        // Set HTML5 data-* attributes
        li.dataset.label = choice.label;
        li.dataset.value = choiceValue;

        li.addEventListener('mousedown', () => {
            const filtered = filterChoices(
                choiceValue,
                this.state.choices,
                this.matchFullWord,
                this.maxResults
            );

            this.actions.setInputVal(choiceValue);
            this.actions.setFiltered(filtered);

            this.renderList(choice.label, filtered);
            this.setShowDropdown(filtered.length > 0);

            // Update DOM
            this.input.value = choiceValue;
            this.input.focus();
        });

        return li;
    }

    createDropdown() {
        const dropdown = document.createElement('div');
        dropdown.classList.add('etto-dropdown');

        dropdown.setAttribute(
            'style',
            'position: absolute; width: 100%; background-color: white; overflow: hidden; z-index: 99;'
        );

        // Hidden by default
        dropdown.style.display = 'none';

        return dropdown;
    }

    createUnorderedList() {
        const ul = document.createElement('ul');
        ul.classList.add('etto-ul');

        return ul;
    }

    createSpinner(dotSize, spinnerTopPosition) {
        const loOpacity = '0.3';
        const hiOpacity = '0.7';

        const spinner = { container: document.createElement('div') };
        spinner.container.classList.add('etto-spinner');
        spinner.container.setAttribute(
            'style',
            'position: absolute; display: none; align-items: center; right: 1em;'
        );

        // Calculate Position from top
        spinner.container.style.top = spinnerTopPosition;

        // Create dots
        const dots = [];
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.classList.add('etto-spinner-dot');
            dot.setAttribute(
                'style',
                'border-radius: 2em; margin: 0 0.1em; display: inline-block; transition: all 0.3s ease;'
            );

            dot.style.height  = dotSize + 'px';
            dot.style.width   = dotSize + 'px';

            // Push Object references in Array
            dots.push(dot);

            // Append to DOM Container
            spinner.container.appendChild(dot);
        }

        let current = 0;
        spinner.animateDots = function() {
            for (let i = 0; i < dots.length; i++) {
                // Reset Opacities
                dots[i].style.opacity = loOpacity;
            }

            if (current == dots.length)
                current = 0;

            dots[current].style.opacity = hiOpacity;
            current += 1;
        };

        // Animate once
        spinner.animateDots();

        return spinner;
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

new Etto(document.getElementById('demo-2'), {}, [
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
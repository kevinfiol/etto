import EttoActions from './EttoActions';
import { createEmText, filterChoices, choiceMap } from './util';

class Etto {
    constructor(root, config, choices) {
        this.state = {
            isFetching: false,
            cache: config.initialCache || {},
            choices: choices || [],
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

        const inputContainer = document.createElement('div');
        inputContainer.setAttribute('style', 'position: relative;');
        inputContainer.appendChild(this.input);

        this.container.appendChild(inputContainer);
        this.container.appendChild(this.dropdown);

        this.root = root;
        this.root.appendChild(this.container);

        // Initial Render
        this.renderList(this.state.inputVal, this.state.filtered);
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
    }

    renderList(inputVal, filtered) {
        // Use custom renderItem function if exists
        const renderItem = this.renderItem || this.createListItem.bind(this);

        // Clear & Repopulate List
        this.ul.innerHTML = '';

        for (let i = 0; i < filtered.length; i++) {
            this.ul.appendChild( renderItem(filtered[i], inputVal) );
        }

        // DOM Update
        const showDropdown = filtered.length > 0;
        this.dropdown.style.display = showDropdown ? 'block' : 'none';
    }

    fetchFromSource() {
        const key = this.state.inputVal.toUpperCase().trim();

        if (this.state.cache[key]) {
            this.onReceiveChoices(this.state.cache[key]);
        } else {
            this.actions.setIsFetching(true);

            this.source(this.state.inputVal, res => {
                const choices = res ? res.map(choiceMap) : [];

                this.actions.setCache({ ...this.state.cache, [key]: choices });
                this.actions.setIsFetching(false);
                this.onReceiveChoices(choices);
            });
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
                if (this.source) this.fetchFromSource();
                else this.onReceiveChoices(this.state.choices);
            } else {
                this.renderList(inputVal, []);
            }
        });

        input.addEventListener('focus', () => {
            this.dropdown.style.display = this.state.filtered.length ? 'block' : 'none';
        });

        input.addEventListener('blur', () => {
            this.dropdown.style.display = 'none';
        });

        input.addEventListener('keydown', e => {
            let showDropdown = this.dropdown.style.display === 'block';

            if ((e.keyCode == 38 || e.keyCode == 40) && showDropdown) {
                e.preventDefault();
                if (e.keyCode == 38) {
                    if (this.state.selected === null || this.state.selected === 0)
                        this.actions.setSelected(0);
                    else
                        this.actions.setSelected(this.state.selected - 1);
                }

                if (e.keyCode == 40) {
                    if (this.state.selected === null)
                        this.actions.setSelected(0);
                    else if (this.state.selected !== this.state.filtered.length - 1)
                        this.actions.setSelected(this.state.selected + 1);
                }
            }
        });

        return input;
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

    createListItem(choice, inputVal) {
        const choiceValue = choice.value || choice.label;

        const li = document.createElement('li');
        li.classList.add('etto-li');

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

            // Update DOM
            this.input.value = choiceValue;
            this.input.focus();
            this.dropdown.style.display = 'none';
        });

        return li;
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
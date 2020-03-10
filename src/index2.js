import Input from './components/Input';
import Dropdown from './components/Dropdown';
import Spinner from './components/Spinner';
import UnorderedList from './components/UnorderedList';

import EttoActions from './EttoActions';
import { createEmText, filterChoices, choiceMap } from './util';

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
        this.source        = config.source        || null;
        this.minChars      = config.minChars      || MIN_CHARS;
        this.maxResults    = config.maxResults    || MAX_RESULTS;
        this.matchFullWord = config.matchFullWord || false;
        this.requestDelay  = config.requestDelay  || REQUEST_DELAY;
        this.createItemFn  = config.createItemFn  || this.createListItem.bind(this);

        this.Input = new Input(document.createElement('input'),
            this.onInput,
            this.onFocus,
            this.onBlur,
            this.onKeydown
        );

        this.UnorderedList = new UnorderedList(document.createElement('ul'),
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

        const showDropdown = filtered.length > 0 ? 'block' : 'none';
        this.Dropdown.setDisplay(showDropdown);

        if (!showDropdown && this.state.selected)
            this.actions.setSelected(null);
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

            this.render(choice.label, filtered);

            const showDropdown = filtered.length > 0 ? 'block' : 'none';
            this.Dropdown.setDisplay(showDropdown);

            if (!showDropdown && this.state.selected)
                this.actions.setSelected(null);

            this.Input.setValue(choiceValue);
            this.Input.focus();
        });

        return li;
    }

    render(inputVal, filtered) {
        this.UnorderedList.populateList(inputVal, filtered, this.state.selected);
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
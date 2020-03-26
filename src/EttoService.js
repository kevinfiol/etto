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
        this.minChars      = this.selectMode ? 0 : (config.minChars || MIN_CHARS);
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

        // Initial Render
        // this.render(this.state.inputVal, this.state.filtered);
    }
}

export default EttoService;
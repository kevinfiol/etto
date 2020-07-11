etto
===

A small, customizable autocomplete and select component. Some highlights:

* Lightweight (~3.7kb min+gzip)
* Written in ES6+
* Zero dependencies
* Framework agnostic

**Etto uses ES6+ features, and only supports modern browsers. It is not intended to work with IE11.**

This a replacement for my earlier component, [otto](https://github.com/kevinfiol/otto). I wanted to get rid of the Hyperapp dependency, but also simplify the codebase and features, hence the new name and project. Etto is also named after [a friend of mine](https://github.com/ettore34). I advise you use etto over otto.

Etto may or may not be the tool you're looking for. See the [other tools section](#other-tools).

## Install

```bash
npm install etto
```

Node
```js
import Etto from 'etto';
```
A CommonJS export is available under `/dist/cjs/`.

Browser
```html
<script src="https://unpkg.com/etto/dist/etto.min.js"></script>
```
Styles
```html
<link rel="stylesheet" href="https://unpkg.com/etto/dist/etto.css">
```

## Usage

### See [Live Examples](https://kevinfiol.github.io/etto/).

### Basic usage
```html
<div id="my-input"></div>
```

```js
const choices = [
    { label: 'Alabama', value: 'AL', country: 'USA' },
    { label: 'Alaska', value: 'AK', isCold: true },
    { label: 'Wyoming', value: 'WY', population: 578759 },
    { label: 'Minnesota', value: 'MN', capital: 'Saint Paul' }
];

const etto = new Etto(document.getElementById('my-input'), {}, choices);
```

* `choice.label` (Required)
    * what is shown for each item in the dropdown.
* `choice.value` (Optional, defaults to value of `choice.label`)
    * what your input element will be populated with upon selection. 
* `choice.country`, `choice.isCold`, `choice.population`, `choice.capital`
    * these are examples of custom properties. Add/use whatever you'd like!

By default, Etto matches against `choice.label` only. You can provide a `config.filterFn` function for a custom filtering mechanism.  You can also configure etto to use functions such as `config.onSelect` and `config.createItemFn` which are great for taking advantage of your custom properties (read more below & see live examples).

### Select mode

etto can imitate a dropdown selection by enabling the built-in select mode service.

```js
const etto = new Etto(document.getElementById('my-input'), { selectMode: true }, choices);
```

### QoL methods & properties

Use `etto.value` to get/set current input value.
```js
const oldValue = etto.value;
console.log(oldValue); // 'old value'

etto.value = 'new value';
console.log(etto.value); // 'new value'
```

Use `etto.selected` to get current selected choice when using select mode.
```js
const currentChoice = etto.selected;
console.log(currentChoice); // { label: 'Wyoming', value: 'WY', population: 578759 }
```

*Warning:* The `etto.selected` getter returns a reference to `etto.service.state.selected`. Mutating this object can result in unexpected behavior, so be cautious!

Use `etto.clear` to clear current input value (it also clears `etto.selected` when in select mode).
```js
etto.clear();
console.log(etto.value); // ''
console.log(etto.selected); // null
```

Several more lower-level methods are available under `etto.service`. Proceed with caution.

### Configuration

etto provides several options to configure its behavior. Below are default values:

```js
const etto = new Etto(document.getElementById('my-input'), {
    // selectMode: boolean
    // whether to enable select mode
    selectMode: false,

    // source(query: string, done: function): void
    // for use with async choice sources; see live examples page
    source: undefined,

    // minChars: number
    minChars: 3,

    // maxResults: number
    maxResults: 7,

    // requestDelay: number
    // used in conjunction with config.source; delay before making each request in milliseconds
    requestDelay: 350,

    // matchFullWord: boolean
    // whether to match full words
    matchFullWord: false,

    // showEmptyMsg: boolean
    // whether to display empty message upon no match
    showEmptyMsg: true,

    // emptyHtml: string
    // custom html markup for empty message
    emptyHtml: undefined,

    // createItemFn(choice: object, inputVal: string, isHighlighted: boolean, isSelected: boolean): string
    // customize how each list item is rendered; see live examples page
    createItemFn: undefined,

    // filterFn(inputVal: string, choices: array, matchFullWord: boolean, maxResults: number): array
    // customize how etto filters results; see live examples page
    // defaults to using the included filter function, /src/util.js > filterChoices
    filterFn: filterChoices,

    // onSelect(choice: object): void
    // a custom callback you can use to do something upon selecting an item from the list
    // takes in object of selected choice
    onSelect: undefined,

    // onClear(): void
    // a custom callback you can use to do something upon programmatically clearing the user input
    onClear: undefined
});
```

## Other Tools

Etto aims to be small in size and scope, while remaining very customizable. That being said, here are some other tools that I can recommend:

* [Awesomeplete](https://github.com/LeaVerou/awesomplete) - A truly awesome autocomplete component that's even smaller than Etto (2kb). Zero dependencies.
* [select2](https://github.com/select2/select2) - Tried & battle-tested. Has a jQuery dependency.
* [Choices.js](https://github.com/jshjohnson/Choices) - A select2 alternative without the jQuery dependency. 19kb gzipped.
* [react-select](https://github.com/JedWatson/react-select) - As the name implies, a select component with a hard React dependency.

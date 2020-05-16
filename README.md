etto
===

A small, customizable autocomplete and select component. Some highlights:

* Lightweight (~4kb min+gzip)
* Written in ES6+
* Zero dependencies
* Framework agnostic

This a replacement for my earlier component, [otto](https://github.com/kevinfiol/otto). I wanted to get rid of the Hyperapp dependency, but also simplify the codebase and features. I advise you use etto over otto.

Etto is named after [a friend of mine](https://github.com/ettore34).

## Install

```bash
npm install etto
```

ESM
```js
import Etto from 'etto';
```
CommonJS
```js
import Etto from 'etto/dist/cjs';
```
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

By default, etto only matches against the `choice.label` property of each choice, whilst the `choice.value` property is what your input element will be populated with. You can provide a custom `config.filterFn` for a custom filter mechanism (read more below & see live examples).

In addition, custom properties can be added to every choice object if you'd like. You can configure etto to use functions such as `config.onSelect` and `config.createItemFn` to use these properties in different ways.

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

### Select mode

etto can imitate a dropdown selection by enabling the built-in select service.

```js
const etto = new Etto(document.getElementById('my-input'), { selectMode: true }, choices);
```

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
    requestDelay: 350

    // matchFullWord: boolean
    // whether to match full words
    matchFullWord: false

    // showEmptyMsg: boolean
    // whether to display empty message upon no match
    showEmptyMsg: true,

    // emptyHtml: string
    // custom html markup for empty message
    emptyHtml: undefined,

    // createItemFn(choice: object, inputVal: string, isHighlighted: boolean, isSelected: boolean): string
    // customize how each list item is rendered; see live examples page
    createItemFn: undefined

    // filterFn(inputVal: string, choices: array, matchFullWord: boolean, maxResults: number): array
    // customize how etto filters results; see live examples page
    // defaults to using the included filter function, /src/util.js > filterChoices
    filterFn: filterChoices,

    // onSelect(choice: object): void
    // a custom callback you can use to do something upon selecting an item from the list
    // takes in object of selected choice
    onSelect: undefined
});
```
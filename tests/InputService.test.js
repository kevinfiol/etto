// const o = require('ospec');
// const { dom } = require('./dom');
// const EttoService = require('../src/EttoService');

import o from 'ospec/ospec';
import { dom } from './dom.js';
import InputService from '../src/InputService';
import { list_1 } from '../example_choices';

o.spec('InputService service', () => {
    let service;
    let root;
    let choices;

    o.before(() => {
        choices = [ ...list_1 ];
    });

    o('InputService constructor', () => {
        root = document.createElement('div');
        service = new InputService(root, {}, choices);

        o(1).equals(1);
    })
});
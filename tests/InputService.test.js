// const o = require('ospec');
// const { dom } = require('./dom');
// const EttoService = require('../src/EttoService');

// o.spec('InputService service', () => {
//     let service;
//     let root;
//     let choices;

//     o.before(() => {
//         choices = [
//             { label: 'Alabama' },
//             { label: 'Alaska' },
//             { label: 'Michigan' },
//             { label: 'Minnesota' },
//             { label: 'Wyoming' },
//             { label: 'Doug' },
//             { label: 'Omigod Records' },
//             { label: 'Ganon' },
//             { label: 'Little Bambam' },
//             { label: 'Ness from Earthbound' },
//             { label: 'Ghoul' },
//             { label: 'Banana' },
//             { label: 'Bananza' },
//             { label: 'Marty' },
//             { label: 'BOAT' },
//             { label: 'Turtle' },
//             { label: 'Tortoise' },
//             { label: 'TNT' },
//             { label: 'Toister Oven' },
//             { label: 'Urtle the Old Lady' },
//             { label: 'Grand Canyon' },
//             { label: 'Bird' },
//             { label: 'Florida' },
//             { label: 'Cindy' },
//             { label: 'Ettore' }
//         ];
//     });

//     o('EttoService constructor', () => {
//         root = document.createElement('div');
//         service = new EttoService(root, {}, choices);

//         o(service.Input.el.tagName).equals('INPUT');
//     })
// });
import InputService from './InputService';
import SelectService from './SelectService';

class Etto {
    constructor(root, config, choices) {
        if (config.selectMode)
            this.service = new SelectService(root, config, choices);
        else
            this.service = new InputService(root, config, choices);
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

new Etto(document.getElementById('demo-2'), {
    selectMode: true
    // filterFn: (inputVal, choices, matchFullWord, maxResults) => {
    //     return [
    //         { label: 'banana', value: 'banana' },
    //         { label: 'apple', value: 'apple' }
    //     ];
    // }
}, etto_list);
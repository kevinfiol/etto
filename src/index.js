import InputService from './InputService';
import SelectService from './SelectService';
import { list_1, list_2 } from '../example_choices'; 

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

new Etto(document.getElementById('demo-1'), {}, list_1);
new Etto(document.getElementById('demo-2'), { source });


new Etto(document.getElementById('demo-3'), {
    selectMode: true
    // filterFn: (inputVal, choices, matchFullWord, maxResults) => {
    //     return [
    //         { label: 'banana', value: 'banana' },
    //         { label: 'apple', value: 'apple' }
    //     ];
    // }
}, list_1);

new Etto(document.getElementById('demo-4'), {
    selectMode: true,
    source
});

new Etto(document.getElementById('demo-5'), { selectMode: true }, list_2);



// for (let i = 0; i < 10000; i++) {
//     etto_list.push({ label: 'Alabama' });
// }




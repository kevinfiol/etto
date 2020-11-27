const list_1 = [
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
    { label: 'Banana' },
    { label: 'Bananza' },
    { label: 'Marty' },
    { label: 'BOAT' },
    { label: 'Turtle' },
    { label: 'Tortoise' },
    { label: 'TNT' },
    { label: 'Toister Oven' },
    { label: 'Urtle the Old Lady' },
    { label: 'Grand Canyon' },
    { label: 'Bird' },
    { label: 'Florida' },
    { label: 'Cindy' },
    { label: 'Ettore' }
];

const list_2 = [
    { label: 'bananas', value: 'cherries' },
    { label: 'kevin fiol', value: 'the coolest guy ever'},
    { label: 'nah', age: 25 }
];

let xhr = null;
const source = function(query, done) {
    // Abort last request
    if (xhr) {
        xhr.abort();
    }

    xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://swapi.dev/api/people/?search=' + query, true);

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

new Etto(document.getElementById('demo-1'), { onValue: val => console.log('onValue: ', val) }, list_1);
new Etto(document.getElementById('demo-2'), { source });


new Etto(document.getElementById('demo-3'), {
    selectMode: true,
    onValue: val => console.log('onValue: ', val)
    // filterFn: (inputVal, choices, matchFullWord, maxResults) => {
    //     return [
    //         { label: 'banana', value: 'banana' },
    //         { label: 'apple', value: 'apple' }
    //     ];
    // }
}, list_1);

new Etto(document.getElementById('demo-4'), { selectMode: true }, list_1);

// new Etto(document.getElementById('demo-4'), {
//     selectMode: true,
//     source
// });

new Etto(document.getElementById('demo-5'), { selectMode: true }, list_2);



// for (let i = 0; i < 10000; i++) {
//     etto_list.push({ label: 'Alabama' });
// }
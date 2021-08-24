function removeHtml(s) {
    return s.replace(/&/g, '').replace(/</g, '').replace(/>/g, '');
}

function createEmText(choiceLabel, inputVal) {
    let label = removeHtml(choiceLabel);
    let len = inputVal.length;
    let emIndex = choiceLabel.toUpperCase().indexOf(inputVal.toUpperCase());

    if (emIndex < 0)
        return label;

    let beg = label.slice(0, emIndex);
    let mid = label.slice(emIndex, emIndex + len);
    let end = label.slice(emIndex + len);

    return `${ beg }<b>${ mid }</b>${ end }`;
}

function filterChoices(inputVal, choices, matchFullWord, maxResults) {
    let v = inputVal.toUpperCase();

    let filtered = choices.filter(c => {
        let label = c.label;
        let index = label.toUpperCase().indexOf(v);

        let passes = matchFullWord || false
            ? label[index - 1] === undefined || label[index - 1] === ' '
            : true
        ;

        return index > -1 && passes;
    });

    if (maxResults !== undefined)
        filtered = filtered.slice(0, maxResults);

    return filtered;
}

function choiceMap(choice) {
    return Object.assign({}, choice, {
        label: choice.label,
        value: (choice.value !== undefined && choice.value !== null) 
            ? choice.value
            : choice.label
    });
}

export { removeHtml, createEmText, filterChoices, choiceMap };
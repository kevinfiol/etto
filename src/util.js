function removeHtml(s) {
    return s.replace(/&/g, '').replace(/</g, '').replace(/>/g, '');
}

function createEmText(choiceLabel, inputVal) {
    const label = removeHtml(choiceLabel);
    const len = inputVal.length;
    const emIndex = choiceLabel.toUpperCase().indexOf(inputVal.toUpperCase());

    if (emIndex < 0)
        return label;

    const beg = label.slice(0, emIndex);
    const mid = label.slice(emIndex, emIndex + len);
    const end = label.slice(emIndex + len);

    return `${ beg }<b>${ mid }</b>${ end }`;
}

function filterChoices(inputVal, choices, matchFullWord, maxResults) {
    const v = inputVal.toUpperCase();

    let filtered = choices.filter(c => {
        const label = c.label;
        let index = label.toUpperCase().indexOf(v);

        const passes = matchFullWord || false
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
export function removeHtml(s) {
    return s.replace(/&/g, '').replace(/</g, '').replace(/>/g, '');
}

export function createEmText(choiceLabel, inputVal) {
    const label = removeHtml(choiceLabel);
    const len = inputVal.length;
    const emIndex = choiceLabel.toUpperCase().indexOf(inputVal.toUpperCase());

    const beg = label.slice(0, emIndex);
    const mid = label.slice(emIndex, emIndex + len);
    const end = label.slice(emIndex + len);

    return `${ beg }<b>${ mid }</b>${ end }`;
}
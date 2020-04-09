const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const dom = new JSDOM('<!DOCTYPE html><body></body></html>');
global.window = dom.window;
global.document = window.document;

module.exports = dom;
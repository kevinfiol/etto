import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><body></body></html>');
global.window = dom.window;
global.document = window.document;

export default dom;
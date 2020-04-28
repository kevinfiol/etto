import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><body></body></html>');
global.window = dom.window;
global.document = window.document;

function evt(action, el) {
    const ev = document.createEvent('HTMLEvents');
    ev.initEvent(action, false, true);
    el.dispatchEvent(ev);
};

export { dom, evt }; 
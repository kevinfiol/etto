import jsdom from 'jsdom';
const { JSDOM } = jsdom;

const dom = new JSDOM('<!DOCTYPE html><body></body></html>');
global.window = dom.window;
global.document = window.document;

function evt(action, el) {
    const ev = document.createEvent('HTMLEvents');
    ev.initEvent(action, false, true);
    el.dispatchEvent(ev);
}

function keydownEvt(keyCode, el) {
    const ev = new window.KeyboardEvent('keydown', { keyCode: keyCode });
    el.dispatchEvent(ev);
}

export { dom, evt, keydownEvt };

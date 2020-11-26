import { suite } from 'uvu';
import { equal } from 'uvu/assert';
import { dom } from '../dom.js';
import Spinner from '../../src/components/Spinner.js';

const t = suite('Spinner Component');

let spinner;
let domEl;

t.before(() => {
    spinner = new Spinner(document.createElement('div'), 6, 10);
});

t('Spinner init', () => {
    equal(spinner.el.style.display, 'none');
});

t('Spinner initial createDots call', () => {
    equal(spinner.el.children.length, 3);

    let litDot = spinner.el.children[0];
    equal(litDot.style.opacity, spinner.hiOpacity);
});

t('Spinner show & hide', () => {
    spinner.show();
    equal(spinner.el.style.display, 'flex');

    spinner.hide();
    equal(spinner.el.style.display, 'none');
});

t('Spinner animateDots', () => {
    spinner.animateDots();

    let litDot = spinner.el.children[1];
    equal(litDot.style.opacity, spinner.hiOpacity);

    // check other dots
    equal(spinner.el.children[0].style.opacity, spinner.loOpacity);
    equal(spinner.el.children[2].style.opacity, spinner.loOpacity);
});

t.run();
import o from 'ospec/ospec';
import { dom } from '../dom';
import Spinner from '../../src/components/Spinner';

o.spec('Spinner Component', () => {
    let spinner;
    let domEl;

    o.before(() => {
        spinner = new Spinner(document.createElement('div'), 6, 10);
    });

    o('Spinner init', () => {
        o(spinner.el.style.display).equals('none');
    });

    o('Spinner initial createDots call', () => {
        o(spinner.el.children.length).equals(3);

        let litDot = spinner.el.children[0];
        o(litDot.style.opacity).equals(spinner.hiOpacity);
    });

    o('Spinner show & hide', () => {
        spinner.show();
        o(spinner.el.style.display).equals('flex');

        spinner.hide();
        o(spinner.el.style.display).equals('none');
    });

    o('Spinner animateDots', () => {
        spinner.animateDots();

        let litDot = spinner.el.children[1];
        o(litDot.style.opacity).equals(spinner.hiOpacity);

        // check other dots
        o(spinner.el.children[0].style.opacity).equals(spinner.loOpacity);
        o(spinner.el.children[2].style.opacity).equals(spinner.loOpacity);
    });
});
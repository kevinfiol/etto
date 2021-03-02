import Element from '../lib/Element.js';

class Spinner extends Element {
    constructor(
        el,
        dotSize
    ) {
        super(el);

        this.dotSize = dotSize || 6;
        this.dots = [];
        this.currentDot = 0;

        this.loOpacity = '0.3';
        this.hiOpacity = '0.7';

        this.applyClassList(['etto-spinner']);
        this.applyAttributes({
            style: 'position: absolute; display: none; align-items: center; right: 2rem;'
        });

        // Initialize Dots
        this.createDots();
        this.animateDots();
    }

    hide() {
        this.setDisplay('none');
    }

    show() {
        this.setDisplay('flex');
    }

    createDots() {
        // Create Dots
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.classList.add('etto-spinner-dot');
            dot.setAttribute(
                'style',
                'border-radius: 2em; margin: 0 0.1em; display: inline-block; transition: all 0.3s ease;'
            );

            dot.style.height = this.dotSize + 'px';
            dot.style.width  = this.dotSize + 'px';

            this.dots.push(dot);
            this.el.appendChild(dot);
        }
    }

    animateDots() {
        for (let i = 0; i < this.dots.length; i++) {
            this.dots[i].style.opacity = this.loOpacity;
        }

        if (this.currentDot == this.dots.length)
            this.currentDot = 0;

        this.dots[this.currentDot].style.opacity = this.hiOpacity;
        this.currentDot += 1;
    }
}

export default Spinner;
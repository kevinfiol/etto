import o from 'ospec/ospec';
import State from '../../src/lib/State';

o.spec('State Object', () => {
    let state;
    
    o.beforeEach(() => {
        state = Object.create(State);
        state.init('li', 'testClassName');
    });

    o('Element init', () => {
        o(li.el.tagName).equals('LI');
        o(li.el.className).equals('testClassName');
    });
});
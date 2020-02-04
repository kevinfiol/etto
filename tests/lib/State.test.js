import o from 'ospec/ospec';
import { clone } from 'rambda';
import State from '../../src/lib/State';

o.spec('State Object', () => {
    let state;
    let initialState = {
        foo: 'etto',
        list: [1, 2, 3, [4, 5, 6]],
        obj: { name: 'etto', age: 1, sub: { bar: 2 }}
    };
    
    o.beforeEach(() => {
        state = Object.create(State);
        state.init(initialState, () => {});
    });

    o('State init', () => {
        o(state.props).deepEquals(initialState);
    });

    o('State update', () => {
        let temp = clone(initialState);
        temp.foo = 'bar';
        temp.obj.bar = 3;

        state.update({ ...state.props,
            foo: 'bar',
            obj: { ...state.props.obj,
                bar: 3
            }
        });

        o(state.props).deepEquals(temp);
    });
});
import o from 'ospec/ospec';
import { dom } from './dom';
import EttoService from '../src/EttoService';

o.spec('EttoService service', () => {
    let rootEl;
    let service;
    let flag;

    o.before(() => {
        flag = false;
    });

    o('EttoService constructor', () => {
        rootEl = document.createElement('div');

        try {
            // Should throw TypeError for abstract class
            service = new EttoService(rootEl, {}, []);
        } catch (e) {
            if (e instanceof TypeError) {
                flag = true;
            }
        }

        o(flag).equals(true);
    })
});
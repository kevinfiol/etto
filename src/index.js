import EttoState from './EttoState';
import view from './view';

const initialState = { name: 'kevin' };

function Etto(root, config, choices) {
    this.state = Object.create(EttoState);

    this.state.init(initialState, () => {
        const props = this.state.props;
        root.innerHTML = view(props);
    });
}

new Etto(document.getElementById('demo-1'), null, null);
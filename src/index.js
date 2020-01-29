import UnorderedList from './components/UnorderedList';
import Foo from './components/Foo';

const state = { name: 'kevin' };
const container = document.getElementById('demo-1');

UnorderedList.update({ state });

container.innerHTML = UnorderedList.view();
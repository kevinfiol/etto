import Element from '../lib/Element';
const Foo = Object.create(Element);

Foo.template = () => `
    <h2>test me</h2>
`;

export default Foo;
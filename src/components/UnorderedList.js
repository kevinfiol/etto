import Element from '../lib/Element';
const UnorderedList = Object.create(Element);

UnorderedList.template = props => `
    <div>
        hello ${ props.state.name }
        ${ props.children }
    </div>
`;

export default UnorderedList;
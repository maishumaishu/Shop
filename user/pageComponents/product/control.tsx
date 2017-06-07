import { Control, ControlArguments, componentsDir } from 'mobileComponents/common';
requirejs(['css!mobileComponents/product/control.css']);
export interface Props {

}
export interface State {

}
export default class ProductControl extends React.Component<Props, State>{
    constructor(props) {
        super(props);

    }
    render() {
        return (
            <div>
                product
            </div>
        );
    }
}
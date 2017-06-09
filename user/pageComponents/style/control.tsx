import { componentsDir, Control } from 'mobileComponents/common';
export type StyleType = 'default' | 'red';
export interface Props {
    style?: StyleType;
}
export interface State {
    style?: StyleType
}
export default class StyleControl extends Control<Props, State>{
    constructor(props) {
        super(props);
        this.state = { style: this.props.style || 'default' };
    }

    renderChildren(h) {
        let style = this.state.style;
        let path = `../user/pageComponents/style/style_${style}.css`;
        return <link rel="stylesheet" href={path}></link>
    }
} 
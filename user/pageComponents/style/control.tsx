import { Control, ControlArguments, componentsDir } from 'mobileComponents/common';
export type StyleType = 'default' | 'red';
export interface Props {
    style?: StyleType;
}
export interface State {
    style?: StyleType
}
export default class StyleControl extends React.Component<Props, State>{
    constructor(props) {
        super(props);
        this.state = { style: this.props.style || 'default' };
    }

    render() {
        let style = this.state.style;
        let path = `${componentsDir}/style/style_${style}.css`;
        return <link rel="stylesheet" href={path}></link>
    }
} 
import { componentsDir, Component } from 'mobileComponents/common';
export type StyleType = 'default' | 'red';
export interface Props extends React.Props<StyleControl> {
    style?: StyleType;
}
export interface State {
    style?: StyleType
}
export default class StyleControl extends React.Component<Props, State>{
    constructor(props) {
        super(props);
        // this.state = { style: this.props.style };
    }
    render() {
        let style = (this.state || { style: 'default' }).style;
        let path = `../user/pageComponents/style/style_${style}.css`;
        return <link rel="stylesheet" href={path}></link>
    }
} 
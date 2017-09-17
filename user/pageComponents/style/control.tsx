import { componentsDir, Component } from 'mobileComponents/common';
export type StyleType = 'default' | 'red';
export interface Props extends React.Props<StyleControl> {
}
export interface State {
    style?: StyleType;
}
export default class StyleControl extends Component<Props, State>{

    get persistentMembers(): (keyof State)[] {
        return ['style'];
    }

    constructor(props) {
        super(props);
        this.state = {};
    }

    _render(h) {
        console.assert(this.state != null);
        let style = this.state.style || 'default'; //(this.state || { style: 'default' }).style;
        let path = `../user/pageComponents/style/style_${style}.css`;
        return <link rel="stylesheet" href={path}></link>
    }
} 
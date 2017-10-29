import { componentsDir, Control, ControlProps } from 'mobileComponents/common';
export type StyleType = 'default' | 'red';
export interface Props extends ControlProps<StyleControl> {
}
export interface State {
    style?: StyleType;
}
export default class StyleControl extends Control<Props, State>{

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
        let path = `../user/mobileComponents/style/style_${style}.css`;
        return <link key={path} rel="stylesheet" href={path}></link>
        // return <div></div>;
    }
} 
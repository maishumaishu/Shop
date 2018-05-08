import { componentsDir, Control, ControlProps } from 'components/common';
import lessc = require('lessc');

export type StyleType = 'default' | 'red';
export interface Props extends ControlProps<StyleControl> {
}
export interface State {
    style?: StyleType;
}
export default class StyleControl extends Control<Props, State>{

    element: HTMLStyleElement;
    get persistentMembers(): (keyof State)[] {
        return ['style'];
    }

    constructor(props) {
        super(props);
        this.state = {};
        this.noneCSS = true;
    }
 
    _render(h) {
        // console.assert(this.state != null);
        let style = this.state.style || 'default'; 
        let path = `../components/style/style_${style}.css`;
        return <link key={path} rel="stylesheet" href={path}></link>
        
    }
} 
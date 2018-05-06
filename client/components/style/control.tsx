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
    }
    componentDidMount() {
        // let red = `
        // @import "../components/style/style_default.less";
        // @brand-primary: @brand-primary-red;
        // @brand-success: @brand-success-red;
        // @brand-info: @brand-info-red;
        // @brand-warning: @brand-warning-red;
        // @brand-danger: @brand-danger-red; `;

        // let self = this;
        // var parser = new lessc.Parser(window['less']);
        // parser.parse(red, (err, tree) => {
        //     self.element.innerText = tree.toCSS();
        // })
        // let path = `css!components/style/style_red`;
        // requirejs([path], (css) => {
        //     this.element.innerText = css;
        // })
    }
    _render(h) {
        // console.assert(this.state != null);
        let style = this.state.style || 'default'; 
        let path = `../components/style/style_${style}.css`;
        return <link key={path} rel="stylesheet" href={path}></link>
        
    }
} 
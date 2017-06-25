import { componentsDir, Component, editor } from 'mobileComponents/common';
export interface MenuNode {
    name: string,
    url: string,
    children?: MenuNode[]
}
export interface Props extends React.Props<MenuControl> {
    menuNodes: MenuNode[]
}
export interface State {
    menuNodes: MenuNode[]
}
requirejs(['css!mobileComponents/menu/control.css']);

// @editor('menu/editor')
export default class MenuControl extends React.Component<Props, State>{
    private element: HTMLElement;
    constructor(props) {
        super(props);
        this.state = { menuNodes: this.props.menuNodes || [] };
    }
    render() {
        let menuNodes = this.state.menuNodes;
        return (
            <div className="menuControl" ref={(e: HTMLElement) => this.element = e || this.element}>
                {menuNodes.length <= 0 ?
                    <ul className="menu"></ul> :
                    <ul className="menu">
                        {menuNodes.map((o, i) => {
                            let itemWidth = 100 / menuNodes.length;
                            return (
                                <li key={i} style={{ width: `${itemWidth}%` }}>
                                    <a href={o.url}>{o.name}</a>
                                </li>
                            );
                        })}
                    </ul>
                }
            </div>
        );
    }
}
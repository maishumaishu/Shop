import { componentsDir, Component, editor, ControlState } from 'mobileComponents/common';
export interface MenuNode {
    name: string,
    url: string,
    children?: MenuNode[]
}
export interface Props extends React.Props<MenuControl> {
    menuNodes: MenuNode[]
}
export interface State {//extends ControlState
    // persistentProperties: (keyof State)[];

    menuNodes: MenuNode[];

    // @persistentProperty(true)
    // get menuNodes(): MenuNode[] {
    //     return this._menuNodes;
    // }
    // set menuNodes(value) {
    //     this._menuNodes = value;
    // }
}
requirejs(['css!mobileComponents/menu/control.css']);

// @editor('menu/editor')
export default class MenuControl extends Component<Props, State>{
    get persistentMembers(): (keyof State)[] {
        return ["menuNodes"];
    }

    constructor(props) {
        super(props);
        this.state = {
            menuNodes: [],
        }

        let keys = this.persistentMembers;
        for (let i = 0; i < keys.length; i++) {
            var prop = props[keys[i]];
            this.state[keys[i]] = prop;
        }
    }
    _render(h) {
        let menuNodes = this.state.menuNodes || [];
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
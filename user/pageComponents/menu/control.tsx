import { componentsDir, Control, editor, ControlState } from 'pageComponents/common';
export interface MenuNode {
    name: string,
    url: string,
    sortNumber?: number,
    icon?: string,
    children?: MenuNode[]
}
export interface Props extends React.Props<MenuControl> {
    menuNodes?: MenuNode[];
    showIcon?: boolean;
}
export interface State {
    menuNodes?: MenuNode[];
    showIcon?: boolean;
}
requirejs(['css!pageComponents/menu/control.css']);

const EMPTY_ICON = 'icon-check-empty';
export default class MenuControl extends Control<Props, State>{
    get persistentMembers(): (keyof State)[] {
        return ["menuNodes", "showIcon"];
    }

    constructor(props) {
        super(props);
        this.state = { menuNodes: [], showIcon: false };
    }
    _render(h) {
        let menuNodes = this.state.menuNodes || [];
        let showIcon = this.state.showIcon || false;
        return (
            <div className="menuControl" ref={(e: HTMLElement) => this.element = e || this.element}>
                {menuNodes.length <= 0 ?
                    <ul className="menu noicon"></ul> :
                    showIcon ? this.renderMenuWithIcon(menuNodes) : this.renderMenuWithoutIcon(menuNodes)
                }
            </div>
        );
    }

    private renderMenuWithoutIcon(menuNodes: MenuNode[]) {
        return (
            <ul className="menu noicon">
                {menuNodes.map((o, i) => {
                    let itemWidth = 100 / menuNodes.length;
                    return (
                        <li key={i} style={{ width: `${itemWidth}%` }}>
                            <a href={o.url}>{o.name}</a>
                        </li>
                    );
                })}
            </ul>
        );
    }

    private renderMenuWithIcon(menuNodes: MenuNode[]) {
        return (
            <ul className="menu">
                {menuNodes.map((o, i) => {
                    let itemWidth = 100 / menuNodes.length;
                    return (
                        <li key={i} style={{ width: `${itemWidth}%` }}>
                            <a href={o.url}>
                                <i className={o.icon ? o.icon : EMPTY_ICON}></i>
                                {o.name}
                            </a>
                        </li>
                    );
                })}
            </ul>
        );
    }
}
import { componentsDir, Control, ControlState, ControlProps } from 'components/common';
// import { app } from 'user/site';
import { ShoppingCartService } from 'user/services/shoppingCartService';
import siteMap from 'user/siteMap';
import { Page as UserPage } from 'user/application';

export interface MenuNode {
    name: string,
    url: string,
    sortNumber?: number,
    icon?: string,
    children?: MenuNode[]
}
interface Props extends ControlProps<MenuControl> {
    menuNodes?: MenuNode[];
    showIcon?: boolean;
}
export interface State {
    menuNodes?: MenuNode[];
    showIcon?: boolean;
    productsCount?: number
}

const EMPTY_ICON = 'icon-check-empty';
export default class MenuControl extends Control<Props, State>{
    get persistentMembers(): (keyof State)[] {
        return ["menuNodes", "showIcon"];
    }

    constructor(props) {
        super(props);

        let productsCount = ShoppingCartService.productsCount.value;
        this.state = { menuNodes: [], showIcon: false, productsCount };

        this.subscribe(ShoppingCartService.productsCount, (value) => {
            this.state.productsCount = value;
            this.setState(this.state);
        })

        this.loadControlCSS();
    }

    _render(h) {
        let menuNodes = this.state.menuNodes || [];
        let showIcon = this.state.showIcon || false;
        return [
            <div key="menuControl" className="menuControl">
                {menuNodes.length <= 0 ?
                    <ul className="menu noicon"></ul> :
                    showIcon ? this.renderMenuWithIcon(h, menuNodes) : this.renderMenuWithoutIcon(h, menuNodes)
                }
            </div>
        ];
    }

    private isShoppingCart(routeString: string) {
        let page = this.props.mobilePage.props.elementPage as UserPage;
        var routeData = page.app.parseUrl(routeString);
        if (routeData.pageName == 'shopping.shoppingCart') {
            return true;
        }
        return false;
    }

    private renderMenuWithoutIcon(h, menuNodes: MenuNode[]) {
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

    private renderMenuWithIcon(h, menuNodes: MenuNode[]) {
        let productsCount = this.state.productsCount || 0;
        return <ul className="menu">
            {menuNodes.map((o, i) => {
                let itemWidth = 100 / menuNodes.length;
                // let routeString = o.url.startsWith('#') ? o.url.substr(1) : o.url;
                let page = (this.elementPage as UserPage);
                var routeData = page.app.parseUrl(o.url);
                let isShoppingCart = routeData.pageName == 'shopping.shoppingCart'
                let isActive = this.elementPage.name == routeData.pageName; //app.currentPage != null && app.currentPage.name == routeData.pageName;
                return (
                    <li key={i} style={{ width: `${itemWidth}%` }}>
                        <div onClick={() => page.app.redirect(siteMap.nodes[routeData.pageName])} className={isActive ? 'text-primary' : null}>
                            <i className={o.icon ? o.icon : EMPTY_ICON}></i>
                            {o.name}
                        </div>
                        {isShoppingCart && productsCount > 0 ? <div className="badge bg-primary" >{productsCount}</div> : null}
                    </li>
                );
            })}
        </ul>
    }
}
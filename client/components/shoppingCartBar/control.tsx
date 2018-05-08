import { Control, ControlProps, componentsDir } from 'components/common';
import { app } from '../../user/site';
import { siteMap } from '../../user/siteMap';

export interface Props extends ControlProps<ShoppingCartBarControl> {

}

export interface State {

}


export default class ShoppingCartBarControl extends Control<Props, State>{
    constructor(props) {
        super(props);
        // this.loadControlCSS();
    }

    get persistentMembers(): (keyof State)[] {
        return null;
    }

    _render() {
        return (
            <div className="settlement">
                <div className="pull-left btn-link"
                    onClick={() => app.redirect(siteMap.nodes.shopping_shoppingCart)}>
                    <i className="icon-shopping-cart"></i>
                </div>
                <div className="pull-right">
                    <label>总计：<span className="price">￥0.00</span></label>
                    <button className="btn btn-primary" disabled={true}>结算</button></div>
            </div>
        );
    }
}
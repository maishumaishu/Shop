import { ControlProps, Control } from "../common";

interface Props extends ControlProps<Navigator> {

}

export interface State {
    product: Product,
    hideProperties: boolean,
    productSelectedText: string,
    count: number,
}

export default class ProductInfoControl extends Control<Props, State> {
    get persistentMembers(): Array<keyof State> {
        return ['product', 'hideProperties'];
    }
    constructor(props) {
        super(props);
        this.hasCSS = true;
        this.state = {
            product: {} as Product, hideProperties: false,
            count: 1,
            productSelectedText: this.productSelectedText({} as Product)
        };
    }
    private productSelectedText(product: Product) {
        var str = '';
        var props = product.Fields || [];
        for (var i = 0; i < props.length; i++) {
            // var options = props[i].Options;
            // for (var j = 0; j < options.length; j++) {
            //     if (options[j].Selected) {
            //         str = str + options[j].Name + ' ';
            //         break;
            //     }
            // }
            str = str + props[i].value + ' ';
        }
        str = str + (this.state == null ? 1 : this.state.count) + '件';
        return str;
    }
    _render(h) {
        let { product, hideProperties } = this.state;
        let selectedText = this.productSelectedText(product);
        return [
            <ul key={10} className="list-group">
                <li className="list-group-item product-name">
                    {product.Name}
                </li>
                <li className="list-group-item">
                    <span>类别：</span>
                    <span>{product.ProductCategoryName}</span>
                </li>
                <li className="list-group-item">
                    <span>价格：</span>
                    <span className="price">{product.Price != null ? '￥' + product.Price.toFixed(2) : ''}</span>
                </li>
                <li className="list-group-item">
                    <span>
                        已选：{selectedText}
                    </span>
                    <span className="pull-right">
                        <i className="icon-chevron-right"></i>
                    </span>
                </li>
            </ul>,
            <hr key={20} />,
            !hideProperties ?
                <div key={30} className="container">
                    <h4 style={{ fontWeight: 'bold', width: '100%' }}>商品信息</h4>
                    {(product.Arguments || []).map(o => (
                        <div key={o.key} style={{ marginBottom: '10px' }}>
                            <div className="pull-left" style={{ width: '100px' }}>{o.key}</div>
                            <div style={{ marginLeft: '100px' }}>{o.value}</div>
                            <div className="clearfix"></div>
                        </div>
                    ))}
                    <div className="empty-info"
                        style={{ display: (product.Arguments || []).length == 0 ? 'block' : 'none' }}>
                        暂无商品信息
                </div>
                </div> : null,
            !hideProperties ?
                <hr key={40} /> : null,
            // <div key={50} className="container">
            //     <div className="empty-info">
            //         暂无商品简介，可以通过拖拉组件设置
            //     </div>
            // </div>,
        ];
    }
}
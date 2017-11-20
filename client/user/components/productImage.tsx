import { imageUrl } from 'userServices/service';
export interface Props extends React.Props<ProductImage> {
    product: Product
}

requirejs(['css!components/productImage']);
export class ProductImage extends React.Component<Props, any>{
    constructor(props) {
        super(props);
    }
    render() {
        let o = this.props.product;
        return [
            <img key="img" className="product-image" src={imageUrl(o.ImagePath, 200)}

                ref={(e: HTMLImageElement) => {
                    if (!e) return;
                    ui.renderImage(e, { imageSize: { width: 200, height: 200 } });
                }} />,
            o.OffShelve || o.Stock == 0 ? [
                <div key="mask" className="product-image-mask"></div>,
                <div key="text" className="product-image-text">
                    {o.OffShelve ? '已下架' : '已售罄'}
                </div>] : null

        ] as any;
    }
}
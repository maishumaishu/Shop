import { Control, ControlArguments } from 'mobile/common';
import { Product, ShoppingService } from 'userServices';
// type Product = {
//     id: string,
//     name: string,
//     image: string,
//     url: string
// }

export class Data {
    private _product: Product;

    get product() {
        return this._product;
    }
    set product(value: Product) {
        this._product = value;
    }
}

let shopping = new ShoppingService();

export default class MyControl extends React.Component<{}, { products: Product[] }> {
    constructor(args: ControlArguments<Data>) {
        super(args);
        this.state = { products: [] };
        shopping.products(0).then(products => {
            this.state.products = products;
            this.setState(this.state);
        })
    }

    render() {
        return (
            <div>
                SingleColumnProduct Control
                {this.state.products.map(o =>
                    <div>
                        {o.Name}
                    </div>
                )}
            </div>

        );
    }
}



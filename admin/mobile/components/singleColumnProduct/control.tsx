import { Control, ControlArguments } from 'mobile/common';
import * as services from 'services';
type Product = {
    id: string,
    name: string,
    image: string,
    url: string
}

export class Data {
    private _product: Product;

    get product() {
        return this._product;
    }
    set product(value: Product) {
        this._product = value;
    }
}

export default class MyControl extends React.Component<{}, {}> {
    constructor(args: ControlArguments<Data>) {
        super(args);
    }

    render() {
        return (
            <div>
                SingleColumnProduct Control
            </div>
        );
    }
}



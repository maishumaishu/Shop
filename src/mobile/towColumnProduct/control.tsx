import { Control, ControlArguments } from 'mobile/common';

type Product = {
    id: string,
    name: string,
    image: string,
    url: string
}

export class Data {
    product: Product = {} as Product;
}

export default class MyControl extends React.Component<{}, {}> {
    constructor(props) {
        super(props);

        // args.element.innerHTML = 'TowColumnProduct';
    }

    render() {
        return (
            <div>
                TowColumnProduct
            </div>
        );
    }
}



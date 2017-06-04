import { Control, ControlArguments, componentsDir } from 'mobile/common';
let { ImageBox } = controls;

requirejs([`css!${componentsDir}/towColumnProduct/control`]);

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
            <div className="products">
                <a className="col-xs-6 text-center item">
                    <img src="http://service.alinq.cn:2800/AdminServices/Shop/Images/Editor/96a34cac654f47e9acb46c4ca0ca169a_360_360.jpeg?application-token=58424776034ff82470d06d3d&amp;storeId=58401d1906c02a2b8877bd13" width="360px" height="360px" />
                    <div className="bottom">
                        <div className="interception">合禾果枇杷蜜</div><div>
                            <div className="price pull-left">
                                ￥68.00
                            </div>
                            <span className="pull-right">
                                <span className="label label-info">满赠</span>
                                <span className="label label-success">满减</span>
                                <span className="label label-warning" style={{ display: 'none' }}>满折</span>
                            </span>
                        </div>
                    </div>
                </a>
                <a className="col-xs-6 text-center item">
                    <img src="http://service.alinq.cn:2800/AdminServices/Shop/Images/Editor/96a34cac654f47e9acb46c4ca0ca169a_360_360.jpeg?application-token=58424776034ff82470d06d3d&amp;storeId=58401d1906c02a2b8877bd13" width="360px" height="360px" />
                    <div className="bottom">
                        <div className="interception">合禾果枇杷蜜</div><div>
                            <div className="price pull-left">
                                ￥68.00
                            </div>
                            <span className="pull-right">
                                <span className="label label-info">满赠</span>
                                <span className="label label-success">满减</span>
                                <span className="label label-warning" style={{ display: 'none' }}>满折</span>
                            </span>
                        </div>
                    </div>
                </a>
            </div>
        );
    }
}



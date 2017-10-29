import * as common from 'mobileComponents/common'
let h = React.createElement;
requirejs([`css!${common.componentsDir}/summaryHeader/control`]);

export class Data {

}

export interface Props extends common.ControlProps<SummaryHeaderControl> {

}

export interface State {
}

export default class SummaryHeaderControl extends common.Control<Props, State>{

    constructor(props) {
        super(props);
        this.state = {};
    }

    get persistentMembers(): (keyof State)[] {
        return null;
    }

    _render() {
        let url = '';
        return (
            <div className="summaryHeader">
                <div className="headerImage pull-left">
                    <img src="https://img.yzcdn.cn/upload_files/shop.png!145x145.jpg" />
                </div>
                <div className="headerContent">
                    <h4 className="title">高州风味</h4>
                    <div className="item">
                        <div className="number">0</div>
                        <div className="text">全部商品</div>
                    </div>
                    <div className="item">
                        <div className="number">0</div>
                        <div className="text">上新商品</div>
                    </div>
                    <div className="item">
                        <div className="number">0</div>
                        <div className="text">我的订单</div>
                    </div>
                    <div className="clearfix"></div>
                </div>
            </div>
        );
    }
}
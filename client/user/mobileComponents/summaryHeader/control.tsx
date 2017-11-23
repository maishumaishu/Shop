import { imageUrl } from 'userServices/service';
import { StationService } from 'userServices/stationService';
import * as common from 'mobileComponents/common'
import * as ui from 'ui';


requirejs([`css!${common.componentsDir}/summaryHeader/control`]);

export class Data {

}

export interface Props extends common.ControlProps<SummaryHeaderControl> {

}

export interface State {
    store: StoreInfo
}

export default class SummaryHeaderControl extends common.Control<Props, State>{

    constructor(props) {
        super(props);
        this.state = { store: null };
        let station = this.elementPage.createService(StationService);
        station.store().then(data => {
            this.state.store = data;
            this.setState(this.state);
        })
    }

    get persistentMembers(): (keyof State)[] {
        return null;
    }

    _render() {
        let url = '';
        let store = this.state.store;
        if (store == null)
            return null;

        let src = store.ImagePath ? imageUrl(store.ImagePath) : ui.generateImageBase64(100, 100, store.Name || "");
        return (
            <div className="summaryHeader">
                <div className="headerImage pull-left">
                    <img src={src} ref={(e: HTMLImageElement) => e ? ui.renderImage(e) : null} />
                </div>
                <div className="headerContent">
                    <h4 className="title">{store.Name}</h4>
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
        )
    }
}
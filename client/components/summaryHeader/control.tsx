import { imageUrl } from 'user/services/service';
import { StationService } from 'user/services/stationService';
import * as common from 'components/common'
import * as ui from 'ui';
import { app } from 'user/application';
import siteMap from 'user/siteMap';


export class Data {

}

export interface Props extends common.ControlProps<SummaryHeaderControl> {

}

type HeaderMode = 'normal' | 'simple';
export interface State {
    store: Store,
    mode: HeaderMode
}

export default class SummaryHeaderControl extends common.Control<Props, State>{

    constructor(props) {
        super(props);
        this.state = { store: null, mode: 'normal' };
        let station = this.elementPage.createService(StationService);
        station.store().then(data => {
            this.state.store = data;
            this.setState(this.state);
        })
        this.loadControlCSS();
    }

    get persistentMembers(): (keyof State)[] {
        return ['mode'];
    }

    _render() {
        let { mode } = this.state;
        let props = this.props;
        // switch (mode) {
        //     case 'simple':
        //         return <SimpleHeader {...props}
        //             ref={(e) => {
        //                 if (!e) return;
        //                 e.state = this.state;
        //                 e.setState(e.state);
        //             }} />;
        //     default:
        //     case 'normal':
        return <NormalHeader {...props}
            ref={(e) => {
                if (!e) return;
                e.state = this.state;
                e.setState(e.state);

            }} />;
        // }
    }
}

class NormalHeader extends React.Component<Props, State>{
    render() {
        if (!this.state) {
            return null;
        }
        let url = '';
        let { store } = this.state;
        store = store || {} as any;

        let src = store.Data.ImageId? imageUrl(store.Data.ImageId) : ui.generateImageBase64(100, 100, store.Name || "");
        return [
            <div key={10} className="headerImage pull-left">
                <img src={src} ref={(e: HTMLImageElement) => e ? ui.renderImage(e) : null} />
            </div>,
            <div key={20} className="headerContent">
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
        ]
    }
}

class SimpleHeader extends React.Component<Props, State>{
    render() {
        if (!this.state) {
            return null;
        }

        return (
            <div className="summaryHeaderControl simpleHeader">
                <i className="icon-user pull-right"
                    onClick={() => app.redirect(siteMap.nodes.user_index)}></i>
                <div className="position interception">
                    <i className="icon-map-marker"></i>
                    <span>暂时获取不到位置信息</span>
                    <i className="icon-sort-down" style={{ margin: 0, position: 'relative', left: 6, top: -2 }}></i>
                </div>
            </div>
        );
    }
}
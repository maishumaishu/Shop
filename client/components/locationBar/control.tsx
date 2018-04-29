import { componentsDir, Control, ControlProps } from 'components/common';
import { app } from 'user/application';
import siteMap from 'user/siteMap';

export interface State {
}

export interface Props extends ControlProps<LocationBarControl> {
    // showBalance?: boolean,// = false;
    // showLevel?: boolean,// = false;
    // showScore?: boolean,// = false;
    // sellsCenter?: 'showToMember' | 'showToSells',// = 'showToMember';
}


export default class LocationBarControl extends Control<Props, State>{
    get persistentMembers() {
        return [] as any;
    }
    _render(h) {
        /**
         * 要在控件设置和控件大小相关的样式，例如 padding，margin，height
         */
        return (
            <div className="locationBar" style={{ padding: 14 }}>
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
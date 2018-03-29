import { componentsDir, Control, ControlProps } from 'mobileComponents/common';
import { app } from 'application';

export interface State {
}

export interface Props extends ControlProps<LocationBar> {
    // showBalance?: boolean,// = false;
    // showLevel?: boolean,// = false;
    // showScore?: boolean,// = false;
    // sellsCenter?: 'showToMember' | 'showToSells',// = 'showToMember';
}


export default class LocationBar extends Control<Props, State>{
    get persistentMembers() {
        return [] as any;
    }
    _render(h) {
        return (
            <div className="locationBar">
                <i className="icon-user pull-right"
                    onClick={() => app.redirect('user_index')}></i>
                <div className="position interception">
                    <i className="icon-map-marker"></i>
                    <span>暂时获取不到位置信息</span>
                    <i className="icon-sort-down" style={{ margin: 0, position: 'relative', left: 6, top: -2 }}></i>
                </div>
            </div>
        );
    }
}
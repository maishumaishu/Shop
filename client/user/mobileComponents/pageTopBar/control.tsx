import { Control, ControlProps } from 'mobileComponents/common';
import { app } from 'application';
import siteMap from '../../siteMap';

export interface Props extends ControlProps<PageTopBarControl> {

}

export interface State {

}

export default class PageTopBarControl extends Control<Props, State>{
    get persistentMembers() {
        return null;
    }
    _render() {
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


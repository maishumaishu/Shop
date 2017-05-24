import { ControlArguments, componentsDir } from 'mobile/common';
import * as common from 'mobile/common'
export class Data {

}

requirejs([`css!${componentsDir}/noticeHeader/control`]);
export default class Control extends React.Component<{}, {}>{
    render() {
        let url = '';
        return (
            <div className="noticeHeader">
                <div className="headerImage pull-left">
                    <img src="https://img.yzcdn.cn/upload_files/shop.png!145x145.jpg" />
                </div>
                <div className="headerContent">
                    <h4>
                        高州风味
                    </h4>
                    <h5>
                        公告：欢迎光临本店
                    </h5>
                </div>
                <div className="clearfix"></div>
            </div>
        );
    }
}
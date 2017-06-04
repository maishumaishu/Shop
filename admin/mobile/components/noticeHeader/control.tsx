import { ControlArguments, componentsDir } from 'mobileComponents/common';
import * as common from 'mobileComponents/common'


export interface Props {

}

export interface State {

}

requirejs([`css!${componentsDir}/noticeHeader/control`]);
export default class Control extends React.Component<Props, State>{
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
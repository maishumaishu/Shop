import { componentsDir, Component } from 'mobileComponents/common';
import * as common from 'mobileComponents/common'
import { PageComponent, PageView } from 'mobileControls';
requirejs([`css!${componentsDir}/member/control`]);
import * as ui from 'ui';
export interface Props extends React.Props<MemberControl> {

}

export interface State {

}

export default class MemberControl extends Component<Props, State>{
    _render(h) {
        return (
            <div className="memberControl">
                <div className="mobile-user-info">
                    <a href="#user_userInfo" className="pull-left" style={{ margin: '-8px 20px 0px 0px' }}>
                        {/*<ImageBox src={'userInfo.HeadImageUrl'} className="img-circle img-full"
                            text="上传头像" />*/}
                        <img className="img-circle img-full" title="上传头像"
                            src={'userInfo.HeadImageUrl'}
                            ref={(e: HTMLImageElement) => {
                                if (!e) return;

                                ui.loadImage(e);
                            }} />
                    </a>

                    <div>
                        <div style={{ width: '100%' }}>
                            <a className="nick-name" href="#user_userInfo">
                                {/*{userInfo.NickName == null ? '未填写' : userInfo.NickName}*/}
                            </a>
                        </div>
                        <div className="pull-left">
                            <h5 style={{ color: 'white' }}>普通用户</h5>
                        </div>
                    </div>
                    <div className="clearfix"></div>
                </div>
                <div className="order-bar">
                    <div className="col-xs-3">
                        <a href="#shopping_orderList" style={{ color: 'black' }}>
                            <i className="icon-list icon-3x"></i>
                            <div className="name">全部订单</div>
                        </a>
                    </div>
                    <div className="col-xs-3 ">
                        <a href="#shopping_orderList?type=WaitingForPayment" style={{ color: 'black' }}>
                            <i className="icon-credit-card icon-3x"></i>
                            <div className="name">待付款</div>
                        </a>
                    </div>
                    <div className="col-xs-3">
                        <a href="#shopping_orderList?type=Send" style={{ color: 'black' }}>
                            <i className="icon-truck icon-3x"></i>
                            <div className="name">待收货</div>
                        </a>
                    </div>
                    <div className="col-xs-3">
                        <a href="#shopping_evaluation" style={{ color: 'black' }}>
                            <i className="icon-star icon-3x"></i>
                            <div className="name">待评价</div>
                        </a>
                    </div>
                    <div className="clearfix"></div>
                </div>
                <div className="list-group">
                    <a className="list-group-item" href="#user_receiptList">
                        <span className="icon-chevron-right pull-right"></span>
                        <span className="pull-right value" style={{ display: 'none' }}></span>
                        <strong>收货地址</strong>
                    </a>

                    <a className="list-group-item" href="#user_favors">
                        <span className="icon-chevron-right pull-right"></span>
                        <span className="pull-right value" style={{ display: 'none' }}></span>
                        <strong>我的收藏</strong>
                    </a>

                    <a className="list-group-item" href="#user_scoreList">
                        <span className="icon-chevron-right pull-right"></span>
                        <span className="pull-right value" style={{ display: 'none' }}>0</span>
                        <strong>我的积分</strong>
                    </a>

                    <a className="list-group-item" href="#user_coupon">
                        <span className="icon-chevron-right pull-right"></span>
                        <span className="pull-right value" style={{ display: 'none' }}>undefined</span>
                        <strong>我的优惠券</strong>
                    </a>
                </div>
                <div className="list-group">
                    <a className="list-group-item" href="#user_accountSecurity_index">
                        <span className="icon-chevron-right pull-right"></span>
                        <span data-bind="text: value,visible:value" className="pull-right value" style={{ display: 'none' }}></span>
                        <strong>账户安全</strong>
                    </a>

                    <a className="list-group-item" href="javascript:"
                        onClick={() => null}>
                        <span className="icon-chevron-right pull-right"></span>
                        <span className="pull-right value" style={{ display: 'none' }}></span>
                        <strong>退出</strong>
                    </a>
                </div>
            </div>
        );
    }
}
import { componentsDir, Component } from 'mobileComponents/common';
import * as common from 'mobileComponents/common'
import { PageComponent, PageView } from 'mobileControls';
import { MemberService, Service, UserInfo, userData } from 'userServices';

let member = Service.createService(MemberService);

requirejs([`css!${componentsDir}/member/control`]);
import * as ui from 'ui';
export class Props {
    showBalance: boolean = false;
    showLevel: boolean = false;
    showScore: boolean = false;
    sellsCenter: 'showToMember' | 'showToSells' = 'showToMember';
}

export interface State extends Props {
    balance: number,
    userInfo: UserInfo
}

export default class MemberControl extends Component<Props, State>{

    persistentMembers = [];
    
    constructor(props) {
        // props = Object.assign(new Props(), props);
        // debugger;
        super(props);
        console.assert(this.state != null);
        this.state.balance = userData.balance.value;
        userData.balance.add((value) => {
            this.state.balance = value;
            this.setState(this.state);
        });
        member.userInfo().then(userInfo => {
            this.state.userInfo = userInfo;
            this.setState(this.state);
        });
    }
    _render(h) {
        // let balance = this.state.balance;
        //let userInfo = this.state.userInfo || {} as UserInfo;
        let { balance, userInfo, showBalance, showLevel, sellsCenter } = this.state;
        userInfo = userInfo || {} as UserInfo;
        return (
            <div className="memberControl">
                <div className="mobile-user-info">
                    <a href="#user_userInfo" className="pull-left" style={{ margin: '-8px 20px 0px 0px' }}>
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
                                {userInfo.NickName == null ? '未填写' : userInfo.NickName}
                            </a>
                        </div>
                        <div className="pull-left">
                            {showLevel ?
                                <h5 style={{ color: 'white' }}>普通用户</h5>
                                : null
                            }
                        </div>
                        {balance != null && showBalance ?
                            <div className="pull-right">
                                <a href="#user_rechargeList" style={{ color: 'white' }}>
                                    <h5>余额&nbsp;&nbsp;
                                        <span className="price">￥{balance.toFixed(2)}</span>&nbsp;&nbsp;
                                        <span className="icon-chevron-right"></span>
                                    </h5>
                                </a>
                            </div>
                            : null}
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
                    <a className="list-group-item">
                        <span className="icon-chevron-right pull-right"></span>
                        <strong>销售员中心</strong>
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
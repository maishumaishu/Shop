import { componentsDir, Control, ControlProps } from 'user/components/common';
import { MemberService } from 'userServices/memberService';
import { userData } from 'userServices/userData';
import { imageUrl } from 'userServices/service';

let member = new MemberService();

requirejs([`css!${componentsDir}/member/control`]);

export interface Props extends ControlProps<MemberControl> {
    // showBalance?: boolean,// = false;
    // showLevel?: boolean,// = false;
    // showScore?: boolean,// = false;
    // sellsCenter?: 'showToMember' | 'showToSells',// = 'showToMember';
}

export interface State {
    balance: number,
    score: number,
    userInfo: UserInfo,
    bg?: string,
    showBalance?: boolean,// = false;
    showLevel?: boolean,// = false;
    showScore?: boolean,// = false;
    sellsCenter?: 'showToMember' | 'showToSells',// = 'showToMember';
}

export default class MemberControl extends Control<Props, State>{

    static default_bg = '../../user/components/member/images/bg_user.png';

    get persistentMembers(): (keyof State)[] {
        return ["showBalance", "showLevel", "showScore", "sellsCenter", "bg"];
    }

    constructor(props) {
        super(props);
        this.state = {
            balance: userData.balance.value,
            score: userData.score.value,
            userInfo: {} as UserInfo,
            sellsCenter: 'showToMember'
        };

        this.state.balance = userData.balance.value;
        userData.balance.add((value) => {
            this.state.balance = value;
            this.setState(this.state);
        });
        // member.userInfo().then(userInfo => {
        //     this.state.userInfo = userInfo;
        //     this.setState(this.state);
        // });
        this.state.userInfo = userData.userInfo.value;
        this.subscribe(userData.userInfo, (value) => {
            this.state.userInfo = value;
            this.setState(this.state);
        })
    }

    _render(h) {
        let { balance, userInfo, showBalance, showLevel, sellsCenter, showScore, bg, score } = this.state;
        let bg_url = bg ? imageUrl(bg) : MemberControl.default_bg;

        userInfo = userInfo || {} as UserInfo;
        return (
            <div className="memberControl">
                <div className="mobile-user-info text-center" style={{ backgroundImage: `url(${bg_url})` }}>
                    <a href="#user_userInfo">
                        <img src={userInfo.HeadImageUrl} className="img-circle img-full"
                            title="上传头像"
                            ref={(e: HTMLImageElement) => e ?
                                ui.renderImage(e, {
                                    imageSize: { width: 100, height: 100 }
                                }) : null} />
                    </a>
                    <div className="nick-name">
                        {userInfo.NickName == null ? '未填写' : userInfo.NickName}
                    </div>

                    {showBalance ?
                        <div className="balance text-right">
                            <span>余额</span>
                            <span className="price">￥{(balance || 0).toFixed(2)}</span>
                        </div> : null}

                </div>
                {/* <div className="mobile-user-info">
                    <a href="#user_userInfo" className="pull-left" style={{ margin: '0 20px 0px 0px' }}>
                        <img className="img-circle img-full" title="上传头像"
                            src={'userInfo.HeadImageUrl'}
                            ref={(e: HTMLImageElement) => {
                                if (!e) return;

                                ui.renderImage(e);
                            }} />
                    </a>

                    <div>
                        <div style={{ width: '100%', height: 40 }}>
                            <a className="nick-name pull-left" href="#user_userInfo">
                                {userInfo.NickName == null ? '未填写' : userInfo.NickName}
                            </a>
                            {showScore ?
                                <div className="pull-right">
                                    <h5 style={{ color: 'white' }}>积分&nbsp;&nbsp;
                                    <span className="score">{(balance || 0)}</span>&nbsp;&nbsp;
                                    <span className="icon-chevron-right"></span>
                                    </h5>
                                </div> : null}
                        </div>
                        <div>
                            <div className="pull-left">
                                {showLevel ?
                                    <h5 style={{ color: 'white' }}>普通用户</h5>
                                    : null
                                }
                            </div>
                            {showBalance ?
                                <div className="pull-right">
                                    <a href="#user_rechargeList" style={{ color: 'white' }}>
                                        <h5>余额&nbsp;&nbsp;
                                        <span className="price">￥{(balance || 0).toFixed(2)}</span>&nbsp;&nbsp;
                                        <span className="icon-chevron-right"></span>
                                        </h5>
                                    </a>
                                </div>
                                : null}
                        </div>
                    </div>
                    <div className="clearfix"></div>
                </div> */}
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

                    <a className="list-group-item" href="#user_coupon">
                        <span className="icon-chevron-right pull-right"></span>
                        <span className="pull-right value" style={{ display: 'none' }}>undefined</span>
                        <strong>我的优惠券</strong>
                    </a>

                    {
                        showScore ?
                            <a className="list-group-item" href="#user_scoreList">
                                <span className="icon-chevron-right pull-right"></span>
                                <span className="pull-right value price" style={{ paddingRight: 8, display: score ? null : 'none' }}>{score || 0}</span>
                                <strong>我的积分</strong>
                            </a> : null
                    }
                </div>
                {
                    sellsCenter ?
                        <div className="list-group">
                            <a className="list-group-item">
                                <span className="icon-chevron-right pull-right"></span>
                                <strong>销售员中心</strong>
                            </a>
                        </div> : null
                }

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
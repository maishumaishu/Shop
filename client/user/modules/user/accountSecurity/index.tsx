import { defaultNavBar, app } from 'site';
import { MobileBindingPageArguments } from 'modules/user/accountSecurity/mobileBinding';
import { MemberService } from 'user/services/memberService';
import { FormValidator, rules } from 'dilu';
import siteMap from 'siteMap';

export default function (page: chitu.Page) {
    class IndexPage extends React.Component<{ userInfo: UserInfo }, { userInfo: UserInfo }>{
        constructor(props) {
            super(props);
            this.state = { userInfo: this.props.userInfo };
        }
        showMobileBindingPage() {
            let args: MobileBindingPageArguments = {
                mobileChanged: (value) => {
                    this.state.userInfo.Mobile = value;
                    this.setState(this.state);
                }
            }
            app.redirect(siteMap.nodes.user_accountSecurity_mobileBinding, args);
        }
        render() {
            let userInfo = this.state.userInfo;
            return [
                <header key="h">
                    {defaultNavBar(page, { title: '账户安全' })}
                </header>,
                <section key="v">
                    <div className="container">
                        <div className="list-group">
                            <a href="#user_accountSecurity_loginPassword" className="list-group-item row">
                                <strong className="name">登录密码</strong>
                                <i className="icon-chevron-right pull-right"></i>
                                {/*<span data-bind="visible:!passwordSetted()" className="pull-right text-primary" style={{ paddingRight: 10 }}>未设置</span>*/}
                                <div style={{ paddingTop: 10 }}>设置登录密码，可以使用手机和密码登录</div>
                            </a>
                            <a href="javascript:" className="list-group-item   row" onClick={() => this.showMobileBindingPage()}>
                                <strong className="name">手机绑定</strong>
                                <i className="icon-chevron-right pull-right"></i>
                                <span className={userInfo.Mobile ? 'pull-right' : "pull-right text-primary"} style={{ paddingRight: 10 }}>
                                    {userInfo.Mobile ? userInfo.Mobile : '未设置'}
                                </span>
                                <div style={{ paddingTop: 10 }}>绑定手机后，你可以通过手机找回密码</div>
                            </a>
                            <a href="#user_accountSecurity_paymentPassword" className="list-group-item row">
                                <strong className="name">支付密码</strong>
                                <i className="icon-chevron-right pull-right"></i>
                                <span data-bind="visible:!paymentPasswordSetted()" className="pull-right text-primary" style={{ paddingRight: 10 }}>未设置</span>
                                <div style={{ paddingTop: 10 }}>设置支付密码后，使用余额支付需要密码</div>
                            </a>
                        </div>
                        <div className="list-group">
                        </div>
                    </div>
                </section>
            ]
        }
    }


    let member = new MemberService();
    member.userInfo().then(userInfo => {
        ReactDOM.render(<IndexPage userInfo={userInfo} />, page.element);
    })
}
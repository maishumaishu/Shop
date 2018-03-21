import { parseUrlParams, shopName } from 'share/common';
import { socket_url, loadjs, WebSockentMessage } from 'common'
import { WeiXinService } from 'services/weixin'
import { Props as OpenIdPageProps, OpenIdPage } from 'modules/openid'
import app from 'application';
export default async function (page: chitu.Page) {

    let props: OpenIdPageProps = {
        weixin: page.createService(WeiXinService),
        title: '登录',
        buttonText: '确定登录',
        content: {
            normal: `确定要登录到${shopName}商家后台系统吗`,
            success: '已成功登录',
            fail: '登录号失败，请重新扫描二维码'
        }
    }

    ReactDOM.render(<OpenIdPage {...props} />, page.element);
}
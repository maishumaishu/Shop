import { parseUrlParams, shopName } from 'share/common';
import { loadjs, WebSockentMessage } from 'common'
import { WeiXinService } from 'services/weixin'
import { Props as OpenIdPageProps, OpenIdPage } from 'modules/openid'
import app from 'application';
export default async function (page: chitu.Page) {

    let props: OpenIdPageProps = {
        weixin: page.createService(WeiXinService),
        title: '绑定微信',
        buttonText: '确定绑定',
        content: {
            normal: `确定要绑定微信号到${shopName}商家后台系统吗`,
            success: '已成功绑定微信号',
            fail: '绑定微信号失败，请重新扫描二维码'
        }
    }

    ReactDOM.render(<OpenIdPage {...props} />, page.element);
}
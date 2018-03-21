import { parseUrlParams } from 'share/common';
import { socket_url, loadjs } from 'common'
import { WeiXinService } from 'services/weixin'
import { Props as OpenIdPageProps, OpenIdPage } from 'weixin/modules/openid'
import app from 'application';

export default function (page: chitu.Page) {
    let props: OpenIdPageProps = {
        weixin: page.createService(WeiXinService),
        title: '解绑微信',
        buttonText: '确定解绑',
        content: {
            normal: '确定要解绑微信号吗',
            success: '已成功解绑微信号',
            fail: '解绑失败，请重新扫描二维码'
        }
    }

    ReactDOM.render(<OpenIdPage {...props} />, page.element);
}
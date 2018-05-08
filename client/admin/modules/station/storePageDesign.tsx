import { MobilePageDesigner, Props } from 'components/mobilePageDesigner';
import { StationService as AdminStation } from 'admin/services/station';
import { StationService as UserStation } from 'user/services/stationService';
import { AppError, guid } from 'share/common'
import { Control } from 'components/common';
export default async function (page: chitu.Page) {

    let arr = page.name.split('_');
    let storePage = arr[arr.length - 1];

    let adminStation = page.createService(AdminStation);
    let userStation = page.createService(UserStation);

    let func = userStation.pages[storePage] as Function;
    if (func == null)
        throw new Error(`Store page ${storePage} is not exists.`);

    let showComponentPanel = storePage == 'home';
    let pageData: PageData = await func.apply(userStation.pages);
    let props: Props = {
        pageData,
        pageDatas: userStation.pages,
        save: adminStation.savePageData.bind(adminStation),
        showMenuSwitch: true,
        showComponentPanel
    }
    if (storePage == 'menu') {
        let menuControl = pageData.controls.filter(o => o.controlName == storePage)[0];
        console.assert(menuControl != null);
        define('components/menu_design_body/control', ["require", "exports"], function (require, exports) {
            exports.default = class MenuBody extends Control<any, any> {
                persistentMembers: string[];
                _render(h: any): JSX.Element | JSX.Element[] {
                    let msg = <div>
                        <div>点击右边操作面板的</div>
                        <b>"点击添加菜单项"</b>
                        <div>按钮可以添加菜单项</div>
                    </div>;
                    return <h4 style={{ padding: "180px 40px 0px 40px", textAlign: 'center', lineHeight: '180%' }}>
                        {msg}
                    </h4>
                }
                get hasEditor() {
                    return false;
                }
            }
        })

        pageData.controls.push({ controlName: 'menu_design_body', controlId: guid(), position: 'view', save: false });
    }



    ReactDOM.render(<MobilePageDesigner {...props} />, page.element);
}

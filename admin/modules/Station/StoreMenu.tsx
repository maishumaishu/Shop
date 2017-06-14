import { default as station, PageData, ControlData, guid } from 'services/Station';
import { MobilePageDesigner } from 'modules/Station/Components/MobilePageDesigner';
import { default as MenuControl, MenuNode, Props as MenuProps } from 'mobileComponents/menu/control';
import { default as MenuEditor } from 'mobileComponents/menu/editor';
import { default as StyleControl } from 'mobileComponents/style/control';
import { Component, h } from 'mobileComponents/common';
import { PageComponent, PageView, PageFooter } from 'mobileControls';
export default function (page: chitu.Page) {
    requirejs([`css!${page.routeData.actionPath}.css`]);
    ReactDOM.render(<StoreMenuPage />, page.element);
}
class StoreMenuPage extends React.Component<{}, {}>{
    private editorElement: HTMLElement;
    private menuControl: MenuControl;
    private designer: MobilePageDesigner;

    render() {
        let menuPros: MenuProps = {
            menuNodes: [
                { name: '首页' },
                { name: '个人中心' }
            ]
        };
        let menuNodes = [
            { name: '首页' },
            { name: '个人中心' }
        ];
        let pageData = {
            footer: {
                controls: [
                    { controlId: guid(), controlName: 'menu', data: { menuNodes }, selected: true },
                    { controlId: guid(), controlName: 'style' }
                ]
            }
        } as PageData;

        return (
            <MobilePageDesigner pageData={pageData}>
            </MobilePageDesigner>
        );
    }
}
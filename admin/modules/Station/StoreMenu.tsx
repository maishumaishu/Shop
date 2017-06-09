import { default as station, PageData, ControlData } from 'services/Station';
import { MobilePage } from 'modules/Station/Components/MobilePage';
import { MobilePageDesigner } from 'modules/Station/Components/MobilePageDesigner';
import { default as MenuControl, MenuNode, Props as MenuProps } from 'mobileComponents/menu/control';
import { default as MenuEditor } from 'mobileComponents/menu/editor';
import { default as StyleControl } from 'mobileComponents/style/control';
import { PageComponent, PageView, PageFooter } from 'mobileControls';
export default function (page: chitu.Page) {
    requirejs([`css!${page.routeData.actionPath}.css`]);
    ReactDOM.render(<StoreMenuPage />, page.element);
}
class StoreMenuPage extends React.Component<{}, {}>{
    private editorElement: HTMLElement;
    private menuControl: MenuControl;
    componentDidMount() {
    }
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
            controls: [
                // { controlName: 'menu', data: menuPros }
            ]
        } as PageData;
        return (
            <MobilePageDesigner>
                <PageComponent>
                    <PageFooter>
                        <MenuControl menuNodes={menuNodes}
                            ref={o => this.menuControl = o || this.menuControl} />
                    </PageFooter>
                </PageComponent>
            </MobilePageDesigner>
        );
    }
}
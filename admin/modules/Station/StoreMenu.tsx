import { default as station, PageData, ControlData } from 'services/Station';
import { MobilePage } from 'modules/Station/Components/MobilePage';
import { MobilePageDesigner } from 'modules/Station/Components/MobilePageDesigner';
import { default as MenuControl, MenuNode, Props as MenuProps } from 'mobileComponents/menu/control';
import { default as MenuEditor } from 'mobileComponents/menu/editor';
export default function (page: chitu.Page) {
    requirejs([`css!${page.routeData.actionPath}.css`]);
    ReactDOM.render(<StoreMenuPage />, page.element);
}

class StoreMenuPage extends React.Component<{}, {}>{
    private editorElement: HTMLElement;
    private menuControl: MenuControl;
    componentDidMount() {
        // ReactDOM.render(<MenuEditor control={this.menuControl} />, this.editorElement);
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
            <div>
                {/*<div style={{ position: 'absolute' }}>
                    <MobilePage pageData={pageData} >
                        <MenuControl menuNodes={menuNodes}
                            ref={o => this.menuControl = o || this.menuControl} />
                    </MobilePage>
                </div>
                <div className="main">
                    <div ref={(e: HTMLElement) => this.editorElement = e || this.editorElement}>
                    </div>

                </div>
                <div className="clearfix">
                </div>*/}
                <MobilePageDesigner>
                    <MenuControl menuNodes={menuNodes}
                        ref={o => this.menuControl = o || this.menuControl} />
                </MobilePageDesigner>
            </div>
        );
    }
}
import components = require('mobile/componentDefines');
import bootbox = require('bootbox');
import { Editor, EditorProps, EditorState } from 'mobile/editor'
import { default as station, PageData, ControlData } from 'services/Station';
import { Button } from 'common/controls';

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
};

export default async function (page: chitu.Page) {
    requirejs([`css!${page.routeData.actionPath}.css`]);

    let editorTypes: { [propName: string]: React.ComponentClass<any> } = {};
    type State = {
        componentInstances: ControlData[],
    }
    class Page extends React.Component<{ pageData: PageData }, State>{
        private selectedContainer: HTMLElement;
        private allContainer: HTMLElement;
        private editors: Editor<EditorState<any>>[];
        private pageId: string;

        constructor(props) {
            super(props);

            this.state = { componentInstances: this.props.pageData.controls };
            this.editors = [];
            this.pageId = this.props.pageData._id;
        }

        save() :Promise<any> {
            let elements = this.selectedContainer.querySelectorAll('li');
            let controls = [];
            for (let i = 0; i < elements.length; i++) {
                let controlId = elements[i].getAttribute('data-controlId');
                let controlName = elements[i].getAttribute('data-controlName');
                if (controlId == null || controlName == null)
                    continue;

                let data = this.getControlData(controlId);
                controls.push({ controlId, controlName, data });
            }
            return station.savePageControls(this.pageId, controls);
        }

        getControlData(controlId: string): Object {
            for (let i = 0; i < this.editors.length; i++) {
                if (this.editors[i].props.controlId == controlId) {
                    return this.editors[i].state.controlData;
                }
            }
            return {};
        }

        componentDidMount() {

            let sortableClean: Function;
            ($(this.allContainer) as any).droppable({
                accept: '.selected li',
                drop(event: Event, ui: { draggable: JQuery, position: JQueryCoordinates, helper: JQuery }) {
                    ui.helper.attr('droped', '');
                    bootbox.confirm("是否删除？", (result) => {
                        ui.helper.removeAttr('droped');
                        if (result) {
                            ui.draggable.remove();
                            $(self.selectedContainer).find('.ui-sortable-placeholder').remove();
                        }
                        else {
                            sortableClean();
                        }
                    })
                    return false;
                }
            });


            let self = this;
            ($([this.selectedContainer]) as any).sortable({
                // revert: true,
                receive(event: Event & { toElement: HTMLElement }, ui: { item: JQuery, placeholder: JQuery, helper: JQuery }) {
                    let controlName = ui.item.attr('data-controlName');
                    console.assert(controlName != null);

                    let element = ui.helper[0];
                    element.removeAttribute('style');
                    let controlId = element.getAttribute('data-controlId');
                    console.assert(controlId == null);

                    self.loadControlInstance(guid(), controlName, element);
                    self.activeControlInstance(element);
                    self.attachClickEvent(element);
                }
            });

            //=======================================================
            // 提取 _clear 方法，使得 _clear 可以延迟执行
            let sortableInstance = ($(this.selectedContainer) as any).sortable('instance');
            let _clear = sortableInstance._clear as Function;
            sortableInstance._clear = function (event, noPropagation) {
                let helper = this.helper as JQuery;
                sortableClean = () => _clear.apply(sortableInstance, [event, noPropagation]);
                if (helper.attr('droped') == null) {
                    sortableClean();
                }
            };
            //=======================================================
        }

        /** 绑定手机控件的点击事件 */
        attachClickEvent(controlElement: HTMLElement) {
            controlElement.onclick = () => {
                let isActive = $(controlElement).hasClass('active');
                this.clearTowPanels();
                if (isActive)
                    this.deactiveControl(controlElement);
                else
                    this.activeControlInstance(controlElement);
            }
        }

        async loadControlInstance(controlId: string, controlName: string, element: HTMLElement, controlData?: any) {
            let editorElement = document.createElement('div');

            element.setAttribute('data-controlName', controlName);
            element.setAttribute('data-controlId', controlId);
            editorElement.className = 'editor';
            editorElement.setAttribute('data-controlName', controlName);
            editorElement.setAttribute('data-controlId', controlId);

            $(page.element).find('.editors').append(editorElement);
            let editorType = await this.getEditorType(controlName);

            let props: EditorProps = { controlElement: element, controlId, controlData, pageId: this.pageId };
            let reactElement = React.createElement(editorType, props);
            let editor = ReactDOM.render(reactElement, editorElement) as Editor<any>;
            this.editors.push(editor);
        }

        getEditorType(controlName: string): Promise<React.ComponentClass<any>> {
            if (editorTypes[controlName] != null) {
                return Promise.resolve(editorTypes[controlName]);
            }

            return new Promise((reslove, reject) => {
                let path = Editor.path(controlName);
                let self = this;
                requirejs([path], function (obj: any) {
                    let editorType = (obj || {}).default as React.ComponentClass<any>;
                    console.assert(editorType != null);
                    editorTypes[controlName] = editorType;
                    reslove(editorType);
                })
            })
        }

        activeControl(controlName: string) {
            this.clearTowPanels();
            $(`.all li[data-controlName=${controlName}]`).addClass('active');
            // console.assert(icon != null);
            // $(this.allContainer).find('li').removeClass('active');
            // $(icon).addClass('active');

            // $(page.element).find('.all .editor').removeClass('active');
            // $(page.element).find(`.all .editor[data-controlName=${controlName}]`).addClass('active');
        }

        showComponentIntroduce(componentElement: HTMLElement) {

        }

        activeControlInstance(controlElement: HTMLElement) {

            let controlName = $(controlElement).attr('data-controlName');
            let controlId = $(controlElement).attr('data-controlId');
            console.assert(!!controlName);

            // 将组件图标设为激活状态
            let icon = this.allContainer.querySelector(`li[data-controlName=${controlName}]`);
            console.assert(icon != null);
            $(this.allContainer).find('li.active').removeClass('active');
            $(icon).addClass('active');

            // 将编辑器设为激活状态
            $(page.element).find('.all .editor').removeClass('active');
            $(page.element).find(`.all .editor[data-controlId=${controlId}]`).addClass('active');

            $(this.selectedContainer).find('li').addClass('mask');
            $(controlElement).removeClass('mask').addClass('active');
        }

        deactiveControl(controlElement: HTMLElement) {
            let controlName: string = $(controlElement).attr('data-controlname');
            console.assert(!!controlName);


            $(`li[data-controlName=${controlName}]`).removeClass('active');
            $(page.element).find(`.all .editor.active`).removeClass('active');

            $(this.selectedContainer).find('li.mask').removeClass('mask');
            $(this.selectedContainer).find('li.active').removeClass('active');
        }

        clearComponentPanel() {
            $('.all li').removeClass('active');
            $('.all .editor').removeClass('active');
        }

        clearMobilePanel() {
            $('.selected li').removeClass('mask').removeClass('active')
        }

        clearTowPanels() {
            this.clearComponentPanel();
            this.clearMobilePanel();
        }

        render() {
            let selectedComponents = this.state.componentInstances || [];
            return (
                <div>
                    <div name="tabs" className="tabbable">
                        <ul className="nav nav-tabs">
                            <li className="pull-left">
                                <h4>页面设计</h4>
                            </li>
                            <li className="pull-right">
                                <Button className="btn btn-primary btn-sm pull-right"
                                    onClick={() => this.save()} >保存</Button>
                            </li>
                        </ul>
                    </div>
                    <div className="view">
                        <div className="pull-left selected">
                            <ul ref={(o: HTMLElement) => this.selectedContainer = o}>
                                {selectedComponents.map((o, i) => (
                                    <li key={o.controlId} data-controlId={o.controlId}
                                        ref={(e: HTMLElement) => {
                                            if (e == null) {
                                                return;
                                            }

                                            this.loadControlInstance(o.controlId, o.controlName, e, o.data);
                                            this.attachClickEvent(e);
                                        }}>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="all">
                            <ul ref={(e: HTMLElement) => this.allContainer = e}>
                                {components.map((c, i) => (
                                    <li key={c.name} data-controlName={c.name}
                                        ref={(element) => {
                                            ($(element) as any).draggable({
                                                connectToSortable: $(this.selectedContainer),
                                                helper: "clone",
                                                revert: "invalid"
                                            });
                                        }}
                                        onClick={(e) => this.activeControl(c.name)}
                                    >
                                        <img src={c.icon} />
                                        {c.displayName}
                                    </li>
                                ))}
                            </ul>
                            <div>
                                <div className="editors">
                                </div>
                                {components.map((c, i) => (
                                    <div key={c.name} className="introduce" data-controlName={c.name} dangerouslySetInnerHTML={{ __html: c.introduce }}>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }

    let pageData = await station.getPageDataByName("首页");
    ReactDOM.render(<Page pageData={pageData} />, page.element);
}
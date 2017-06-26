import components from 'mobileComponents/componentDefines';
import bootbox = require('bootbox');
import { Editor, EditorProps } from 'mobileComponents/editor';
import { componentsDir } from 'mobileComponents/common';
import { default as station, PageData, ControlData } from 'services/station';
// import { Button } from 'common/controls';
import app = require('application');
import FormValidator from 'formValidator';
import * as wz from 'myWuZhui';
import * as ui from 'ui';
import { alert } from 'ui';

requirejs(['css!content/devices.css']);

// let controlsPath = 'mobile/controls'
// let modules = [];
// modules.push(
//     'scripts/hammer', 'scripts/bezier-easing', `${controlsPath}/common`,
//     `${controlsPath}/button`, `${controlsPath}/dataList`, `${controlsPath}/dialog`, `${controlsPath}/htmlView`,
//     `${controlsPath}/imageBox`, `${controlsPath}/indicators`, `${controlsPath}/page`, `${controlsPath}/panel`,
//     `${controlsPath}/tabs`
// );
// requirejs(modules);

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
};

export interface RouteValue {
    onSave(pageData: PageData);
}

export default async function (page: chitu.Page) {
    requirejs([`css!${page.routeData.actionPath}.css`]);

    var routeValue: RouteValue = page.routeData.values || {};
    let editorTypes: { [propName: string]: React.ComponentClass<any> } = {};
    let controlTypes: { [propName: string]: React.ComponentClass<any> } = {};
    type State = {
        componentInstances: ControlData[],
        pageName: string,
        pageRemark: string,
    }
    class Page extends React.Component<{ pageData: PageData }, State>{
        private selectedContainer: HTMLElement;
        private allContainer: HTMLElement;
        private editors: Editor<any, any, React.Component<any, any>, any>[];
        private pageId: string;
        private validator: FormValidator;

        constructor(props) {
            super(props);

            this.state = {
                componentInstances: this.props.pageData['controls'],
                pageName: this.props.pageData.name,
                pageRemark: this.props.pageData.remark
            };
            this.editors = [];
            this.pageId = this.props.pageData._id;
        }

        save(): Promise<any> {
            if (!this.validator.validateForm()) {
                return;
            }
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


            let pageData: PageData = { _id: this.pageId, views: [{ controls }], name: this.state.pageName, remark: this.state.pageRemark };
            return station.savePageData(pageData).then(data => {
                if (routeValue.onSave) {
                    routeValue.onSave(pageData);
                }
                return data;
            });
        }

        getControlData(controlId: string): Object {
            //TODO:
            // for (let i = 0; i < this.editors.length; i++) {
            //     if (this.editors[i].props.controlId == controlId) {
            //         return this.editors[i].state.controlData;
            //     }
            // }
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
            let formElement = page.element.querySelector('form') as HTMLElement;
            this.validator = new FormValidator(formElement, {
                name: { rules: ['required'], messages: { required: '请输入页面名称' } }
            });
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

        async loadControlInstance(controlId: string, controlName: string, controlHTMLElement: HTMLElement, controlData?: any) {

            controlHTMLElement.setAttribute('data-controlName', controlName);
            controlHTMLElement.setAttribute('data-controlId', controlId);

            let editorHTMLElement = document.createElement('div');
            editorHTMLElement.className = 'editor';
            editorHTMLElement.setAttribute('data-controlName', controlName);
            editorHTMLElement.setAttribute('data-controlId', controlId);
            page.element.querySelector('.editors').appendChild(editorHTMLElement);

            let controlType = await this.getControlType(controlName);
            let controlReactElement = React.createElement(controlType, controlData);
            let control: React.Component<any, any> = ReactDOM.render(controlReactElement, controlHTMLElement);

            let editorType = await this.getEditorType(controlName);
            let editorReactElement = React.createElement(editorType, { control } as EditorProps<any, any, React.Component<any, any>>);
            // let editorElement = 
            // let props: EditorProps<any, any, React.Component<any, any>> = { controlElement: element, controlId, controlData, pageId: this.pageId };
            // let reactElement = React.createElement(editorType, props);
            // let editor = ReactDOM.render(reactElement, editorElement) as Editor<any>;
            // this.editors.push(editor);
        }

        getControlType(controlName: string): Promise<React.ComponentClass<any>> {
            if (controlTypes[controlName] != null) {
                return Promise.resolve(controlTypes[controlName]);
            }

            return new Promise((reslove, reject) => {
                let path = `${componentsDir}/${controlName}/control`; //Editor.path(controlName);
                let self = this;
                requirejs([path], function (obj: any) {
                    let controlType = (obj || {}).default as React.ComponentClass<any>;
                    console.assert(controlType != null);
                    controlTypes[controlName] = controlType;
                    reslove(controlType);
                })
            })
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

        preview() {
            let pageId = this.props.pageData._id;
            if (!pageId) {
                alert(`页面必须保存`);
            }
            open(`#station/preView?pageId=${pageId}`, ':blank');
        }

        render() {
            let selectedComponents = this.state.componentInstances || [];
            return (
                <div>
                    <div name="tabs" className="tabbable">
                        <ul className="nav nav-tabs">
                            <li className="pull-left">
                                <h4>页面装修</h4>
                            </li>
                            <li className="pull-right">
                                <button className="btn btn-primary btn-sm"
                                    onClick={() => this.preview()} >预览</button>
                                <button className="btn btn-primary btn-sm"
                                    ref={(e: HTMLButtonElement) => {
                                        if (!e) return;
                                        let element = document.createElement('div');
                                        React.render(<h5>
                                            <i className="icon-ok-sign icon-2x text-success" />
                                            <span style={{ marginLeft: 10 }}>保存页面成功</span>
                                        </h5>, element);
                                        e.onclick = ui.buttonOnClick(() => this.save(),
                                            {
                                                toast: element

                                            })
                                    }}
                                >保存</button>
                                <button className="btn btn-primary btn-sm"
                                    onClick={() => {
                                        return app.back();
                                    }} >返回</button>
                            </li>
                        </ul>
                    </div>
                    <div className="view">
                        <div className="marvel-device iphone5c blue pull-left">
                            <div className="top-bar"></div>
                            <div className="sleep"></div>
                            <div className="volume"></div>
                            <div className="camera"></div>
                            <div className="sensor"></div>
                            <div className="speaker"></div>
                            <div className="screen">
                                <div className="selected">
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
                            </div>
                            <div className="home"></div>
                            <div className="bottom-bar"></div>
                        </div>

                        <div className="all">
                            <h5>页面信息</h5>
                            <form className="row" style={{ height: 40 }}>
                                <div className="col-xs-4">
                                    <label className="control-label pull-left" style={{ paddingTop: 8 }}>名称</label>
                                    <div style={{ paddingLeft: 40 }}>
                                        <input name="name" className="form-control" placeholder="请输入页面名称（选填）"
                                            ref={(e: HTMLInputElement) => {
                                                if (!e) return;
                                                e.value = this.state.pageName || '';
                                                e.onchange = () => {
                                                    this.state.pageName = e.value;
                                                    this.setState(this.state);
                                                }
                                            }} />
                                    </div>
                                </div>
                                <div className="col-xs-8">
                                    <label className="control-label pull-left" style={{ paddingTop: 8 }}>备注</label>
                                    <div style={{ paddingLeft: 40 }}>
                                        <input name="remark" className="form-control pull-left" placeholder="请输入页面备注（必填）"
                                            ref={(e: HTMLInputElement) => {
                                                if (!e) return;
                                                e.value = this.state.pageRemark || '';
                                                e.onchange = () => {
                                                    this.state.pageRemark = e.value;
                                                    this.setState(this.state);
                                                }
                                            }} />
                                    </div>
                                </div>
                            </form>
                            <hr />
                            <h5>页面组件</h5>
                            <ul className="components-panel" ref={(e: HTMLElement) => this.allContainer = e}>
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

    let { pageId, templateId } = page.routeData.values;
    let pageData = {} as PageData;// PageData();// 
    if (pageId)
        pageData = await station.pageData(pageId);
    else if (templateId)
        pageData = await station.pageDataByTemplate(templateId);

    ReactDOM.render(<Page pageData={pageData} />, page.element);
}
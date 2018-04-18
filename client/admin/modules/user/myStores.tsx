import { UserService, Application } from 'adminServices/user';
import { FormValidator, rules } from 'dilu';
// import { Page, app } from 'Application';
import * as ui from 'ui';
import app from 'application';
import siteMap from '../../siteMap';
export default async function (page: chitu.Page) {
    // requirejs([`css!${page.name}.css`]);
    app.loadCSS(page.name);
    let userService = page.createService(UserService);
    let apps = await userService.applications();
    class MyStoresPage extends React.Component<{}, { stores: Array<Application> }>{
        private dialogElement: HTMLElement;
        private nameInput: HTMLInputElement;
        private validator: FormValidator;
        constructor(props) {
            super(props);
            this.state = { stores: apps };
        }
        componentDidMount() {
            // this.validator = new FormValidator(this.dialogElement, {
            //     name: { rules: ['required'], display: '店铺名称' }
            // })
            let nameElement = this.dialogElement.querySelector('[name="name"]') as HTMLInputElement;
            this.validator = new FormValidator(this.dialogElement,
                { name: "name", rules: [rules.required('店铺名称')] }
            )
        }
        async  save(app: Application): Promise<any> {
            let isValid = await this.validator.check();
            if (!isValid) {
                return Promise.resolve();
            }

            let p: Promise<any>;
            if (!app.Id) {
                p = userService.addApplication(app).then(data => {
                    this.state.stores.push(app);
                });
            }
            else {
                p = userService.updateApplication(app).then(data => {
                    this.setState(this.state);
                });
            }

            p.then(() => {
                ui.hideDialog(this.dialogElement);
                this.setState(this.state)
            });
            return p;
        }
        delete(app: Application) {
            return userService.deleteApplication(app).then(data => {
                this.state.stores = this.state.stores.filter(o => o != app);
                this.setState(this.state);
                return data;
            });
        }
        showDialog(app: Application) {
            let msg = app.Id == null ? '创建店铺成功' : '更新店铺成功';
            ReactDOM.render(
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title">创建店铺</h4>
                        </div>
                        <div className="modal-body form-horizontal">
                            <div className="form-group">
                                <label className="col-sm-2">
                                    名称
                                </label>
                                <div className="col-sm-10">
                                    <input name="name" type="text" className="form-control" autoFocus={true}
                                        ref={(e: HTMLInputElement) => {
                                            if (!e) return;
                                            this.nameInput = e;
                                            e.value = app.Name || '';
                                        }} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal"
                                ref={(e: HTMLButtonElement) => {
                                    if (!e) return;
                                    e.onclick = () => ui.hideDialog(this.dialogElement)

                                }}>取消</button>
                            <button type="button" className="btn btn-primary"
                                ref={(e: HTMLButtonElement) => {
                                    if (!e) return;
                                    e.onclick = ui.buttonOnClick(() => {
                                        app.Name = this.nameInput.value;
                                        return this.save(app);
                                    }, { toast: msg })
                                }}>确定</button>
                        </div>
                    </div>
                </div>, this.dialogElement);

            ui.showDialog(this.dialogElement);
        }
        edit(app: Application) {
            this.nameInput.value = app.Name;
            ui.showDialog(this.dialogElement);
        }
        render() {
            let stores = this.state.stores || [];
            return (
                <div>
                    <div className="modal fade" role="dialog"
                        ref={(e: HTMLElement) => this.dialogElement = e || this.dialogElement}>

                    </div>
                    <ul>
                        {stores.map(o =>
                            <li key={o.Id}>
                                <div className="header">
                                    <p>
                                        <span className="smaller lighter green interception">{o.Name}</span>
                                        <i className="icon-remove pull-right"
                                            ref={(e: HTMLElement) => {
                                                if (!e) return;
                                                e.onclick = ui.buttonOnClick(() => this.delete(o), { confirm: `你确定要删除店铺'${o.Name}'?` });
                                            }} />
                                    </p>
                                </div>
                                <div className="body">
                                    <div>
                                        <div className="pull-left">
                                            名称
					                        </div>
                                        <div className="text interception">
                                            {o.Name}
                                        </div>
                                    </div>
                                </div>
                                <div className="footer">
                                    <div className="col-xs-6">
                                        <button className="btn btn-primary btn-block"
                                            onClick={() => this.showDialog(o)}>编辑</button>
                                    </div>
                                    <div className="col-xs-6">
                                        <button className="btn btn-success btn-block"
                                            onClick={() => {
                                                let pageName = (siteMap.nodes.home_index as chitu.SiteMapNode).name;
                                                console.assert(pageName != null);
                                                location.href = `?appKey=${o.Id}#${pageName}`;
                                            }}
                                        >进入</button>
                                    </div>
                                </div>
                            </li>
                        )}
                        <li>
                            <div className="header">
                                <p className="smaller lighter green">
                                    创建店铺
                                    </p>
                            </div>
                            <div onClick={() => this.showDialog({} as Application)} className="add">
                                <i className="icon-plus" style={{ fontSize: 120 }}></i>
                            </div>
                        </li>
                    </ul>
                </div>
            );
        }
    }
    ReactDOM.render(<MyStoresPage />, page.element);
} 
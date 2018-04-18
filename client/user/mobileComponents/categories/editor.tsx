import { Editor, EditorProps } from 'mobileComponents/editor';
import { State as ControlState, default as CategoriesControl } from 'mobileComponents/categories/control';
import { ShoppingService } from 'adminServices/shopping'
import * as ui from 'ui';
import { FormValidator, rules, Rule, InputElement } from 'dilu';
import { imageUrl } from 'adminServices/service';

export interface EditorState extends Partial<ControlState> {
    categories?: Category[]
}

const emptyImage = 'data:image/png;base64,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';

export default class CategoriesEditor extends Editor<EditorProps, EditorState>{

    private dialogElement: HTMLElement;
    private sortNumberInput: HTMLInputElement;
    private nameInput: HTMLInputElement;
    private remarkInput: HTMLInputElement;
    private hiddenInput: HTMLInputElement;
    private validator: FormValidator;
    private picture: HTMLImageElement & { value: string };
    private control: CategoriesControl;
    private currentItem: Category;
    private showIconsInput: HTMLInputElement;
    private shopping: ShoppingService;


    constructor(props) {
        super(props)
        this.control = this.props.control as CategoriesControl;
        this.shopping = this.elementPage.createService(ShoppingService);
        this.shopping.categories().then(categories => {
            this.state.categories = categories;
            this.setState(this.state);
        });
    }
    save() {
        if (!this.validator.check()) {
            return Promise.reject("form validate fail");
        }

        var category = Object.assign({}, this.currentItem);
        category.Name = this.nameInput.value;
        category.Remark = this.remarkInput.value;
        category.ImagePath = this.picture.value;
        category.SortNumber = this.sortNumberInput.value ? Number.parseInt(this.sortNumberInput.value) : null;

        if (category.Id)
            return this.shopping.updateCategory(category)
                .then(o => {
                    var c = this.state.categories.filter(o => o.Id == category.Id)[0];
                    Object.assign(c, category);
                    this.setState(this.state);
                    ui.hideDialog(this.dialogElement);
                });

        return this.shopping.addCategory(category).then(data => {
            Object.assign(category, data);
            this.state.categories.push(category);
            this.setState(this.state);
            ui.hideDialog(this.dialogElement)
        });

    }
    setState(value) {
        this.control.state.categories = this.state.categories;
        super.setState(value);
    }
    edit(category?: Category) {
        this.validator.clearErrors();
        this.dialogElement.querySelectorAll('input, select, img')
            .forEach((o: HTMLInputElement | HTMLSelectElement) => o.value = '');

        if (!category)
            category = {} as Category;

        this.currentItem = category;

        this.sortNumberInput.value = (category.SortNumber == null ? '' : category.SortNumber).toString();
        this.nameInput.value = category.Name || '';
        this.remarkInput.value = category.Remark || '';
        this.hiddenInput.checked = category.Hidden || false;
        this.picture.value = imageUrl(category.ImagePath || emptyImage);

        ui.showDialog(this.dialogElement);
    }
    componentDidMount() {
        // var pic = Object.assign(this.picture, { name: '图片' });
        Object.defineProperty(this.picture, 'value', {
            get: function () {
                return this.src;
            },
            set: function (value) {
                this.src = value;
            }
        })

        let { showIcons } = this.state;
        let checkPicture = function (value) {
            if (!showIcons)
                return true;

            return value && value != emptyImage;
        }

        let { required, custom } = rules;
        this.validator = new FormValidator(this.dialogElement,
            { name: "name", rules: [required()] },//rule: rules.required(this.nameInput)
            {
                name: "picture", rules: [custom(checkPicture, "图片不允许为空")]
                //rule: new Rule(this.picture, checkPicture.bind(this.validator), "图片不允许为空"),
            }
        )

        this.showIconsInput.checked = this.state.showIcons;
        this.showIconsInput.onchange = () => {
            this.state.showIcons = this.showIconsInput.checked;
            this.setState(this.state);
        }
    }
    onFileChanged(e: HTMLInputElement) {
        if (!e.files[0]) {
            return;
        }

        ui.imageFileToBase64(e.files[0], { width: 100, height: 100 })
            .then(data => {
                this.picture.value = data.base64;
            });
    }
    refDeleteButton(e: HTMLButtonElement) {

    }
    render() {
        var { categories, showIcons } = this.state;
        if (categories)
            categories.sort((a, b) => a.SortNumber - b.SortNumber);

        return (
            <div>
                <div className="well">
                    <div className="pull-left" style={{ paddingTop: 4, paddingRight: 10, paddingLeft: 10 }}>
                        显示图标
                    </div>
                    <label className="pull-left switch">
                        <input type="checkbox" className="ace ace-switch ace-switch-5"
                            ref={(e: HTMLInputElement) => this.showIconsInput = e || this.showIconsInput} />
                        <span className="lbl middle"></span>
                    </label>
                    <div className="pull-right">
                        <button className="btn btn-primary" onClick={() => this.edit()}>
                            <i className="icon-plus" style={{ marginRight: 4 }}></i>
                            添加类别
                            </button>
                    </div>
                    <div className="clearfix"></div>
                </div>
                {categories ?
                    <table className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>序号</th>
                                <th>名称</th>
                                <th>备注</th>
                                <th>隐藏</th>
                                <th>图片</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(o =>
                                <tr key={o.Id}>
                                    <td>{o.SortNumber}</td>
                                    <td>{o.Name}</td>
                                    <td>{o.Remark}</td>
                                    <td>{o.Hidden}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <img src={imageUrl(o.ImagePath)} style={{ height: 36 }} />
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button className="btn btn-minier btn-info" style={{ marginRight: 4 }}
                                            ref={(e: HTMLButtonElement) => {
                                                if (!e) return;
                                                e.onclick = () => this.edit(o);
                                            }}>
                                            <i className="icon-pencil"></i>
                                        </button>
                                        <button className="btn btn-minier btn-danger"
                                            ref={(e: HTMLButtonElement) => {
                                                if (!e) return;
                                                e.onclick = ui.buttonOnClick((event) => {
                                                    return this.shopping.deleteCategory(o.Id).then(() => {
                                                        this.state.categories = categories.filter(a => a.Id != o.Id);
                                                        this.setState(this.state);
                                                    });
                                                }, { confirm: `确定要删除类别'${o.Name}'吗?` })
                                            }}>
                                            <i className="icon-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table> : null
                }
                <form name="dlg_edit" className="modal fade"
                    ref={(o: HTMLFormElement) => this.dialogElement = this.dialogElement || o}>
                    <input name="Id" type="hidden" />
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">
                                    <span aria-hidden="true">&times;</span>
                                    <span className="sr-only">Close</span>
                                </button>
                                <h4 className="modal-title">编辑</h4>
                            </div>
                            <div className="modal-body">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <label className="control-label col-sm-2">序号</label>
                                        <div className="col-sm-10">
                                            <input name="sortNumber" className="form-control"
                                                placeholder="商品类别的序号(可空)"
                                                ref={(e: HTMLInputElement) => this.sortNumberInput = e || this.sortNumberInput} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label col-sm-2">名称*</label>
                                        <div className="col-sm-10">
                                            <input name="Name" className="form-control"
                                                placeholder="商品类别的名称(必填)"
                                                ref={(e: HTMLInputElement) => this.nameInput = e || this.nameInput} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label col-sm-2">备注</label>
                                        <div className="col-sm-10">
                                            <input name="Remark" className="form-control"
                                                placeholder="商品类别的备注信息(可空)"
                                                ref={(e: HTMLInputElement) => this.remarkInput = e || this.remarkInput} />
                                        </div>
                                    </div>
                                    <div className="form-group" style={{ display: showIcons ? 'block' : 'none' }}>
                                        <label className="control-label col-sm-2">图片</label>
                                        <div className="col-sm-10">
                                            <div className="well" style={{ margin: 0, padding: 0 }}>
                                                <img style={{ width: 100, height: 100 }}
                                                    ref={(e: HTMLImageElement) => this.picture = e as any || this.picture}
                                                    src={emptyImage} />
                                                <input name="ImageUpload" type="file" id="ImageUpload" multiple={true}
                                                    style={{ position: 'absolute', top: 0, opacity: 0, height: '100%', width: '100%' }}
                                                    ref={(e: HTMLInputElement) => {
                                                        if (!e) return;
                                                        e.onchange = () => this.onFileChanged(e);
                                                    }} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="col-sm-offset-2 col-sm-10">
                                            <div className="checkbox">
                                                <label>
                                                    <input name="Hidden" type="checkbox"
                                                        ref={(e: HTMLInputElement) => {
                                                            if (!e) return;
                                                            this.hiddenInput = e;
                                                            e.onchange = () => {
                                                                this.hiddenInput.value = e.checked as any;
                                                            }

                                                        }} />
                                                    在前台隐藏该类别
                                                    </label>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="modal-footer" style={{ marginTop: 0 }}>
                                <button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
                                <button type="button" className="btn btn-primary"
                                    ref={(e: HTMLButtonElement) => {
                                        if (!e) return;
                                        e.onclick = ui.buttonOnClick(() => this.save(), {
                                            toast: '保存成功!'
                                        });
                                    }}>保存</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}
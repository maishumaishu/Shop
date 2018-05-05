import { Editor, EditorProps } from "../editor";
import { State as ControlState } from './control';
import { PropertiesComponent } from 'admin/modules/shopping/product/properties';
import tips from "admin/tips";
import { ShoppingService } from "admin/services/shopping";
import { FormValidator, rules } from "dilu";
import { ImageInput } from "../../admin/controls/imageInput";
import { StationService } from "../../admin/services/station";

let styles = {
    convertImageFile: {
        position: 'relative',
        left: 0,
        top: 0,
        width: 14,
        height: 30,
        marginTop: -30,
        opacity: 0
    } as React.CSSProperties
}

export interface EditorState extends Partial<ControlState> {
    categories: Array<Category>,
    brands: Array<Brand>,
}

export default class ProductInfoEditor extends Editor<EditorProps, EditorState>  {
    station: StationService;
    argumentsProperties: PropertiesComponent;
    fieldPropertiies: PropertiesComponent;
    priceError: HTMLElement;
    categoryError: HTMLElement;
    validator: FormValidator;
    element: HTMLElement;
    brandDialog: BrandDialog;
    categoryDialog: CategoryDialog;

    constructor(props) {
        super(props);
        this.loadEditorCSS();
        this.station = this.props.elementPage.createService(StationService);
    }
    componentDidMount() {
        let shopping = this.props.elementPage.createService(ShoppingService);
        shopping.categories().then(o => {
            this.state.categories = o;
            this.setState(this.state);
        })
        shopping.brands().then(o => {
            this.state.brands = o.dataItems;
            this.setState(this.state);
        })

        this.validator = new FormValidator(this.element,
            { name: "categoryId", rules: [rules.required("类别不能为空")], errorElement: this.categoryError },
            { name: "name", rules: [rules.required("名称不能为空")] },
            { name: "price", rules: [rules.required("价格不能为空")], errorElement: this.priceError },
            // { name: 'introduce', rules: [rules.required("商品详请不能为空")], errorElement: this.introduceError }
        )
        //  c.state.product.Fields = this.fieldPropertiies.state.properties;
        //
        this.validate = async () => {
            this.state.product.Fields = this.fieldPropertiies.state.properties;
            this.state.product.Arguments = this.argumentsProperties.state.properties;
            let result = await this.validator.check();
            return result;
        }
    }
    bindCategoryId(e: HTMLSelectElement, product: Product, categories: Category[]) {
        if (!e) return;
        this.bindInputElement<Product>(e, product, 'ProductCategoryId');
        let _onchange = e.onchange;
        e.onchange = (event) => {
            if (_onchange)
                _onchange.apply(e, event);

            let category = categories.filter(o => o.Id == e.value)[0];
            if (category) {
                this.state.product.ProductCategoryName = category.Name;
                this.setState(this.state);
            }
        }
    }
    render() {
        let { product, categories, brands } = this.state;
        categories = categories || [];
        brands = brands || [];

        return <div ref={(e: HTMLElement) => this.element = e || this.element}>
            <div key={10} className="row">
                <div className="col-sm-12">
                    <h4>基本信息</h4>
                </div>
            </div>
            <div key={20} className="row form-group">
                <div className="col-md-6">
                    <label className="col-md-3">类别*</label>
                    <div className="col-md-9">
                        <div className="input-group">
                            <select name="categoryId" className="form-control"
                                ref={(e: HTMLSelectElement) => this.bindCategoryId(e, product, categories)} >
                                <option value="">请选择类别</option>
                                {categories.map(o =>
                                    <option key={o.Id} value={o.Id}>{o.Name}</option>
                                )}
                            </select>
                            <span className="input-group-addon"
                                onClick={() => this.categoryDialog.show()}>
                                <i className="icon-plus" />
                            </span>
                        </div>
                        <span className={dilu.FormValidator.errorClassName} style={{ display: 'none' }}
                            ref={(e: HTMLElement) => this.categoryError = e || this.categoryError}></span>
                    </div>
                </div>
                <div className="col-md-6">
                    <label className="col-md-3">名称*</label>
                    <div className="col-md-9">
                        <input name="name" className="form-control" placeholder="请输入商品的名称"
                            ref={(e: HTMLInputElement) => e ? this.bindInputElement(e, product, 'Name') : null} />
                    </div>
                </div>
            </div>
            <div key={30} className="row form-group">
                <div className="col-md-6">
                    <label className="col-lg-3">价格*</label>
                    <div className="col-lg-9">
                        <div className="input-group">
                            <input name="price" className="form-control" placeholder="请输入商品价格"
                                ref={(e: HTMLInputElement) => this.bindInputElement(e, product, 'Price', 'number')} />
                            <span className="input-group-addon">元</span>
                        </div>
                        <span className={dilu.FormValidator.errorClassName} style={{ display: 'none' }}
                            ref={(e: HTMLElement) => this.priceError = e || this.priceError}></span>
                    </div>
                </div>
                <div className="col-md-6">
                    <label className="col-lg-3">SKU</label>
                    <div className="col-lg-9">
                        <input name="sku" className="form-control" placeholder="请输入商品SKU"
                            ref={(e: HTMLInputElement) => this.bindInputElement(e, product, 'SKU')} />
                    </div>
                </div>
            </div>
            <div key={40} className="row form-group">
                <div className="col-md-6">
                    <label className="col-lg-3">品牌</label>
                    <div className="col-lg-9">
                        <div className="input-group">
                            <select className="form-control"
                                ref={(e: HTMLSelectElement) => e ? this.bindInputElement(e, product, 'BrandId') : null}>
                                <option value="">请选择品牌</option>
                                {brands.map(o =>
                                    <option key={o.Id} value={o.Id}>{o.Name}</option>
                                )}
                            </select>
                            <span className="input-group-addon"
                                onClick={() => this.brandDialog.show()}>
                                <i className="icon-plus" />
                            </span>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <label className="col-lg-3">标题</label>
                    <div className="col-lg-9">
                        <input className="form-control">
                        </input>
                    </div>
                </div>
            </div>
            <div key="convertImage" className="row form-group">
                <div className="col-md-6">
                    <label className="col-lg-3">封面图片</label>
                    <div className="col-lg-9">
                        <ImageInput station={this.station} imageId={product.ImagePath}
                            ref={(e) => {
                                if (!e) return;
                                e['componentDidUpdate'] = () => {
                                    product.ImagePath = e.state.imageId;
                                }
                            }} />
                    </div>
                </div>
            </div>
            <hr />
            <PropertiesComponent ref={(e) => this.fieldPropertiies = e || this.fieldPropertiies}
                name="商品规格" properties={product.Fields} emptyText={tips.noProductRegular}
                changed={(properties) => {
                    this.state.product.Fields = properties;
                    this.setState(this.state);
                }}
            />
            <hr />
            <PropertiesComponent ref={(e => this.argumentsProperties = e || this.argumentsProperties)}
                name="商品属性" properties={product.Arguments} emptyText={tips.noProductProperty}
                changed={(properties) => {
                    this.state.product.Arguments = properties;
                    this.setState(this.state);
                }} />
            <hr />
            <CategoryDialog key="categoryDialog"
                container={this} shop={this.props.elementPage.createService(ShoppingService)}
                ref={(e) => this.categoryDialog = e || this.categoryDialog} />
            <BrandDialog key="brandDialog"
                container={this} shop={this.props.elementPage.createService(ShoppingService)}
                ref={(e) => this.brandDialog = e || this.brandDialog} />
            <div key={50} className="row form-group">
                <div className="col-md-12">
                    <input type="checkbox"
                        checked={this.state.hideProperties}
                        onChange={() => {
                            this.state.hideProperties = !this.state.hideProperties;
                            this.setState(this.state);
                        }} />
                    <span>隐藏商品属性</span>
                </div>
            </div>
        </div>
    }
}

type CategoryDialogProps = React.Props<CategoryDialog> & {
    container: ProductInfoEditor,
    shop: ShoppingService,
}

class CategoryDialog extends React.Component<CategoryDialogProps, any>{

    private element: HTMLElement;
    private nameElement: HTMLInputElement;

    constructor(props) {
        super(props);
    }

    show() {
        ui.showDialog(this.element);
    }

    async confirm() {

        let shop = this.props.shop;

        let category = { Name: this.nameElement.value } as Category;
        let result = await shop.addCategory(category);
        Object.assign(category, result);

        let c = this.props.container;
        c.state.categories.push(category);
        c.state.product.ProductCategoryId = category.Id;
        c.state.product.ProductCategoryName = category.Name;
        c.setState(c.state);

        return result;
    }

    render() {
        return (
            <div className="modal fade" ref={(e: HTMLElement) => this.element = e || this.element}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={() => ui.hideDialog(this.element)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title">添加品类</h4>
                        </div>
                        <div className="modal-body form-horizontal">
                            <div className="form-group">
                                <label className="col-sm-2 control-label">名称</label>
                                <div className="col-sm-10">
                                    <input name="name" type="text" className="form-control" placeholder="请输入品类名称"
                                        ref={(e: HTMLInputElement) => this.nameElement = e || this.nameElement} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
                            <button type="button" className="btn btn-primary"
                                ref={async (e: HTMLButtonElement) => {
                                    if (!e) return;
                                    ui.buttonOnClick(e, async () => {
                                        await this.confirm();
                                        ui.hideDialog(this.element);
                                    })

                                }}>确定</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

type BrandDialogProps = React.Props<BrandDialog> & {
    container: ProductInfoEditor,
    shop: ShoppingService,
}

class BrandDialog extends React.Component<BrandDialogProps, any>{

    private element: HTMLElement;
    private nameElement: HTMLInputElement;

    constructor(props) {
        super(props);
    }

    show() {
        ui.showDialog(this.element);
    }

    async confirm() {

        let shop = this.props.shop;

        let brand = { Name: this.nameElement.value } as Brand;
        let result = await shop.addBrand(brand);
        Object.assign(brand, result);

        let c = this.props.container;
        c.state.brands.push(brand);
        c.state.product.BrandId = brand.Id;
        c.setState(c.state);

        return result;
    }

    render() {
        return (
            <div className="modal fade" ref={(e: HTMLElement) => this.element = e || this.element}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={() => ui.hideDialog(this.element)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title">添加品牌</h4>
                        </div>
                        <div className="modal-body form-horizontal">
                            <div className="form-group">
                                <label className="col-sm-2 control-label">名称</label>
                                <div className="col-sm-10">
                                    <input name="name" type="text" className="form-control" placeholder="请输入品牌名称"
                                        ref={(e: HTMLInputElement) => this.nameElement = e || this.nameElement} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
                            <button type="button" className="btn btn-primary"
                                ref={async (e: HTMLButtonElement) => {
                                    if (!e) return;
                                    ui.buttonOnClick(e, async () => {
                                        await this.confirm();
                                        ui.hideDialog(this.element);
                                    })

                                }}>确定</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
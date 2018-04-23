import { Editor, EditorProps } from 'user/components/editor';
import ProductListControl, { State as ControlState, Props as ControlProps, default as Control } from 'user/components/productList/control';
import { ShoppingService } from 'adminServices/shopping';
import { StationService } from 'adminServices/station';
import { imageUrl } from 'services/service';
import { ProductSelectDialog } from 'admin/controls/productSelectDialog';
export interface EditorState extends ControlState {

}

const shopping = new ShoppingService();
const station = new StationService();

export default class ProductListEditor extends Editor<EditorProps, EditorState> {

    templateInput: HTMLTextAreaElement;
    private productsDialog: ProductSelectDialog;
    private productAdd: HTMLElement;

    constructor(props) {
        super(props);
        this.state = {

        } as EditorState;

        this.loadEditorCSS();
    }

    setSourceTypeInput(e: HTMLInputElement) {
        this.setRadioElement(e, "productSourceType");
    }

    setRadioElement(e: HTMLInputElement, member: keyof EditorState) {
        if (!e || e.onchange) return;
        e.checked = (this.state[member] || '').toString() == e.value;
        e.onchange = () => {
            this.state[member] = e.value;
            this.setState(this.state);
        }
    }

    setCheckElement(e: HTMLInputElement, member: keyof EditorState) {
        if (!e || e.onchange) return
        e.checked = this.state[member] as any;
        e.onchange = () => {
            this.state[member] = e.checked as any;
            this.setState(this.state);
        }
    }

    setProductsCountInput(e: HTMLSelectElement) {
        if (!e || e.onchange) return;

        for (let i = 1; i < 9; i++) {
            var option = document.createElement('option');
            option.value = i as any;
            option.text = i as any;
            e.appendChild(option);
        }
        e.value = `${this.state.prodcutsCount}`;
        e.onchange = () => {
            this.state.prodcutsCount = Number.parseInt(e.value);
            this.setState(this.state);
        }
        // e.options[0].selected = true;
    }

    setProductCategoryInput(e: HTMLSelectElement) {
        if (!e || e.onchange) return;

        e.onchange = () => {
            this.state.categoryId = e.value;
            this.setState(this.state);
        }
        shopping.categories().then(categories => {
            for (let i = 0; i < categories.length; i++) {
                var option = document.createElement('option');
                option.value = categories[i].Id;
                option.text = categories[i].Name;
                e.appendChild(option);
            }
            e.value = this.state.categoryId || '';
        });
    }

    setImageFileInput(e: HTMLInputElement) {
        if (!e || e.onchange != null)
            return;

        e.onchange = () => {
            if (!e.files[0])
                return;

            ui.imageFileToBase64(e.files[0], { width: 100, height: 100 })
                .then(r => {
                    // r.base64
                });
        }
    }

    setProductAdd(e: HTMLElement) {
        if (!e || e.onclick)
            return;

        e.onclick = () => {
            this.productsDialog.show((product) => this.productSelected(product));
        }
    }

    setProductDelete(e: HTMLButtonElement, productId: string) {
        if (!e || e.onclick)
            return;

        e.onclick = () => {
            this.state.productIds = this.state.productIds.filter(o => o != productId);
            this.setState(this.state);
        }
    }

    setTemplateInput(e: HTMLTextAreaElement) {
        if (!e) return;

        let ctrl = this.props.control as ProductListControl;
        let tmp = ctrl.state.productTemplate || ctrl.productTemplate();
        this.templateInput = e;
        e.value = tmp;
    }

    updateControlTemplate() {
        let ctrl = this.props.control as ProductListControl;
        this.state.productTemplate = ctrl.state.productTemplate = this.templateInput.value;
        ctrl.setState(ctrl.state);
    }

    recoverControlTemplate() {
        let ctrl = this.props.control as ProductListControl;
        this.state.productTemplate = ctrl.state.productTemplate = '';
        ctrl.setState(ctrl.state);
    }

    productSelected(product: Product): Promise<any> {
        let productIds = this.state.productIds || [];
        let exists = productIds.indexOf(product.Id) >= 0;
        if (exists) {
            ui.alert({ title: "提示", message: '该商品已选择' });
            return Promise.reject({});
        }
        productIds.push(product.Id);

        this.state.productIds = productIds;
        this.setState(this.state);
        return Promise.resolve();
    }

    async renderProducts(container: HTMLElement, productIds: string[]) {
        if (!container) return;

        var products = await shopping.productsByIds(productIds);
        var reactElement =
            <ul className="selected-products">
                {products.map(o =>
                    <li key={o.Id} className="product">
                        <img src={imageUrl(o.ImagePath, 100)} ref={(e: HTMLImageElement) => e ? ui.renderImage(e) : null} />
                        <div className="delete">
                            <button className="btn-link"
                                ref={(e: HTMLButtonElement) => this.setProductDelete(e, o.Id)}>
                                删除
                       </button>
                        </div>
                    </li>
                )}
                <li className="product">
                    <div className="product-add">
                        <i className="icon-plus icon-4x" ref={(e: HTMLElement) => this.setProductAdd(e)} />
                    </div>
                </li>
            </ul>;

        ReactDOM.render(reactElement, container);
    }

    render() {
        let productSourceType = this.state.productSourceType;
        let productIds = this.state.productIds || [];
        let listType = this.state.listType;
        let ctrl = this.props.control as ProductListControl;
        let tmp = this.state.productTemplate || ctrl.productTemplate();
        return (
            <form className="product-list-editor">
                <div className="form-group">
                    <label className="pull-left">数据来源</label>
                    <span>
                        <input name="sourceType" type="radio" value="category"
                            ref={(e: HTMLInputElement) => this.setRadioElement(e, 'productSourceType')} />
                        分类
                    </span>
                    <span>
                        <input name="sourceType" type="radio" value="custom"
                            ref={(e: HTMLInputElement) => this.setRadioElement(e, 'productSourceType')} />
                        手动添加
                    </span>
                </div>
                <div className="form-group">
                    <label className="pull-left">列表样式</label>
                    <span>
                        <input name="styleType" type="radio" value="singleColumn"
                            ref={(e: HTMLInputElement) => this.setRadioElement(e, 'listType')} />
                        单列
                    </span>
                    <span>
                        <input name="styleType" type="radio" value="doubleColumn"
                            ref={(e: HTMLInputElement) => this.setRadioElement(e, 'listType')} />
                        双列
                    </span>
                </div>
                {listType == 'singleColumn' ?
                    [
                        // <div key={10} className="form-group">
                        //     <label className="pull-left">显示商品标题</label>
                        //     <div style={{ display: "block" }}>
                        //         <input name="displayType" type="checkbox" value="true" style={{ marginTop: 8 }}
                        //             ref={(e: HTMLInputElement) => this.setCheckElement(e, 'displayTitle')} />

                        //     </div>
                        // </div>,
                        <div key={20} className="form-group">
                            <label className="pull-left">图片大小</label>
                            <span>
                                <input name="imageSize" type="radio" value="small"
                                    ref={(e: HTMLInputElement) => this.setRadioElement(e, 'imageSize')} />
                                小
                            </span>
                            <span>
                                <input name="imageSize" type="radio" value="medium"
                                    ref={(e: HTMLInputElement) => this.setRadioElement(e, 'imageSize')} />
                                中
                            </span>
                            <span>
                                <input name="imageSize" type="radio" value="large"
                                    ref={(e: HTMLInputElement) => this.setRadioElement(e, 'imageSize')} />
                                大
                            </span>
                        </div>
                    ] : [

                    ]}

                <div className="form-group">
                    <label className="pull-left">规格型号</label>
                    <span style={{ display: "block" }}>
                        <span>
                            <input name="showFields" type="radio" value="independent"
                                ref={(e: HTMLInputElement) => this.setRadioElement(e, 'showFields')} />
                            独立显示规格型号
                            </span>
                        <span>
                            <input name="showFields" type="radio" value="append"
                                ref={(e: HTMLInputElement) => this.setRadioElement(e, 'showFields')} />
                            将规格型号追加到品名后
                            </span>

                    </span>
                </div>

                <div className="form-group">
                    <label className="pull-left">优惠标签</label>
                    <span style={{ display: "block" }}>
                        <input type="checkbox" />
                        对于有优惠的商品显示优惠标签
                    </span>
                </div>

                <div key={10} className="form-group">
                    <label className="pull-left">商品名称</label>
                    <span>
                        <input name="productNameLines" type="radio" value="singleLine"
                            ref={(e: HTMLInputElement) => this.setRadioElement(e, 'productNameLines')} />
                        单行文字
                            </span>
                    <span>
                        <input name="productNameLines" type="radio" value="doubleLine"
                            ref={(e: HTMLInputElement) => this.setRadioElement(e, 'productNameLines')} />
                        双行文字
                        </span>
                </div>
                <div style={{ display: productSourceType == 'category' ? 'block' : 'none' }}>
                    <div className="form-group">
                        <label className="pull-left">商品数量</label>
                        <div>
                            <select className="form-control"
                                ref={(e: HTMLSelectElement) => this.setProductsCountInput(e)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="pull-left">商品类别</label>
                        <div>
                            <select className="form-control"
                                ref={(e: HTMLSelectElement) => this.setProductCategoryInput(e)} >
                                <option value="">所有商品</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="form-group" style={{ display: productSourceType == 'custom' ? 'block' : 'none' }}>
                    <label className="pull-left">选取商品</label>
                    <div style={{ width: 'calc(100% - 100px)' }} ref={(e: HTMLElement) => this.renderProducts(e, productIds)}></div>
                </div>

                <div className="form-group">
                    <ProductSelectDialog shopping={shopping as any} ref={(e: ProductSelectDialog) => this.productsDialog = e || this.productsDialog} />
                    <div className="clearfix"></div>
                </div>

                <div className="form-group">
                    <label className="pull-left">
                        商品模板
                        </label>
                    <div>
                        <textarea className="form-control" style={{ width: 'calc(100% - 100px)', height: 200 }}
                            ref={(e: HTMLTextAreaElement) => {
                                if (!e) return;
                                this.templateInput = e;
                                this.templateInput.value = tmp;
                            }} />
                    </div>
                </div>
                <div className="form-group">
                    <label className="pull-left">

                    </label>
                    <div>
                        <button className="btn btn-primary" type="button"
                            onClick={() => this.updateControlTemplate()}>更新模板</button>
                        <button className="btn btn-default" type="button"
                            onClick={() => this.recoverControlTemplate()}>还原回默认模板</button>
                    </div>
                </div>
            </form>
        );
    }
}



import { Editor, EditorProps } from 'mobileComponents/editor';
import { State as ControlState, Props as ControlProps, default as Control } from 'mobileComponents/singleColumnProduct/control';
import { ShoppingService } from 'adminServices/shopping';
import { StationService } from 'adminServices/station';
import { imageUrl } from 'adminServices/service';

export interface EditorState extends ControlState {

}

const shopping = new ShoppingService();
const station = new StationService();

export default class SingleColumnProductEditor extends Editor<EditorProps, EditorState> {

    private productsDialog: ProductSelectDialog;
    private productAdd: HTMLElement;

    constructor(props) {
        super(props);
        this.state = { productSourceType: 'category', listType: 'doubleColumn' };

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
            this.productsDialog.show();
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

    productSelected(product: Product): boolean {
        let productIds = this.state.productIds || [];
        let exists = productIds.indexOf(product.Id) >= 0;
        if (exists) {
            ui.alert({ title: "提示", message: '该商品已选择' });
            return false;
        }
        productIds.push(product.Id);

        this.state.productIds = productIds;
        this.setState(this.state);
        return true;
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

        return (
            <div>
                {/* <i className=" icon-remove" style={{ display: 'table-cell' }}></i>
                <h5 style={{ display: 'table-cell', paddingLeft: 8 }}>商品列表</h5>
                <hr style={{ marginTop: 18 }} /> */}
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
                    <div className="form-group">
                        <label className="pull-left">显示商品标题</label>
                        <div style={{ display: "block" }}>
                            <input name="displayType" type="checkbox" value="true" style={{ marginTop: 8 }}
                                ref={(e: HTMLInputElement) => this.setCheckElement(e, 'displayTitle')} />

                        </div>
                    </div> : null}

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
                <div style={{ display: productSourceType == 'custom' ? 'block' : 'none' }}
                    ref={(e: HTMLElement) => this.renderProducts(e, productIds)}>

                </div>
                <div className="clearfix"></div>

                <ProductSelectDialog shopping={shopping} ref={(e: ProductSelectDialog) => this.productsDialog = e || this.productsDialog}
                    selected={(p) => this.productSelected(p)} />
            </div>
        );
    }
}


type ProductsDialogProps = { shopping: ShoppingService, selected: (product: Product) => boolean } & React.Props<ProductSelectDialog>;
class ProductSelectDialog extends React.Component<ProductsDialogProps, { products: Product[] }>{

    private element: HTMLElement;
    private dataSource: wuzhui.DataSource<Product>;
    private pagingBarElement: HTMLElement;

    constructor(props) {
        super(props);

        this.state = { products: null };

        var shopping = this.props.shopping;

        this.dataSource = new wuzhui.DataSource({ select: (args) => shopping.products(args) });
        this.dataSource.selectArguments.maximumRows = 15;
        this.dataSource.selectArguments.filter = '!OffShelve';

        this.dataSource.selected.add((sender, args) => {
            this.state.products = args.items;
            this.setState(this.state);
        });
    }

    show() {
        ui.showDialog(this.element);
    }

    productSelected(p: Product) {
        var isOK = true;
        if (this.props.selected) {
            isOK = this.props.selected(p);
        }

        if (!isOK)
            return;

        ui.hideDialog(this.element);
    }

    setPagingBar(e: HTMLElement) {
        if (!e || wuzhui.Control.getControlByElement(e))
            return;
    }

    componentDidMount() {
        let pagingBar = new wuzhui.NumberPagingBar({
            dataSource: this.dataSource, element: this.pagingBarElement,
            pagerSettings: {} as wuzhui.PagerSettings,

            createButton: () => {
                let button = document.createElement('a');
                button.href = 'javascript:';

                let wrapper = document.createElement('li');
                wrapper.appendChild(button);
                this.pagingBarElement.appendChild(wrapper);

                let result = {
                    get visible(): boolean {
                        return button.style.display == 'inline';
                    },
                    set visible(value: boolean) {
                        if (value) {
                            button.style.display = 'inline';
                            return;
                        }

                        button.style.display = 'none';
                    },
                    get pageIndex(): number {
                        var str = button.getAttribute('pageIndex');
                        return Number.parseInt(str);
                    },
                    set pageIndex(value: number) {
                        button.setAttribute('pageIndex', `${value}`);
                    },
                    get text(): string {
                        return button.innerHTML;
                    },
                    set text(value) {
                        button.innerHTML = value;
                    },
                    get active(): boolean {
                        return button.href != null;
                    },
                    set active(value: boolean) {
                        if (value) {
                            button.parentElement.className = 'active'
                            return;
                        }

                        button.parentElement.className = '';

                    }
                } as wuzhui.NumberPagingButton;
                button.onclick = () => {
                    if (result.onclick) {
                        result.onclick(result, pagingBar);
                    }
                };
                return result;
            }
        });
        this.dataSource.select();
    }

    renderImage(e: HTMLImageElement, src: string) {
        if (!e) return;
        ui.renderImage(e);
    }

    render() {
        let products = this.state.products;

        let c: Product[][];
        if (products != null) {
            let products1 = products.filter((o, i) => i <= 4);
            let products2 = products.filter((o, i) => i >= 5 && i <= 9);
            let products3 = products.filter((o, i) => i >= 10 && i <= 14);
            c = [products1, products2, products3].filter(o => o && o.length > 0);
        }

        let status: 'loading' | 'none' | 'finish';
        if (products == null)
            status = 'loading';
        else if (products.length == 0)
            status = 'none';
        else
            status = 'finish';

        return (
            <div className="productSelectDialog modal fade" ref={(e: HTMLElement) => this.element = e || this.element}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={() => ui.hideDialog(this.element)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title">选择商品</h4>
                        </div>
                        <div className="modal-body">
                            {status == 'loading' ?
                                <div className="loading">
                                    数据正在加载中...
                                </div> : null}
                            {status == 'none' ?
                                <div className="norecords">
                                    暂无商品数据
                                </div> : null}
                            {status == 'finish' ?
                                c.map((products, index) =>
                                    <div key={index} className="products">
                                        {products.map(p =>
                                            <div key={p.Id} className="product"
                                                onClick={() => this.productSelected(p)}>
                                                <img src={imageUrl(p.ImagePath, 100)} ref={(e: HTMLImageElement) => e ? ui.renderImage(e) : null} />
                                                <div className="interception">
                                                    {p.Name}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : null
                            }
                            <div className="clearfix"></div>
                        </div>
                        <div className="modal-footer">
                            <ul className="pull-left paging-bar pagination" ref={(e: HTMLElement) => this.pagingBarElement = e || this.pagingBarElement} >
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
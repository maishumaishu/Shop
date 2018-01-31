import { imageUrl } from 'services/service';
import { ShoppingService } from 'adminServices/shopping';
import 'wuzhui';

requirejs(['css!adminComponents/productSelectDialog']);

type ProductsDialogProps = {
    shopping: ShoppingService,
    // selected?: (product: Product) => Promise<any> | void
} & React.Props<ProductSelectDialog>;

export class ProductSelectDialog extends React.Component<ProductsDialogProps, { products: Product[] }>{

    private element: HTMLElement;
    private dataSource: wuzhui.DataSource<Product>;
    private pagingBarElement: HTMLElement;
    private searchInput: HTMLInputElement;
    private onProductSelected: (product: Product) => Promise<any> | void;

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

    show(onProductSelected: (product: Product) => Promise<any> | void) {
        this.onProductSelected = onProductSelected;
        ui.showDialog(this.element);
    }

    productSelected(p: Product) {
        // if (!this.props.selected)
        //     return;

        let result = this.onProductSelected(p) || Promise.resolve();
        result.then(() => ui.hideDialog(this.element));
        // var isOK = true;
        // if (this.props.selected) {
        // isOK = this.props.selected(p);
        // }

        // if (!isOK)
        //     return;

        // ui.hideDialog(this.element);
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

    search(text: string) {
        this.dataSource.selectArguments["searchText"] = text || '';
        this.dataSource.select();
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
                            <div className="input-group">
                                <input type="text" className="form-control pull-right" placeholder="请输入SKU或名称、类别" style={{ width: '100%' }}
                                    ref={(e: HTMLInputElement) => this.searchInput = e || this.searchInput} />
                                <span className="input-group-btn">
                                    <button className="btn btn-primary btn-sm pull-right" onClick={() => this.search(this.searchInput.value)}>
                                        <i className="icon-search"></i>
                                        <span>搜索</span>
                                    </button>
                                </span>
                            </div>
                            <hr className="row" />
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
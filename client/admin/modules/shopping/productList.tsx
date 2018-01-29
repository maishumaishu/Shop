import { default as shopping } from 'adminServices/shopping';
import station from 'adminServices/station';
import app from 'application';
import { default as site } from 'site';
import * as wz from 'myWuZhui';
import * as ui from 'ui';
import tips from 'tips';

type Restriction = { unlimit: boolean, quantity: number, productId: string, productName: string };
type ProductStock = { unlimit: boolean, stock: number, productId: string, productName: string };
type Tab = 'all' | 'onShelve' | 'offShelve';
type PageState = {
    dataItem: any, restriction?: Restriction
    productStock?: ProductStock, tab: Tab,
    searchText?: string
}
class Page extends React.Component<{}, PageState>{
    private productTable: HTMLTableElement;
    private restrictionDialog: HTMLFormElement;
    private stockDialog: HTMLFormElement;
    private dataSource: wuzhui.DataSource<Product>;

    constructor(props) {
        super(props);
        this.state = { dataItem: {}, tab: 'all' };
    }

    private showRestrictionDialog(dataItem: Product) {
        this.state.dataItem = dataItem;
        this.state.restriction = {
            productId: dataItem.Id,
            productName: dataItem.Name,
            unlimit: dataItem.BuyLimitedNumber == null,
            quantity: dataItem.BuyLimitedNumber
        };
        this.setState(this.state);
        $(this.restrictionDialog).modal();
    }

    private setBuyLimited(restriction: Restriction) {
        return shopping.buyLimited(restriction.productId, restriction.quantity)
            .then((result) => {
                let item = {
                    Id: restriction.productId,
                    BuyLimitedNumber: restriction.quantity
                } as Product
                this.dataSource.updated.fire(this.dataSource, { item });
                ui.hideDialog(this.restrictionDialog);
            });
    }

    private showStockDialog(dataItem: Product) {
        this.state.productStock = {
            productId: dataItem.Id,
            productName: dataItem.Name,
            unlimit: dataItem.Stock == null,
            stock: dataItem.Stock
        };
        this.setState(this.state);
        $(this.stockDialog).modal();
    }

    private setStock(productStock: ProductStock) {
        return shopping.setStock(productStock.productId, productStock.stock)
            .then((data) => {
                let item = {
                    Id: productStock.productId,
                    Stock: productStock.stock
                } as Product;
                this.dataSource.updated.fire(this.dataSource, { item });
                return data;
            })
    }

    private offShelve(item: Product) {
        return shopping.offShelve(item.Id).then(() => {
            item.OffShelve = true;
            this.dataSource.updated.fire(this.dataSource, { item });
        });
    }
    onShelve(item: Product) {
        return shopping.onShelve(item.Id).then(() => {
            item.OffShelve = (false);
            this.dataSource.updated.fire(this.dataSource, { item });
        })
    }
    showChildren(parentId: string) {
        var rows = this.productTable.rows;
        var rowIndex: number;
        for (let i = 0; i < rows.length; i++) {
            var gridViewRow = wuzhui.Control.getControlByElement(rows[i] as HTMLElement) as wuzhui.GridViewDataRow;
            if (gridViewRow == null || gridViewRow.rowType != wuzhui.GridViewRowType.Data)
                continue;

            var dataItem = gridViewRow.dataItem as Product;
            console.assert(dataItem != null);
            if (dataItem.Id == parentId) {
                rowIndex = i;
                break;
            }
        }
        return shopping.productChildren(parentId).then((result) => {
            result.dataItems.forEach((o) => this.dataSource.inserted.fire(this.dataSource, { item: o, index: rowIndex }))
            return result;
        });
    }
    hideChildren(parentId: string) {
        var rows = this.productTable.rows;
        var children: Product[] = [];
        for (let i = 0; i < rows.length; i++) {
            var gridViewRow = wuzhui.Control.getControlByElement(rows[i] as HTMLElement) as wuzhui.GridViewDataRow;
            if (gridViewRow == null || gridViewRow.rowType != wuzhui.GridViewRowType.Data)
                continue;

            var dataItem = gridViewRow.dataItem as Product;
            console.assert(dataItem != null);
            if (dataItem.ParentId == parentId) {
                children.push(dataItem);
            }
        }
        children.forEach(o => this.dataSource.deleted.fire(this.dataSource, { item: o }));
    }
    removeProduct(dataItem: Product) {
        return this.dataSource.delete(dataItem);
    }
    componentDidMount() {
        shopping.queryProducts
        let dataSource = this.dataSource = new wuzhui.WebDataSource<Product>({
            primaryKeys: ['Id'],
            select: (args) => shopping.products(args),
            delete: (item) => shopping.deleteProduct(item.Id)
        });
        // dataSource.ajaxMethods.delete = 'delete';
        dataSource.selected.add((sender, args) => {
            let productIds = args.items.map(o => o.Id as string);
            shopping.productStocks(productIds).then(data => {
                data.map(o => ({ Id: o.ProductId, Stock: o.Quantity } as Product))
                    .forEach(o => dataSource.updated.fire(dataSource, { item: o }));
            });
            shopping.getBuyLimitedNumbers(productIds).then(data => {
                data.map(o => ({ Id: o.ProductId, BuyLimitedNumber: o.LimitedNumber } as Product))
                    .forEach(o => dataSource.updated.fire(dataSource, { item: o }));

            })
        });

        let self = this;
        var gridView = new wuzhui.GridView({
            dataSource,
            element: this.productTable,
            pagerSettings: { activeButtonClassName: 'active' },
            columns: [
                new wuzhui.CustomField({
                    createItemCell(dataItem) {
                        let cell = new wuzhui.GridViewDataCell({
                            dataItem, dataField: 'SortNumber',
                            render(element, value) {
                                ReactDOM.render(<a href="javascript:" style={{ width: 100 }} title="点击修改序号">{value}</a>, element);
                            }
                        });
                        return cell;
                    },
                    headerText: '序号',
                    headerStyle: { textAlign: 'center' } as CSSStyleDeclaration
                }),
                new wuzhui.CustomField({
                    createItemCell(dataItem: Product) {
                        let status: 'collapsed' | 'collapsing' | 'expanding' | 'expanded' = 'collapsed';
                        let cell = new wuzhui.GridViewDataCell({
                            dataItem,
                            dataField: 'Name',
                            render(element, value) {
                                ReactDOM.render(
                                    <div>
                                        <span>
                                            {dataItem.Name}
                                        </span>
                                        <span style={{ paddingLeft: 8 }}>
                                            {(dataItem.Fields || []).map(o =>
                                                <span key={o.key} className="badge badge-gray" style={{ paddingTop: 3 }}>{o.value}</span>
                                            )}
                                        </span>

                                    </div>, element);
                            }
                        })
                        return cell;
                    },
                    headerText: '名称',
                    headerStyle: { textAlign: 'center' } as CSSStyleDeclaration,
                    itemStyle: { textAlign: 'left' } as CSSStyleDeclaration,
                }),
                new wuzhui.BoundField({
                    dataField: 'SKU', headerText: 'SKU',
                    headerStyle: { textAlign: 'center' } as CSSStyleDeclaration
                }),
                new wuzhui.BoundField({
                    dataField: 'CategoryName', headerText: '类别',
                    headerStyle: { textAlign: 'center' } as CSSStyleDeclaration,
                }),
                new wuzhui.CustomField({
                    createItemCell(dataItem: Product) {
                        let cell = new wuzhui.GridViewDataCell({
                            dataItem, dataField: 'OffShelve',
                            render(element, offShelve: boolean) {
                                let className = offShelve ? 'btn btn-default btn-minier' : "btn btn-primary btn-minier";
                                let text = offShelve ? '已下架' : '已上架';
                                ReactDOM.render(
                                    <div>
                                        <button className={className}
                                            onClick={() => offShelve ? self.onShelve(dataItem) : self.offShelve(dataItem)}
                                            title={offShelve ? tips.clickOnShelve : tips.clickOffShelve}
                                        >{text}</button>
                                    </div>,
                                    element);
                            }
                        });

                        return cell;
                    },
                    headerText: '上下架',
                    headerStyle: { textAlign: 'center', width: '60px' } as CSSStyleDeclaration,
                    itemStyle: { textAlign: 'center' } as CSSStyleDeclaration
                }),
                new wuzhui.CustomField({
                    headerText: '库存',
                    headerStyle: { textAlign: 'center', width: '60px' } as CSSStyleDeclaration,
                    itemStyle: { textAlign: 'right' } as CSSStyleDeclaration,
                    createItemCell(dataItem) {
                        let cell = new wuzhui.GridViewDataCell({
                            dataItem, dataField: 'Stock',
                            render(element, value) {
                                ReactDOM.render(
                                    <a href="javascript:">
                                        {value == null ? '无限' : value}
                                    </a>, element);
                            }
                        });

                        cell.element.onclick = function () {
                            self.showStockDialog(dataItem);
                        }
                        return cell;
                    },
                }),
                new wuzhui.CustomField({
                    createItemCell(dataItem) {
                        let cell = new wuzhui.GridViewDataCell({
                            dataItem, dataField: 'BuyLimitedNumber',
                            render(element, value) {
                                ReactDOM.render(
                                    <a href="javascript:">
                                        {value == null ? '不限' : value}
                                    </a>, element);
                            }
                        });
                        cell.element.onclick = function () {
                            self.showRestrictionDialog(dataItem);
                        }
                        return cell;
                    },
                    headerText: '限购',
                    headerStyle: { textAlign: 'center', width: '60px' } as CSSStyleDeclaration,
                    itemStyle: { textAlign: 'right' } as CSSStyleDeclaration,
                }),
                new wuzhui.BoundField({
                    dataField: 'Price', headerText: '价格', dataFormatString: '￥{0:C2}',
                    headerStyle: { textAlign: 'center', width: '80px' } as CSSStyleDeclaration,
                    itemStyle: { textAlign: 'right' } as CSSStyleDeclaration
                }),
                new wuzhui.CustomField({
                    createItemCell(dataItem: Product) {
                        let cell = new wuzhui.GridViewCell();
                        ReactDOM.render(<div>
                            <button className="btn btn-minier btn-success" style={{ marginRight: 4 }}>
                                商品链接
                            </button>
                            <button className="btn btn-minier btn-purple" style={{ marginRight: 4 }}>
                                <i className="icon-copy" />
                            </button>
                            <button className="btn btn-minier btn-info" style={{ marginRight: 4 }}
                                onClick={() => { app.redirect(`shopping/product/productEdit?id=${dataItem.Id}`) }}>
                                <i className="icon-pencil"></i>
                            </button>
                            <button className="btn btn-minier btn-warning" title={tips.clickAddRegularProduct}
                                onClick={() => app.redirect(`shopping/product/productEdit?parentId=${dataItem.Id}`)}>
                                <i className="icon-plus"></i>
                            </button>
                            <button className="btn btn-minier btn-danger" style={{ marginLeft: 4 }}
                                ref={(e: HTMLButtonElement) => {
                                    if (!e) return;
                                    e.onclick = ui.buttonOnClick(() => {
                                        return self.removeProduct(dataItem);
                                    }, { confirm: `确定删除商品'${dataItem.Name}'吗？` })
                                }}>
                                <i className="icon-trash"></i>
                            </button>

                        </div>, cell.element);
                        return cell;
                    },
                    headerText: '操作',
                    headerStyle: { textAlign: 'center', width: '210px' } as CSSStyleDeclaration,
                    itemStyle: { textAlign: 'center' } as CSSStyleDeclaration
                })
            ],
            pageSize: 10
        });
    }
    switchTab(tab: Tab) {
        if (this.state.tab == tab)
            return;

        this.state.tab = tab;
        this.setState(this.state);

        if (tab == 'offShelve')
            this.dataSource.selectArguments.filter = 'OffShelve == true';
        else if (tab == 'onShelve')
            this.dataSource.selectArguments.filter = 'OffShelve != true';
        else
            this.dataSource.selectArguments.filter = null;

        this.dataSource.selectArguments.startRowIndex = 0;
        this.dataSource.select();

    }
    search() {
        this.dataSource.selectArguments['searchText'] = this.state.searchText;
        this.dataSource.select();
    }
    render() {
        let restriction = this.state.restriction;
        let productStock = this.state.productStock;
        let tab = this.state.tab;
        return (
            <div className="admin-pc">
                <div name="tabs" className="tabbable">
                    <ul className="nav nav-tabs">
                        <li className={tab == 'all' ? "active" : ''}
                            onClick={() => this.switchTab('all')}>
                            <a href="javascript:">全部</a>
                        </li>
                        <li className={tab == 'onShelve' ? "active" : ''}
                            onClick={() => this.switchTab('onShelve')}>
                            <a href="javascript:">已上架</a></li>
                        <li className={tab == 'offShelve' ? "active" : ''}
                            onClick={() => this.switchTab('offShelve')}>
                            <a href="javascript:">已下架</a>
                        </li>
                        <li className="pull-right">
                        </li>
                        <li className="pull-right">

                        </li>
                        <li data-bind="visible:tabs.current() == 'all'" className="pull-right">
                            <button onClick={()=>app.redirect('shopping/product/productEdit')} className="btn btn-primary btn-sm pull-right">
                                <i className="icon-plus"/>
                                <span>添加</span>
                            </button>
                            <button className="btn btn-primary btn-sm pull-right"
                                onClick={() => this.search()}>
                                <i className="icon-search" />
                                <span>搜索</span>
                            </button>
                            <input type="text" className="form-control" style={{ width: 300 }} placeholder="请输入SKU或名称、类别"
                                value={this.state.searchText}
                                onChange={(e) => {
                                    this.state.searchText = (e.target as HTMLInputElement).value;
                                    this.setState(this.state);
                                }}
                            />
                        </li>
                    </ul>
                </div>
                <table name="productList" className={site.style.tableClassName}
                    ref={(o: HTMLTableElement) => this.productTable = o || this.productTable}>
                </table>
                {restriction ?
                    <form className="modal fade"
                        ref={(o: HTMLFormElement) => this.restrictionDialog = o || this.restrictionDialog}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal">
                                        <span aria-hidden="true">&times;</span><span className="sr-only">Close</span>
                                    </button>
                                    <h4 className="modal-title">产品限购</h4>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label>{this.state.dataItem.Name}</label>
                                    </div>
                                    <div className="form-group">
                                        <input type="text" className="form-control" placeholder="请输入产品限购数量"
                                            disabled={restriction.unlimit} value={restriction.quantity == null ? '' : `${restriction.quantity}`}
                                            onChange={(e) => {
                                                let inputValue = (e.target as HTMLInputElement).value;
                                                if (inputValue)
                                                    restriction.quantity = Number.parseInt(inputValue);
                                                else
                                                    restriction.quantity = null;

                                                this.setState(this.state);
                                            }} />
                                    </div>
                                    <div className="checkbox">
                                        <label>
                                            <input checked={restriction.unlimit} type="checkbox" className="checkbox" style={{ marginTop: 0 }}
                                                onChange={(e) => {
                                                    restriction.unlimit = (e.target as HTMLInputElement).checked;
                                                    this.setState(this.state);
                                                }} />
                                            <span>不限数量</span>
                                        </label>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
                                        <button type="button" className="btn btn-primary"
                                            ref={(e: HTMLButtonElement) => {
                                                if (!e) return;
                                                e.onclick = ui.buttonOnClick(() => {
                                                    return this.setBuyLimited(restriction);
                                                })
                                            }}
                                        >确认</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form> : null}
                {productStock ?
                    <form name="productStock" className="modal fade"
                        ref={(o: HTMLFormElement) => this.stockDialog = o || this.stockDialog}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal">
                                        <span aria-hidden="true">&times;</span><span className="sr-only">Close</span>
                                    </button>
                                    <h4 className="modal-title">产品库存</h4>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label>{productStock.productName}</label>
                                    </div>
                                    <div className="form-group">
                                        <input type="text" className="form-control" placeholder="请输入产品库存数量"
                                            value={productStock.stock == null ? '' : `${productStock.stock}`} disabled={productStock.unlimit}
                                            onChange={(e) => {
                                                let inputValue = (e.target as HTMLInputElement).value;
                                                if (inputValue)
                                                    productStock.stock = Number.parseInt(inputValue);
                                                else
                                                    productStock.stock = null;

                                                this.setState(this.state);
                                            }} />
                                    </div>
                                    <div className="checkbox">
                                        <label>
                                            <input data-bind="checked:unlimit" type="checkbox" className="checkbox" style={{ marginTop: 0 }}
                                                checked={productStock.unlimit}
                                                onChange={(e) => {
                                                    productStock.unlimit = (e.target as HTMLInputElement).checked;
                                                    this.setState(this.state);
                                                }}
                                            />
                                            <span>不限库存</span>
                                        </label>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
                                        <button type="button" className="btn btn-primary"
                                            onClick={(e) => {
                                                this.setStock(productStock).then(() => {
                                                    $(this.stockDialog).modal('hide');
                                                })
                                            }}
                                        >确认</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form> : null
                }
            </div>
        );
    }
}


export default function (page: chitu.Page) {
    let element = document.createElement('div');
    page.element.appendChild(element);
    ReactDOM.render(<Page />, element);
}

// onClick={ui.buttonOnClick((e) => {
//                                                 return this.setBuyLimited(restriction).then(() => {
//                                                     $(this.restrictionDialog).modal('hide');
//                                                 })
//                                             })}
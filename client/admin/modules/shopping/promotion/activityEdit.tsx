import { guid } from 'admin/services/service';
import { ActivityService } from 'admin/services/activity';
import { ProductSelectDialog } from 'controls/productSelectDialog';
import { ShoppingService } from 'admin/services/shopping';
import app from 'application';
import * as dilu from 'dilu';

dilu.FormValidator.errorClassName = "validationMessage";

var promotionTypeTexts = {
    Reduce: '满减',
    Given: '满赠',
    Discount: '满折'
};

var promotionMethodTexts = {
    Amount: '按商品总金额',
    Count: '按商品总数量'
};

var objectTypeTexts = {
    Brand: '品牌',
    Category: '类别',
    Product: '商品'
}

var promotionTypes = {
    amount: 'Reduce',
    product: 'Given',
    discount: 'Discount'
};

var promotionMethods = {
    amount: 'Amount',
    count: 'Count'
};

var objectNames: { [key: string]: string } = {};

function getConditionText(promotion: Promotion, promotionRule: PromotionContentRule) {
    var condition_text;
    if (promotion.Method == promotionMethods.count) {
        condition_text = `购买指定商品任意 ${promotionRule.LevelValue} 件, `;
    }
    else if (promotion.Method == promotionMethods.amount) {
        condition_text = `购买指定商品满 ￥${new Number(promotionRule.LevelValue).toFixed(2)} 元, `;
    }
    return condition_text;
}

function description(promotion: Promotion, contentRule: PromotionContentRule) {
    if (promotion.Type == promotionTypes.product) {
        var str = '即可获赠';// chitu.Utility
        let items = contentRule.GivenValue.split(",").map(o => {
            let arr = o.split(":");
            let id = arr[0];
            let quantity = Number.parseInt(arr[1]);
            return { id, quantity };
        });

        for (var i = 0; i < items.length; i++) {
            if (i > 0)
                str = str + "，";

            str = str + ` “${objectNames[items[i].id]}” ${items[i].quantity} 件`;
        }

        let description = getConditionText(promotion, contentRule) + str;
        return description;
    }
    else if (promotion.Type == promotionTypes.amount) {
        let str = `￥${new Number(contentRule.GivenValue).toFixed(2)}`;
        var given_text = `即减 ${str} 元`;
        return getConditionText(promotion, contentRule) + given_text;
    }
    else if (promotion.Type == promotionTypes.discount) {
        var given_text = `打 ${contentRule.GivenValue} 折`;
        return getConditionText(promotion, contentRule) + given_text;
    }
}

interface Props extends React.Props<ActivityEditPage> {
    page: chitu.Page,
    promotions: Promotion[],
    activityId: string,
}

interface State {
    promotions: Promotion[]
}

class ActivityEditPage extends React.Component<Props, State>{
    private buyDiscountDialog: BuyDiscountDialog;
    private buyReduceDialog: BuyReduceDialog;
    private buyGivenDialog: BuyGivenDialog;
    private categoryInputDialog: CategoryInputDialog;
    private brandInputDialog: BrandInputDialog;
    private productInputDialog: ProductInputDialog;
    private page: chitu.Page;

    constructor(props: Props) {
        super(props);

        this.state = { promotions: props.promotions };
        this.page = this.props.page;
    }
    newProductRule(promotion: Promotion) {
        this.productInputDialog.show((product, isInclude) => {
            let rule: PromotionRangeRule = {
                Id: guid(),
                ObjectName: product.Name,
                ObjectId: product.Id,
                ObjectType: 'Product',
                PromotionId: promotion.Id,
                CollectionType: isInclude ? 'Include' : 'Exclude',
                CreateDateTime: new Date(Date.now())
            }
            promotion.PromotionRangeRules.push(rule);
            this.setState(this.state);
        });
    }
    newBrandRule(promotion: Promotion) {
        this.brandInputDialog.show((brand, isInclude) => {
            let rule: PromotionRangeRule = {
                Id: guid(),
                ObjectName: brand.Name,
                ObjectId: brand.Id,
                ObjectType: 'Brand',
                PromotionId: promotion.Id,
                CollectionType: isInclude ? 'Include' : 'Exclude',
                CreateDateTime: new Date(Date.now())
            }
            promotion.PromotionRangeRules.push(rule);
            this.setState(this.state);
        })
    }
    newCategoryRule(promotion: Promotion) {
        this.categoryInputDialog.show((category, isInclude) => {
            let rule: PromotionRangeRule = {
                Id: guid(),
                ObjectName: category.Name,
                ObjectId: category.Id,
                ObjectType: 'Category',
                PromotionId: promotion.Id,
                CollectionType: isInclude ? 'Include' : 'Exclude',
                CreateDateTime: new Date(Date.now())
            }
            promotion.PromotionRangeRules.push(rule);
            this.setState(this.state);
        })
    }
    showNewRuleDialog(promotion: Promotion) {
        switch (promotion.Type) {
            case promotionTypes.amount:
                this.newBuyReduce(promotion);
                break;
            case promotionTypes.discount:
                this.newBuyDiscount(promotion);
                break;
            case promotionTypes.product:
                this.newBuyGiven(promotion);
                break;
        }
    }
    newBuyReduce(promotion: Promotion) {
        this.buyReduceDialog.show(promotion, (rule) => {
            rule.Description = description(promotion, rule);
            promotion.PromotionContentRules.push(rule);
            this.setState(this.state);
        });
    }
    newBuyDiscount(promotion: Promotion) {
        this.buyDiscountDialog.show(promotion, (rule: PromotionContentRule) => {
            rule.Description = description(promotion, rule);
            promotion.PromotionContentRules.push(rule);
            this.setState(this.state);
        })
    }
    newBuyGiven(promotion: Promotion) {
        this.buyGivenDialog.show(promotion, (rule: PromotionContentRule) => {
            rule.Description = description(promotion, rule);
            promotion.PromotionContentRules.push(rule);
            this.setState(this.state);
        });
    }
    removeContentRule(promotion: Promotion, contentRule: PromotionContentRule) {
        let contentRules = promotion.PromotionContentRules.filter(o => o != contentRule);
        promotion.PromotionContentRules = contentRules;
        this.setState(this.state);
    }
    save() {

    }
    removePromotion(p: Promotion) {
        this.state.promotions = this.state.promotions.filter(o => o != p);
        this.setState(this.state);
        return Promise.resolve();
    }
    createPromotion() {
        var $dlg = this.page.element.querySelector('[name="dlg_promotion"]') as HTMLElement;
        let sv_activity = this.page.createService(ActivityService);
        let activityId = this.page.data.id;
        // let { promotion } = this.state;
        showDialog($dlg, '添加优惠', () => {
            // return sv_activity.addPromotion(activityId, promotion.type(), this.promotion.method())
            //     .then((data) => {
            //         var p = new Promotion();
            //         p.id = data.Id;
            //         p.content = new PromotionContent(data.Id, page);
            //         p.content.method(this.promotion.method());
            //         p.content.type(this.promotion.type());
            //         p.range = new PromotionRange(data.Id, this);

            //         this.promotions.push(p);
            //     });
        })

        return Promise.resolve();
    }
    render() {
        let activity = this.page.createService(ActivityService);
        let topbar = (
            <ul key="topbar" className="nav nav-tabs">
                <li key="back" className="pull-right">
                    <button className="btn btn-sm btn-primary" onClick={() => app.back()}>
                        <i className="icon-reply"></i>
                        <span>返回</span>
                    </button>
                </li>
                <li key="save" className="pull-right">
                    <button className="btn btn-sm btn-primary"
                        ref={(e: HTMLButtonElement) => {
                            if (!e) return;
                            e.onclick = ui.buttonOnClick(() => {
                                return activity.updateActivityPromotions(this.props.activityId, this.state.promotions);
                            }, { toast: '保存成功' })
                        }}>
                        <i className="icon-save"></i>
                        <span>保存</span>
                    </button>
                </li>
                <li key="add" className="pull-right">
                    <button href="javascript:" className="btn btn-sm btn-primary"
                        ref={(e: HTMLButtonElement) => {
                            // ui.buttonOnClick(e,()=>this.cre)
                            ui.buttonOnClick(e, () => this.createPromotion())
                        }}>
                        <i className="icon-plus"></i>
                        <span>添加</span>
                    </button>
                </li>
            </ul>
        );

        let result = [topbar];
        let promotions = this.state.promotions;
        if (promotions == null || promotions == []) {
            result.push(
                <div style={{ textAlign: 'center', padding: '50px 0px 50px 0px' }}>
                    暂无优惠信息，你可以点击左上角的“添加”按钮进行添加，添加完成后，请点击“保存”按钮。
                </div>
            );
        }
        else {
            promotions.map((o, i) =>
                <div key={i} className="row">
                    <div className="col-md-6">
                        <PromotionRangeComponent page={this.page} rules={o.PromotionRangeRules} />
                    </div>
                    <div className="col-md-6">
                        <table border={1} className="table table-striped table-bordered table-hover" style={{ borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th colSpan={4}>
                                        优惠内容
                                        <button className="btn-link pull-right" title="点击删除该优惠"
                                            ref={(e: HTMLButtonElement) => {
                                                if (!e) return;
                                                e.onclick = ui.buttonOnClick(() => this.removePromotion(o), {
                                                    confirm: '确定要删除该优惠吗'
                                                });
                                            }}>
                                            <i className="icon-remove pull-right text-danger">
                                            </i>
                                        </button>
                                    </th>
                                </tr>
                                <tr>
                                    <th style={{ textAlign: 'center' }}>名称</th>
                                    <th style={{ textAlign: 'center', width: 100 }}>
                                        {o.Method == "Amount" ? '金额' : '数量'}
                                    </th>
                                    <th style={{ textAlign: 'center', width: 80 }}>
                                        操作
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ display: o.PromotionContentRules.length > 0 ? 'none' : null }}>
                                    <td colSpan={4} style={{ border: "0px", textAlign: 'center' }}>
                                        <div style={{ padding: '50px 0px 50px 0px' }}>暂无数据</div>
                                    </td>
                                </tr>
                                {
                                    o.PromotionContentRules.sort((a, b) => a.LevelValue - b.LevelValue).map((r, i) =>
                                        <tr key={`content${i}`}>
                                            <td>
                                                {r.Description}
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                {o.Method == 'Amount' ?
                                                    `￥${r.LevelValue.toFixed(2)}` :
                                                    r.LevelValue
                                                }
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <button className="btn btn-minier btn-danger"
                                                    onClick={() => this.removeContentRule(o, r)}>
                                                    <i className="icon-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={4}>
                                        <div className="pull-left">
                                            <div>
                                                <label>
                                                    <span style={{ fontWeight: 'bold' }}>优惠方式：</span>
                                                    <span data-bind="text:methodText">{promotionMethodTexts[o.Method]}</span>
                                                </label>
                                                <label style={{ paddingLeft: 10 }}>
                                                    <span style={{ fontWeight: 'bold' }}>优惠类型：</span>
                                                    <span data-bind="text:typeText">{promotionTypeTexts[o.Type]}</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="pull-right">
                                            <button className="btn btn-primary btn-sm"
                                                onClick={() => this.showNewRuleDialog(o)}>添加优惠内容</button>
                                        </div>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            ).forEach(e => result.push(e));
        }

        let shopping = this.page.createService(ShoppingService);
        let dialogs = [
            <ProductInputDialog key="productInputDialog" page={this.page}
                ref={(e) => this.productInputDialog = e || this.productInputDialog} />,
            <BrandInputDialog key="brandInputDialog" page={this.page}
                ref={(e) => this.brandInputDialog = e || this.brandInputDialog} />,
            <CategoryInputDialog key="categoryInputDialog" page={this.page}
                ref={(e) => this.categoryInputDialog = e || this.categoryInputDialog} />,
            <BuyGivenDialog key="buyGivenDialog" page={this.props.page}
                ref={(e) => this.buyGivenDialog = e || this.buyGivenDialog} />,
            <BuyReduceDialog key="buyReduceDialog"
                ref={(e) => this.buyReduceDialog = e || this.buyReduceDialog} />,
            <BuyDiscountDialog key="buyDiscountDialog"
                ref={(e) => this.buyDiscountDialog = e || this.buyDiscountDialog} />
        ];
        dialogs.forEach(o => result.push(o));

        return result;
    }
}

function showDialog(dlg: HTMLElement, title, ok_callback: (element: HTMLElement) => void | Promise<any>) {
    if (title)
        dlg.querySelector('.modal-title').innerHTML = title;
    (dlg.querySelector('[name="btnOK"]') as HTMLElement).onclick = function () {
        var result = ok_callback(dlg);
        if (result instanceof Promise) {
            result.then(function () {
                ui.hideDialog(dlg);
            });
        }
        else {
            ui.hideDialog(dlg);
        }
    };

    ui.showDialog(dlg);
}


class ProductInputDialog extends React.Component<React.Props<ProductInputDialog> & { page: chitu.Page },
    { product?: Product, isInclude: boolean }> {

    private nameError: HTMLElement;
    private nameInput: HTMLInputElement;
    private element: HTMLElement;
    private validator: dilu.FormValidator;
    private productSelectDialog: ProductSelectDialog;

    private onProductSelected: (o: Product, isInclude: boolean) => void;

    constructor(props) {
        super(props);
        this.state = { isInclude: true };
    }
    private showProductSelector() {
        this.productSelectDialog.show((product) => {
            this.state.product = product;
            this.setState(this.state);
        });
    }
    show(onProductSelected: (product: Product, isInclude: boolean) => void) {
        this.state.product = null;
        this.setState(this.state);
        ui.showDialog(this.element);
        this.onProductSelected = onProductSelected;
    }
    async confirm() {
        let isValid = await this.validator.check();
        if (!isValid)
            return;

        console.assert(this.state.product != null, "product is null");
        this.onProductSelected(this.state.product, this.state.isInclude);

        ui.hideDialog(this.element);
    }
    componentDidMount() {
        let { required } = dilu.rules;
        this.validator = new dilu.FormValidator(this.element, {
            name: "Name",
            rules: [required("请选择商品")],
            errorElement: this.nameError
        })
    }
    render() {
        let { isInclude } = this.state;
        let productId = "", productName = "";
        if (this.state.product) {
            productId = this.state.product.Id;
            productName = this.state.product.Name;
        }

        let shopping = this.props.page.createService(ShoppingService);
        return [
            <form key="dlg_product" name="dlg_product" className="modal fade"
                ref={(e: HTMLElement) => this.element = e || this.element}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                                <span className="sr-only">Close</span>
                            </button>
                            <h4 className="modal-title">添加商品</h4>
                        </div>
                        <div className="modal-body form-horizontal">
                            <div className="form-group" style={{ display: 'none' }}>
                                <label className="control-label col-sm-2">
                                    *产品编号
                                </label>
                                <div className="col-sm-10">
                                    <div className="input-group">
                                        <input className="form-control" placeholder="请输入产品编号"
                                            value={productId || ''} readOnly={true} />
                                        <span className="input-group-btn">
                                            <button name="btnSelectProduct" className="btn btn-default" type="button"
                                                onClick={() => this.showProductSelector()}>
                                                <i className="icon-cog" />
                                            </button>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="control-label col-sm-2">
                                    *商品名称
                                </label>
                                <div className="col-sm-10">
                                    <div className="input-group">
                                        <input className="form-control" placeholder="请选择商品"
                                            value={productName || ''} readOnly={true}
                                            ref={(e: HTMLInputElement) => this.nameInput = e || this.nameInput} />
                                        <span className="input-group-btn">
                                            <button name="btnSelectProduct" className="btn btn-default" type="button"
                                                onClick={() => this.showProductSelector()}>
                                                <i className="icon-cog" />
                                            </button>
                                        </span>
                                    </div>
                                    <span className="validationMessage" ref={(e: HTMLElement) => this.nameError = e || this.nameError}></span>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-sm-10 col-sm-offset-2">
                                    <label className="radio-inline">
                                        <input type="radio" value="Include" checked={isInclude}
                                            onChange={(e) => {
                                                this.state.isInclude = (e.target as HTMLInputElement).checked;
                                                this.setState(this.state);
                                            }} />包含
                                    </label>
                                    <label className="radio-inline">
                                        <input type="radio" value="Exclude" checked={!isInclude}
                                            onChange={(e) => {
                                                this.state.isInclude = !(e.target as HTMLInputElement).checked;
                                                this.setState(this.state);
                                            }} />排除
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
                            <button name="btnOK" type="button" className="btn btn-primary"
                                onClick={() => this.confirm()}>确定</button>
                        </div>
                    </div>
                </div>
            </form>,
            <ProductSelectDialog key="productSelectDialog" shopping={shopping}
                ref={(e) => this.productSelectDialog = e || this.productSelectDialog} />
        ];
    }
}


class BrandInputDialog extends React.Component<
    React.Props<BrandInputDialog> & { page: chitu.Page },
    { brands: Brand[], selectedBrand: Brand, isInclude: boolean }>{

    private static brands: Array<Brand>;
    private element: HTMLElement;
    private brandSelect: HTMLSelectElement;
    private validator: dilu.FormValidator;

    private onBrandSelected: (brand: Brand, isInclude: boolean) => void

    constructor(props) {
        super(props);

        this.state = { brands: BrandInputDialog.brands || [], selectedBrand: null, isInclude: true };

        let args: wuzhui.DataSourceSelectArguments = {
            maximumRows: 1000
        };

        if (BrandInputDialog.brands == null) {
            let shopping = this.props.page.createService(ShoppingService);
            shopping.brands(args).then(brands => {
                BrandInputDialog.brands = brands.dataItems;
                this.state.brands = BrandInputDialog.brands;
                this.setState(this.state);
            });
        }
    }
    show(onBrandSelected: (brand: Brand, isInclude: boolean) => void) {
        this.state.isInclude = true;
        this.state.selectedBrand = null;
        this.setState(this.state);

        this.onBrandSelected = onBrandSelected;
        ui.showDialog(this.element);
    }
    async confirm() {
        let isValid = await this.validator.check();
        if (isValid == false)
            return;

        this.onBrandSelected(this.state.selectedBrand, this.state.isInclude);
        ui.hideDialog(this.element);
    }
    componentDidMount() {
        let { required } = dilu.rules;
        this.validator = new dilu.FormValidator(this.element,
            { name: "Brand", rules: [required("请选择品牌")] }
        );
    }
    render() {
        let brand = this.state.selectedBrand;
        let isInclude = this.state.isInclude;
        let selectedBrandId = brand == null ? "" : brand.Id;
        return (
            <form name="dlg_brand" className="modal fade"
                ref={(e: HTMLElement) => this.element = e || this.element}>
                <div data-bind="with:brand" className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                                <span className="sr-only">Close</span>
                            </button>
                            <h4 className="modal-title">添加品牌</h4>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal">
                                <div className="form-group">
                                    <label className="control-label col-sm-2">
                                        *品牌
                                </label>
                                    <div className="col-sm-10">
                                        <select name="Brand" className="form-control" value={selectedBrandId}
                                            ref={(e: HTMLSelectElement) => this.brandSelect = e || this.brandSelect}
                                            onChange={(e) => {
                                                let brandId = (e.target as HTMLSelectElement).value;
                                                this.state.selectedBrand = this.state.brands.filter(o => o.Id == brandId)[0];
                                                this.setState(this.state);
                                            }} >
                                            <option key="empty" value="">请选择品牌</option>
                                            {this.state.brands.map(o =>
                                                <option key={o.Id} value={o.Id} >{o.Name}</option>
                                            )}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-sm-10 col-sm-offset-2">
                                        <label className="radio-inline">
                                            <input type="radio" checked={isInclude}
                                                onChange={(e) => {
                                                    this.state.isInclude = (e.target as HTMLInputElement).checked;
                                                    this.setState(this.state);
                                                }} />包含
                                        </label>
                                        <label className="radio-inline">
                                            <input type="radio" checked={!isInclude}
                                                onChange={(e) => {
                                                    this.state.isInclude = !(e.target as HTMLInputElement).checked;
                                                    this.setState(this.state);
                                                }} />排除
                                    </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
                            <button name="btnOK" type="button" className="btn btn-primary"
                                onClick={() => this.confirm()}>确定</button>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

class CategoryInputDialog extends React.Component<
    React.Props<CategoryInputDialog> & { page: chitu.Page },
    { categories: Category[], selectedCategory: Category, isInclude: boolean }>{
    private categorySelect: HTMLSelectElement;
    private element: HTMLElement;
    private onCategorySelected: (category: Category, isInclude: boolean) => void;
    private static categories: Array<Category>;
    private validator: dilu.FormValidator;

    constructor(props) {
        super(props);

        this.state = {
            categories: CategoryInputDialog.categories || [],
            selectedCategory: null, isInclude: true
        };
        let shopping = this.props.page.createService(ShoppingService);

        let args: wuzhui.DataSourceSelectArguments = {
            maximumRows: 1000
        };

        if (CategoryInputDialog.categories == null) {
            shopping.categories().then(categories => {
                CategoryInputDialog.categories = categories;
                this.state.categories = categories;
                this.setState(this.state);
            });
        }

    }
    show(onBrandSelected: (category: Category, isInclude: boolean) => void) {

        this.state.isInclude = true;
        this.state.selectedCategory = null;
        this.setState(this.state);

        this.onCategorySelected = onBrandSelected;
        ui.showDialog(this.element);
    }
    async confirm() {
        let isValid = await this.validator.check();
        if (!isValid)
            return;

        this.onCategorySelected(this.state.selectedCategory, this.state.isInclude);
        ui.hideDialog(this.element);
    }
    componentDidMount() {
        let { required } = dilu.rules;
        this.validator = new dilu.FormValidator(this.element,
            { name: "Category", rules: [required("请选择类别")] }
        )
    }
    render() {
        let category = this.state.selectedCategory;
        let isInclude = this.state.isInclude;
        let categories = this.state.categories;
        let selectedBrandId = category == null ? "" : category.Id;
        return (
            <form name="dlg_brand" className="modal fade"
                ref={(e: HTMLElement) => this.element = e || this.element}>
                <div data-bind="with:brand" className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                                <span className="sr-only">Close</span>
                            </button>
                            <h4 className="modal-title">添加类别</h4>
                        </div>
                        <div className="modal-body">
                            <div className="form-horizontal">
                                <div className="form-group">
                                    <label className="control-label col-sm-2">
                                        *类别
                                    </label>
                                    <div className="col-sm-10">
                                        <select name="Category" className="form-control" value={selectedBrandId}
                                            ref={(e: HTMLSelectElement) => this.categorySelect = e || this.categorySelect}
                                            onChange={(e) => {
                                                let categoryId = (e.target as HTMLSelectElement).value;
                                                this.state.selectedCategory = categories.filter(o => o.Id == categoryId)[0];
                                                this.setState(this.state);
                                            }} >
                                            <option key="empty" value="">请选择类别</option>
                                            {categories.map(o =>
                                                <option key={o.Id} value={o.Id} >{o.Name}</option>
                                            )}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-sm-10 col-sm-offset-2">
                                        <label className="radio-inline">
                                            <input type="radio" checked={isInclude}
                                                onChange={(e) => {
                                                    this.state.isInclude = (e.target as HTMLInputElement).checked;
                                                    this.setState(this.state);
                                                }} />包含
                                        </label>
                                        <label className="radio-inline">
                                            <input type="radio" checked={!isInclude}
                                                onChange={(e) => {
                                                    this.state.isInclude = !(e.target as HTMLInputElement).checked;
                                                    this.setState(this.state);
                                                }} />排除
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
                            <button name="btnOK" type="button" className="btn btn-primary"
                                onClick={() => this.confirm()}>确定</button>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

abstract class ContentRuleDialog<P, S> extends React.Component<P & React.Props<any>,
    { promotion?: Promotion } & S>{

    protected abstract get givenValueElements(): JSX.Element[];
    protected abstract get validatorFields(): dilu.ValidateField[];
    protected abstract get givenValue(): string;

    protected element: HTMLElement;
    protected title: string;

    private countSelect: HTMLSelectElement;
    private amountInput: HTMLInputElement;
    private amountInputError: HTMLElement;
    private validator: dilu.FormValidator;
    private onConfirm: (contentRule: PromotionContentRule) => void;

    constructor(props) {
        super(props);
        this.state = {} as S;
    }
    show(promotion: Promotion, onConfirm: (contentRule: PromotionContentRule) => void) {

        this.onConfirm = onConfirm;
        this.state.promotion = promotion;

        this.countSelect.value = "";
        this.amountInput.value = "";

        this.setState(this.state);
        ui.showDialog(this.element);
    }

    hide() {
        ui.hideDialog(this.element);
    }

    private async confirm() {
        let r = dilu.rules;
        this.validator.clearErrors();
        let checkResult = await this.validator.check();
        if (!checkResult) {
            return;
        }

        let { promotion } = this.state;
        let contentRule: PromotionContentRule = {
            Id: guid(),
            LevelValue: promotion.Method == "Count" ?
                Number.parseFloat(this.countSelect.value) :
                Number.parseFloat(this.amountInput.value),
            GivenValue: this.givenValue,
            CreateDateTime: new Date(Date.now())
        }

        contentRule.Description = description(promotion, contentRule);

        this.onConfirm(contentRule);
        ui.hideDialog(this.element);
    }

    componentDidMount() {
        let { required, numeric } = dilu.rules;

        dilu.FormValidator.errorClassName = "validationMessage";
        this.validator = new dilu.FormValidator(this.element,
            {
                name: "BuyCount", rules: [required()],
                condition: () => this.state.promotion.Method == "Count"
            },
            {
                name: "BuyAmount", rules: [required(), numeric()],
                condition: () => this.state.promotion.Method == "Amount",
                errorElement: this.amountInputError
            }
        )
        // this.validator.addFields(...this.validatorFields);
    }

    render() {

        let { promotion } = this.state;
        let method = promotion != null ? promotion.Method : "";

        return (
            <form className="modal fade" ref={(e: HTMLElement) => this.element = e || this.element}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                                <span className="sr-only">Close</span>
                            </button>
                            <h4 className="modal-title">{this.title || ''}</h4>
                        </div>
                        <div className="modal-body form-horizontal">
                            <div className="form-group" style={{ display: method == "Count" ? null : 'none' }} >
                                <label className="control-label col-sm-2">*购买数量</label>
                                <div className="col-sm-10">
                                    <select name="BuyCount" data-bind="value: buyCount"
                                        className="form-control" ref={(e: HTMLSelectElement) => this.countSelect = e || this.countSelect}>
                                        <option value="">购买数量</option>
                                        <option value="1">任意1件</option>
                                        <option value="2">任意2件</option>
                                        <option value="3">任意3件</option>
                                        <option value="4">任意4件</option>
                                        <option value="5">任意5件</option>
                                        <option value="6">任意6件</option>
                                        <option value="7">任意7件</option>
                                        <option value="8">任意8件</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group" style={{ display: method == "Amount" ? null : 'none' }}>
                                <label className="control-label col-sm-2">*消费金额</label>
                                <div className="col-sm-10">
                                    <div className="input-group">
                                        <input name="BuyAmount" data-bind="value:buyAmount" className="form-control" placeholder="请输入消费金额"
                                            ref={(e: HTMLInputElement) => this.amountInput = e || this.amountInput} />
                                        <div className="input-group-addon">元</div>
                                    </div>
                                    <span className={dilu.FormValidator.errorClassName}
                                        ref={(e: HTMLElement) => this.amountInputError = e || this.amountInputError} />
                                </div>
                            </div>
                            {this.givenValueElements}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
                            <button name="btnOK" data-bind="" type="button" className="btn btn-primary"
                                onClick={() => this.confirm()}>确定</button>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

/** 满赠优惠对话框 */
class BuyGivenDialog extends ContentRuleDialog<{ page: chitu.Page },
    { givenProducts: Array<{ id: string, quantity: number }> }> {

    private productIdInput: HTMLInputElement;
    private productCountSelect: HTMLSelectElement;
    private productNameInput: HTMLInputElement;
    private quantityInput: HTMLInputElement;
    private productNameError: HTMLElement;

    private productSelectDialog: ProductSelectDialog;

    constructor(props) {
        super(props);

        this.title = "满赠";
        this.state.givenProducts = [];
    }

    show(promotion: Promotion, onConfirm: (contentRule: PromotionContentRule) => void) {
        this.state.givenProducts = [];
        super.show(promotion, onConfirm)
    }

    private showProductSelector(): any {
        this.productSelectDialog.show((product) => {
            objectNames[product.Id] = product.Name;
            this.productNameInput.value = product.Name;
            this.productIdInput.value = product.Id;
        })
    }
    private onGiveProductChanged(): any {
        if (this.productIdInput.value && this.productCountSelect.value) {
            this.addGivenProduct();
            this.productNameInput.value = "";
            this.productIdInput.value = "";
            this.productCountSelect.value = "";
        }
    }
    private addGivenProduct(): any {
        let id = this.productIdInput.value;
        let quantity = Number.parseInt(this.productCountSelect.value);
        this.state.givenProducts.push({ id, quantity });
        this.setState(this.state);
    }
    private removeGivenProduct(item: any): any {
        let givenProducts = this.state.givenProducts.filter(o => o != item);
        this.state.givenProducts = givenProducts;
        this.setState(this.state);
    }

    protected get givenValue(): string {
        let givenValue = "";
        for (let i = 0; i < this.state.givenProducts.length; i++) {
            if (i > 0)
                givenValue = givenValue + ",";

            var p = this.state.givenProducts[i];
            givenValue = givenValue + `${p.id}:${p.quantity}`;
        }
        return givenValue;
    }

    protected get validatorFields(): dilu.ValidateField[] {
        let r = dilu.rules;
        return [
            {
                name: "ProductId",
                errorElement: this.productNameError,
                rules: [
                    r.custom(() => {
                        return this.state.givenProducts.length > 0
                    }, "至少输入一个赠送商品")
                ]
            }
        ];
    }

    protected get givenValueElements(): JSX.Element[] {
        let givenProducts = this.state.givenProducts;
        let shopping = this.props.page.createService(ShoppingService);
        return [
            <div key="buyGivenElements" className="form-group">
                <label data-bind="text:ko.unwrap($index) == 0 ? '*赠送商品' : ''" className="control-label col-sm-2">*赠送商品</label>
                {
                    givenProducts.map((o, i) =>
                        <div key={o.id} className={i == 0 ? "col-sm-10" : 'col-sm-10 col-sm-offset-2'}>
                            <div className="row" style={{ paddingTop: 8, paddingBottom: 12 }}>
                                <div className="col-sm-8" style={{ paddingRight: 0 }}>
                                    <input className="form-control" readOnly={true} value={objectNames[o.id]} />
                                </div>
                                <div className="col-sm-4" style={{ paddingLeft: 0 }}>
                                    <div className="input-group">
                                        <input className="form-control" value={`${o.quantity}件`} readOnly={true}
                                            ref={(e: HTMLInputElement) => this.quantityInput = e || this.quantityInput} />
                                        <span className="input-group-btn">
                                            <button className="btn btn-default" type="button"
                                                onClick={() => this.removeGivenProduct(o)}>
                                                <i className="icon-minus"></i>
                                            </button>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
                <div className={givenProducts.length == 0 ? "col-sm-10" : 'col-sm-10 col-sm-offset-2'}>
                    <div className="row">
                        <div className="col-sm-8" style={{ paddingRight: 0 }}>
                            <div className="input-group">
                                <input placeholder="请选择赠送的商品" className="form-control" readOnly={true}
                                    ref={(e: HTMLInputElement) => this.productNameInput = e || this.productNameInput} />
                                <input type="hidden" placeholder="请输入赠送的商品编号"
                                    onChange={() => this.onGiveProductChanged()} readOnly={true}
                                    ref={(e: HTMLInputElement) => this.productIdInput = e || this.productIdInput} />
                                <span className="input-group-btn">
                                    <button className="btn btn-default" type="button"
                                        onClick={() => this.showProductSelector()}>
                                        <i className="icon-cog"></i>
                                    </button>
                                </span>
                            </div>
                            <span className="validationMessage"
                                ref={(e: HTMLElement) => this.productNameError = e || this.productNameError} />
                        </div>
                        <div className="col-sm-4" style={{ paddingLeft: 0 }}>
                            {/* <div className="input-group"> */}
                            <select data-bind="value:quantity" className="form-control" style={{ height: 34 }}
                                onChange={() => this.onGiveProductChanged()}
                                ref={(e: HTMLSelectElement) => this.productCountSelect = e || this.productCountSelect}>
                                <option value="">赠送数量</option>
                                <option value="1">1件</option>
                                <option value="2">2件</option>
                                <option value="3">3件</option>
                                <option value="4">4件</option>
                                <option value="5">5件</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>,
            <ProductSelectDialog key="productSelectDialog" shopping={shopping}
                ref={(e) => this.productSelectDialog = e || this.productSelectDialog} />
        ]
    }
}

class BuyReduceDialog extends ContentRuleDialog<{}, {}> {
    private reduceInput: HTMLInputElement;
    private reduceInputError: HTMLElement;
    protected givenValueElements: JSX.Element[];
    protected get validatorFields(): dilu.ValidateField[] {
        let { required } = dilu.rules;
        return [
            { name: "ReduceAmount", rules: [required()], errorElement: this.reduceInputError }
        ];
    }

    get givenValue(): string {
        return this.reduceInput.value;
    }

    constructor(props) {
        super(props);

        this.givenValueElements = [
            <div key="reduceAmount" className="form-group">
                <label className="control-label col-sm-2">*减免金额</label>
                <div className="col-sm-10">
                    <div className="input-group">
                        <input name="ReduceAmount" data-bind="value:reduceAmount" className="form-control" placeholder="请输入减免金额"
                            ref={(e: HTMLInputElement) => this.reduceInput = e || this.reduceInput} />
                        <div className="input-group-addon">元</div>
                    </div>
                    <span className="validationMessage"
                        ref={(e: HTMLElement) => this.reduceInputError = e || this.reduceInputError} />
                </div>
            </div>
        ];


    }
}

class BuyDiscountDialog extends ContentRuleDialog<{}, {}>{
    private minorSelect: HTMLSelectElement;
    private mainSelect: HTMLSelectElement;

    protected get validatorFields(): dilu.ValidateField[] {
        return [];
    }
    protected get givenValue(): string {
        return `${this.mainSelect.value}.${this.minorSelect.value}`
    }
    protected get givenValueElements(): JSX.Element[] {
        return [
            <div key="buyDiscountElement" className="form-group">
                <label className="control-label col-sm-2">*打折</label>
                <div className="col-sm-10">
                    <div className="row">
                        <div className="col-xs-6" style={{ paddingRight: 0 }}>
                            <select data-bind="value:pricePercentMain" className="form-control"
                                ref={(e: HTMLSelectElement) => this.mainSelect = e || this.mainSelect}>
                                <option value="9">9</option>
                                <option value="8">8</option>
                                <option value="7">7</option>
                                <option value="6">6</option>
                                <option value="5">5</option>
                                <option value="4">4</option>
                                <option value="3">3</option>
                                <option value="2">2</option>
                                <option value="1">1</option>
                            </select>
                        </div>
                        <div className="col-xs-6" style={{ paddingLeft: 0 }}>
                            <div className="input-group">
                                <select data-bind="value:pricePercentMinor" className="form-control"
                                    ref={(e: HTMLSelectElement) => this.minorSelect = e || this.minorSelect}>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                </select>
                                <div className="input-group-addon">
                                    折
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ]
    }

}

export class PromotionRangeComponent extends React.Component<
    { page: chitu.Page, rules: PromotionRangeRule[] },
    { isAll?: boolean, rules: PromotionRangeRule[] }> {

    private categoryInputDialog: CategoryInputDialog;
    private brandInputDialog: BrandInputDialog;
    private productInputDialog: ProductInputDialog;
    private productSelectDialog: ProductSelectDialog;

    constructor(props) {
        super(props);
        this.state = { rules: this.props.rules || [] };
    }

    private newCategoryRule(): any {
        this.categoryInputDialog.show((category, isInclude) => {
            let rule: PromotionRangeRule = {
                Id: guid(),
                ObjectName: category.Name,
                ObjectId: category.Id,
                ObjectType: 'Category',
                // PromotionId: promotion.Id,
                CollectionType: isInclude ? 'Include' : 'Exclude',
                CreateDateTime: new Date(Date.now())
            }
            // promotion.PromotionRangeRules.push(rule);
            this.state.rules.push(rule);
            this.setState(this.state);
        })
    }
    private newBrandRule(): any {
        this.brandInputDialog.show((brand, isInclude) => {
            let rule: PromotionRangeRule = {
                Id: guid(),
                ObjectName: brand.Name,
                ObjectId: brand.Id,
                ObjectType: 'Brand',
                // PromotionId: promotion.Id,
                CollectionType: isInclude ? 'Include' : 'Exclude',
                CreateDateTime: new Date(Date.now())
            }
            this.state.rules.push(rule);
            this.setState(this.state);
        })
    }
    private newProductRule(): any {
        this.productInputDialog.show((product, isInclude) => {
            let rule: PromotionRangeRule = {
                Id: guid(),
                ObjectName: product.Name,
                ObjectId: product.Id,
                ObjectType: 'Product',
                // PromotionId: promotion.Id,
                CollectionType: isInclude ? 'Include' : 'Exclude',
                CreateDateTime: new Date(Date.now())
            }
            this.state.rules.push(rule);
            this.setState(this.state);
        });
    }

    render() {
        let { isAll, rules } = this.state;
        let page = this.props.page;
        let shopping = page.createService(ShoppingService);
        return [
            <table key="main" border={1} className="table table-striped table-bordered table-hover" style={{ borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th colSpan={4}>优惠范围</th>
                    </tr>
                    <tr>
                        <th style={{ textAlign: 'center', width: 60 }}>类型</th>
                        <th style={{ textAlign: 'center' }}>名称</th>
                        <th style={{ textAlign: 'center', width: 160 }}>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style={{ display: rules.length > 0 ? 'none' : null }}>
                        <td colSpan={4} style={{ border: "0px", textAlign: 'center' }}>
                            <div style={{ padding: '50px 0px 50px 0px' }}>暂无数据</div>
                        </td>
                    </tr>
                    {rules.map((r, i) =>
                        <tr key={`range${i}`}>
                            <td>{objectTypeTexts[r.ObjectType] || r.ObjectType}</td>
                            <td>{r.ObjectName}</td>
                            <td style={{ textAlign: 'center' }}>
                                <label className="switch">
                                    <input checked={r.CollectionType == "Include"} type="checkbox" className="ace ace-switch ace-switch-5"
                                        onChange={(e) => {
                                            (e.target as HTMLInputElement).checked ? r.CollectionType = "Include" : r.CollectionType = "Exclude";
                                            this.setState(this.state);
                                        }} />
                                    <span className="lbl middle" data-lbl="包括 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 排除"></span>
                                </label>
                                <button className="btn btn-minier btn-danger" style={{ marginLeft: 8 }}
                                    onClick={() => {
                                        this.state.rules = rules.filter(item => item != r);
                                        this.setState(this.state);
                                    }}>
                                    <i className="icon-trash"></i>
                                </button>
                            </td>
                        </tr>
                    )}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={3}>
                            <div className="pull-left">
                                <label>
                                    <input checked={isAll} type="checkbox"
                                        onChange={(e) => isAll = (e.target as HTMLInputElement).checked} />
                                    &nbsp; 全场优惠
                                </label>
                            </div>
                            <div className="pull-right">
                                <button className="btn btn-primary btn-sm"
                                    onClick={() => this.newProductRule()}>添加商品</button>
                                <button className="btn btn-primary btn-sm"
                                    onClick={() => this.newBrandRule()}>添加品牌</button>
                                <button className="btn btn-primary btn-sm"
                                    onClick={() => this.newCategoryRule()}>添加品类</button>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>,
            <ProductInputDialog key="productInputDialog" page={page}
                ref={(e) => this.productInputDialog = e || this.productInputDialog} />,
            <BrandInputDialog key="brandInputDialog" page={page}
                ref={(e) => this.brandInputDialog = e || this.brandInputDialog} />,
            <CategoryInputDialog key="categoryInputDialog" page={page}
                ref={(e) => this.categoryInputDialog = e || this.categoryInputDialog} />,
            <ProductSelectDialog key="productSelectDialog" shopping={shopping}
                ref={(e) => this.productSelectDialog = e || this.productSelectDialog} />
        ]
    }
}


export default async function (page: chitu.Page) {
    app.loadCSS(page.name);
    let activityId = page.data.id;
    let activity = page.createService(ActivityService);
    let { promotions } = await Promise.all([activity.promotions(activityId)])
        .then(arr => ({
            promotions: arr[0]
        }));

    ReactDOM.render(<ActivityEditPage activityId={activityId} promotions={promotions} page={page} />, page.element);

}


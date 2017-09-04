import app = require('application')
import { default as shopping, Product as ShoppingProduct, Brand } from 'services/shopping';
import { Service, ValueStore } from 'service';

import UE = require('ue.ext');
// import { ImageBox } from 'common/controls';
import { PropertiesComponent } from 'modules/shopping/Product/Properties';
import FormValidator from 'formValidator';
import * as ui from 'ui';

class Product {
    Id = ko.observable()
    Name = ko.observable();
    Unit = ko.observable();
    OldPrice = ko.observable();
    Price = ko.observable();
    CostPrice = ko.observable();
    Introduce = ko.observable<string>();
    ImagePaths = ko.observableArray([]);
    Score = ko.observable();

    ImagePath = ko.pureComputed<string>({
        read: function () {
            return this.ImagePaths().join(',');
        },
        write: function (value) {
            if (value)
                this.ImagePaths(value.split(','));
            else
                this.ImagePaths([]);
        }
    }, this);

    BrandId = ko.observable();
    ProductCategoryId = ko.observable();
    OffShelve = ko.observable();
    OnShelve = ko.computed(function () {
        var offShelve = this.OffShelve();
        if (offShelve == null)
            offShelve = false;

        return !offShelve;
    }, this);
    SKU = ko.observable();
    Commission = ko.observable();
    DisplayCommission = ko.computed({
        read: function () {
            var c = ko.unwrap(this.Commission);
            if (c == null)
                return null;

            return (c * 100).toFixed(0);
        },
        write: function (value) {
            if (value == null)
                return;
            this.Commission(new Number(value).valueOf() / 100);
        }
    }, this);

    // Group = {
    //     Id: ko.observable(),
    //     Name: ko.observable(),
    //     ProductPropertyDefeineId: ko.observable(),
    //     ProductArgumentId: ko.observable()
    // };

    Stock = ko.observable();
    BuyLimitedNumber = ko.observable();
    MemberPrice = ko.observable();
    Discout = ko.observable();

    CategoryName = ko.observable();
    PropertyDefineId = ko.observable();

    // Arguments:{ key:string,value:string }[] = [];
    // Fields: { key:string,value:string }[] = [];
    Arguments = ko.observableArray<{ key: string, value: string }>();
    Fields = ko.observableArray<{ key: string, value: string }>();

    constructor() {
        this.Name.extend({ required: true });
        this.Price.extend({ required: true });
        this.Unit.extend({ required: true });
        this.Introduce.extend({ required: true });
    }
}


interface KeyValue {
    key: string,
    value: string
}

class PageModel {
    private $dlg_groups: JQuery;
    private page: chitu.Page;

    constructor(page: chitu.Page) {
        this.$dlg_groups = $(page.element).find('[name="groupList"]');
        this.page = page;
    }

    back() {
        app.back();
        // .catch(() => {
        //     location.href = '#Shopping/ProductList';
        // })
    }

    product = new Product();
    categories = ko.observableArray();
    brands = ko.observableArray();

    remove = (item, event) => {
        this.product.ImagePaths.remove(item);
    }

    save(model: PageModel) {
        // return shopping.saveProduct(model.product);
    }
}

export default function (page: chitu.Page) {
    // requirejs(['common/ImageFileResize'], () => {
    //     ($(this.element).find('[name="ImageUpload"]') as any).imageFileResize({
    //         max_width: 800,
    //         max_height: 800,
    //         callback: (file, imageData) => {
    //             var img_base64 = imageData.split(';')[1].split(',')[1];
    //             $.ajax({
    //                 url: Service.config.shopUrl + 'Common/UploadImage?dir=Shopping',
    //                 method: 'post',
    //                 dataType: 'json',
    //                 data: {
    //                     imageData: img_base64
    //                 }
    //             }).done((result) => {
    //                 var path = result.path;
    //                 if (path[0] == '/') {
    //                     path = path.substr(1, path.length - 1);
    //                 }
    //                 this.model.product.ImagePaths.push(Service.config.shopUrl + path);
    //             });
    //         }
    //     });
    // });

    // requirejs([`text!${page.routeData.actionPath}.html`, 'css!content/Shopping/ProductEdit.css'], function (html) {
    //     var element = document.createElement('div');
    //     page.element.appendChild(element);
    //     element.innerHTML = html;
    //     let model = new PageModel(page);
    //     UE.createEditor('productEditEditor', model.product.Introduce);
    //     ko.applyBindings(model, page.element);
    //     page_load(page, model, page.routeData.values);
    // });
    //requirejs(['css!content/Shopping/ProductEdit.css'], function (html) { });
    requirejs([`css!${page.routeData.actionPath}.css`]);

    type PageState = {
        categories: Array<{ Id: string, Name: string }>,
        brands: Array<Brand>, product: ShoppingProduct
    };
    class Page extends React.Component<{ product: ShoppingProduct }, PageState>{
        private validator: FormValidator;
        private element: HTMLElement;
        private introduceInput: HTMLInputElement;
        private fieldPropertiies: PropertiesComponent;
        private argumentsProperties: PropertiesComponent;

        constructor(props) {
            super(props);
            this.state = { categories: [], brands: [], product: this.props.product };
            shopping.categories().then(o => {
                this.state.categories = o;
                this.setState(this.state);
            });
            shopping.brands().then(o => {
                this.state.brands = o;
                this.setState(this.state);
            })
        }
        componentDidMount() {
            UE.createUEEditor('productEditEditor', this.introduceInput);
            this.validator = new FormValidator(this.element, {
                name: { rules: ['required'] },
                price: { rules: ['required'] },
                introduce: { rules: ['required'] }
            });
        }
        save(): Promise<any> {
            if (!this.validator.validateForm()) {
                return Promise.reject({});
            }
            this.state.product.Introduce = this.introduceInput.value;
            this.state.product.Fields = this.fieldPropertiies.state.properties;
            this.state.product.Arguments = this.argumentsProperties.state.properties;
            return shopping.saveProduct(this.state.product, page.routeData.values.parentId).then(data => {
                this.state.product.Id = data.Id;
                this.setState(this.state);
            })
        }
        render() {
            let product = this.state.product;
            return (
                <div className="Shopping-ProductEdit"
                    ref={(e: HTMLElement) => this.element = e || this.element}>
                    <div className="tabbable">
                        <ul className="nav nav-tabs">
                            <li className="pull-right">
                                <button className="btn btn-sm btn-primary" onClick={() => app.back()}>返回</button>
                            </li>
                            <li className="pull-right">
                                <a href="javascript:" className="btn btn-sm btn-primary"
                                    ref={(e: HTMLAnchorElement) => {
                                        if (!e) return;
                                        e.onclick = ui.buttonOnClick(() => this.save(), { toast: '保存商品成功' });

                                    }}>保存</a>
                            </li>
                        </ul>
                    </div>
                    <br />
                    <div className="row">
                        <div className="col-sm-12">
                            <h5>基本信息</h5>
                        </div>
                    </div>
                    <div className="row form-group">
                        <div className="col-lg-4 col-md-4">
                            <label className="col-lg-3">类别</label>
                            <div className="col-lg-9">
                                <select name="ProductCategoryId" className="form-control"
                                    value={product.ProductCategoryId || ''}
                                    onChange={(e) => {
                                        product.ProductCategoryId = (e.target as HTMLSelectElement).value;
                                        this.setState(this.state);
                                    }}>
                                    <option>请选择类别</option>
                                    {this.state.categories.map(o =>
                                        <option key={o.Id} value={o.Id}>{o.Name}</option>
                                    )}
                                </select>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4">
                            <label className="col-lg-3">*名称</label>
                            <div className="col-lg-9">
                                <input name="name" className="form-control" placeholder="请输入产品的名称" value={product.Name}
                                    onChange={(e) => {
                                        product.Name = (e.target as HTMLInputElement).value;
                                        this.setState(this.state);
                                    }} />
                            </div>
                        </div>
                        <div className="col-lg-4  col-md-4">
                            <label className="col-lg-3">品牌</label>
                            <div className="col-lg-9">
                                <select className="form-control" value={product.BrandId || ''}
                                    onChange={(e) => {
                                        product.BrandId = (e.target as HTMLSelectElement).value;
                                        this.setState(this.state);
                                    }}>
                                    <option>请选择品牌</option>
                                    {this.state.brands.map(o =>
                                        <option key={o.Id} value={o.Id}>{o.Name}</option>
                                    )}
                                </select>
                            </div>
                        </div>

                    </div>
                    <div className="row form-group">
                        <div className="col-lg-4 col-md-4">
                            <label className="col-lg-3">SKU</label>
                            <div className="col-lg-9">
                                <input className="form-control" value={product.SKU || ''}
                                    onChange={(e) => {
                                        product.SKU = (e.target as HTMLInputElement).value;
                                        this.setState(this.state);
                                    }} />
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4">
                            <label className="col-lg-3">*价格</label>
                            <div className="col-lg-9">
                                <div className="input-group">
                                    <input name="price" className="form-control" placeholder="请输入产品价格" value={product.Price as any || ''}
                                        onChange={(e) => {
                                            product.Price = Number.parseFloat((e.target as HTMLInputElement).value);
                                            this.setState(this.state);
                                        }} />
                                    <span className="input-group-addon">
                                        元
                                    </span>
                                </div>
                                <span className="price validationMessage" style={{ display: 'none' }}></span>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <PropertiesComponent ref={(e) => this.fieldPropertiies = e || this.fieldPropertiies} name="商品规格" properties={product.Fields} />
                    <hr />
                    <PropertiesComponent ref={(e => this.argumentsProperties = e || this.argumentsProperties)} name="商品属性" properties={product.Arguments} />
                    <hr />
                    <div className="row">
                        <div className="col-sm-12">
                            <h5>商品详情*</h5>
                        </div>
                    </div>
                    <div className="row form-group">
                        <div className="col-sm-12">
                            <script id="productEditEditor" type="text/html" dangerouslySetInnerHTML={{ __html: product.Introduce }}>
                            </script>
                            <span className="introduce validationMessage" style={{ display: 'none' }}></span>
                            <input name="introduce" type="hidden"
                                ref={(e: HTMLInputElement) => {
                                    if (!e) return;
                                    this.introduceInput = e;
                                    e.value = product.Introduce || '';
                                    e.onchange = (event) => {
                                        product.Introduce = (event.target as HTMLInputElement).value || '';
                                        this.setState(this.state);
                                    }
                                }} />
                        </div>
                    </div>
                    <hr />

                    <div className="row">
                        <div className="col-sm-12">
                            <h5>商品图片</h5>
                        </div>
                    </div>
                    <div className="row form-group">
                        {(product.ImagePaths || []).map((o, i) =>
                            <div key={i} className="text-center" style={{ float: 'left', border: 'solid 1px #ccc', marginLeft: 12, width: 114, height: 114 }}>
                                {/*<ImageBox key={i} style={{ width: 112, height: 112 }} src={o} />*/}
                                <img key={i} src={o} style={{ width: 112, height: 112 }} ref={(e: HTMLImageElement) => ui.loadImage(e)} />
                                <div style={{ position: 'relative', bottom: 18, backgroundColor: 'rgba(0, 0, 0, 0.55)', color: 'white' }}>
                                    <a data-bind="click:$root.remove" href="javascript:" style={{ color: 'white' }}>
                                        删除
                                    </a>
                                </div>
                            </div>
                        )}
                        <a className="fileinput-button" style={{ float: 'left', padding: '0 12px 0 12px' }}>
                            <div className="text-center" style={{ width: 112, height: 112, padding: '30px 0 0 0', border: 'solid 1px #ccc' }}>
                                <i className="icon-plus icon-4x"></i>
                                <div>图片上传</div>
                            </div>
                            <input name="ImageUpload" type="file" style={{ position: 'relative', top: -112, left: 0, opacity: 0, width: 112, height: 112 }} />
                        </a>
                    </div>
                </div>
            );
        }
    }

    var element = document.createElement('div');
    page.element.appendChild(element);
    var productId = page.routeData.values.id || page.routeData.values.parentId;
    let p: Promise<ShoppingProduct>;
    if (productId) {
        p = shopping.product(productId);
    }
    else {
        p = Promise.resolve({} as ShoppingProduct);
    }

    p.then((product) => {
        debugger;
        if (page.routeData.values.parentId)
            product.Id = undefined;

        ReactDOM.render(<Page product={product} />, element);
    })

}

// function page_load(page: chitu.Page, model: PageModel, args: any) {
//     let categories_deferred = shopping.categories().then(function (data) {
//         mapping.fromJS(data, {}, model.categories);
//     });
//     let brands_deferred = shopping.brands().then(function (data) {
//         mapping.fromJS(data, {}, model.brands);
//     });

//     var productId = page.routeData.values.id || page.routeData.values.parentId;
//     return Promise.all([categories_deferred, brands_deferred]).then(() => {
//         return shopping.product(args.id);
//     }).then((data) => {
//         mapping.fromJS(data, {}, model.product);
//     });
// }

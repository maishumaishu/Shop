import Product = require('models/Product');
import app = require('Application');
import { default as shopping, Product as ShoppingProduct, Brand } from 'services/Shopping';
import { Service, ValueStore } from 'services/Service';
import mapping = require('knockout.mapping');
import val = require('knockout.validation');

import UE = require('common/ue.ext');
import bs = require('bootstrap');
import { ImageBox } from 'common/controls';
import { PropertiesComponent } from 'modules/Shopping/Product/Properties';

ko.components.register('product-properties', {
    template: { require: 'text!modules/Shopping/Product/ProductProperties.html' },
    viewModel: { require: 'modules/Shopping/Product/ProductProperties' }
});

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
        app.back().catch(() => {
            location.href = '#Shopping/ProductList';
        })
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

    requirejs(['css!content/Shopping/ProductEdit.css'], function (html) { });


    type PageState = {
        categories: Array<{ Id: string, Name: string }>,
        brands: Array<Brand>, product: ShoppingProduct
    };
    class Page extends React.Component<{ product: ShoppingProduct }, PageState>{
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
            var field = new ValueStore<string>();
            field.value = this.props.product.Introduce;
            UE.createUEEditor('productEditEditor', field);
        }
        save() {
            shopping.saveProduct(this.state.product, page.routeData.values.parentId)
        }
        render() {
            let product = this.state.product;
            return (
                <div className="Shopping-ProductEdit">
                    <div className="tabbable">
                        <ul className="nav nav-tabs">
                            <li className="pull-right">
                                <button className="btn btn-sm btn-primary" onClick={() => app.back()}>返回</button>
                            </li>
                            <li className="pull-right">
                                <a href="javascript:" className="btn btn-sm btn-primary" data-dialog="toast:'产品已经成功保存'"
                                    onClick={() => this.save()}>保存</a>
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
                            <label className="col-lg-3">*类别</label>
                            <div className="col-lg-9">
                                <select name="ProductCategoryId" className="form-control"
                                    value={product.ProductCategoryId}
                                    onChange={(e) => {
                                        product.ProductCategoryId = (e.target as HTMLSelectElement).value;
                                        this.setState(this.state);
                                    }}>
                                    {this.state.categories.map(o =>
                                        <option key={o.Id} value={o.Id}>{o.Name}</option>
                                    )}
                                </select>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4">
                            <label className="col-lg-3">*名称</label>
                            <div className="col-lg-9">
                                <input className="form-control" placeholder="请输入产品的名称" value={product.Name}
                                    onChange={(e) => {
                                        product.Name = (e.target as HTMLInputElement).value;
                                        this.setState(this.state);
                                    }} />
                            </div>
                        </div>
                        <div className="col-lg-4  col-md-4">
                            <label className="col-lg-3">品牌</label>
                            <div className="col-lg-9">
                                <select className="form-control" value={product.BrandId}
                                    onChange={(e) => {
                                        product.BrandId = (e.target as HTMLSelectElement).value;
                                        this.setState(this.state);
                                    }}>
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
                                <input className="form-control" value={product.SKU}
                                    onChange={(e) => {
                                        product.SKU = (e.target as HTMLInputElement).value;
                                        this.setState(this.state);
                                    }} />
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4">
                            <label className="col-lg-3">*单位</label>
                            <div className="col-lg-9">
                                <input className="form-control" value={product.Unit}
                                    onChange={(e) => product.Unit = (e.target as HTMLInputElement).value} />
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4">
                            <label className="col-lg-3">*价格</label>
                            <div className="col-lg-9">
                                <div className="input-group">
                                    <input className="form-control" placeholder="请输入产品价格" value={`${product.Price}`}
                                        onChange={(e) => product.Price = Number.parseFloat((e.target as HTMLInputElement).value)} />
                                    <span className="input-group-addon">
                                        元
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row form-group">
                        <div className="col-lg-4 col-md-4">
                            <label className="col-lg-3">
                                积分
                            </label>
                            <div className="col-lg-9">
                                <input className="form-control" placeholder="请输入积分"
                                    onChange={(e) => product.Score = Number.parseInt((e.target as HTMLInputElement).value)} />
                            </div>
                        </div>
                    </div>

                    <hr />
                    <PropertiesComponent name="商品规格" properties={product.Fields} />
                    <hr />
                    <PropertiesComponent name="商品属性" properties={product.Arguments} />
                    <hr />
                    <div className="row">
                        <div className="col-sm-12">
                            <h5>商品详情</h5>
                        </div>
                    </div>
                    <script id="productEditEditor" type="text/html" dangerouslySetInnerHTML={{ __html: product.Introduce }}>
                    </script>

                    <hr />

                    <div className="row">
                        <div className="col-sm-12">
                            <h5>商品图片</h5>
                        </div>
                    </div>
                    <div className="row form-group">
                        {(product.ImagePaths || []).map((o, i) =>
                            <div key={i} className="text-center" style={{ float: 'left', border: 'solid 1px #ccc', marginLeft: 12, width: 114, height: 114 }}>
                                <ImageBox key={i} style={{ width: 112, height: 112 }} src={o} />
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

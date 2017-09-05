import app = require('application')
import { default as shopping, Product as Product, Brand } from 'services/shopping';
import { StationService, guid } from 'services/station';
import { Service, ValueStore } from 'service';

import UE = require('ue.ext');
// import { ImageBox } from 'common/controls';
import { PropertiesComponent } from 'modules/shopping/product/properties';
import FormValidator from 'formValidator';
import * as ui from 'ui';

const station = new StationService();
const imageThumbSize = 112;

export default function (page: chitu.Page) {

    requirejs([`css!${page.routeData.actionPath}`]);


    type PageState = {
        categories: Array<{ Id: string, Name: string }>,
        brands: Array<Brand>, product: Product
    };
    class ProductEditPage extends React.Component<{ product: Product }, PageState>{
        private validator: FormValidator;
        private element: HTMLElement;
        private introduceInput: HTMLInputElement;
        private introduceEditor: HTMLInputElement;
        private fieldPropertiies: PropertiesComponent;
        private argumentsProperties: PropertiesComponent;

        constructor(props) {
            super(props);
            this.state = {
                categories: [], brands: [],
                product: this.props.product
            };
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
        updloadImage(imageFile: File) {
            ui.imageFileToBase64(imageFile)
                .then(data => {
                    let imageName = `${guid()}_${data.width}_${data.height}`;
                    return station.saveImage(imageName, data.base64).then(o => Object.assign(data, { name: imageName }));
                })
                .then(data => {
                    this.state.product.ImagePaths.push(data.name);
                    this.setState(this.state);
                });
        }
        deleteImage(imageName: string) {
            return station.removeImage(imageName).then(data => {
                var imagePaths = this.state.product.ImagePaths.filter(o => o != imageName);
                this.state.product.ImagePaths = imagePaths;
                this.setState(this.state);
                return data;
            });
        }
        render() {
            let product = this.state.product;
            let ImagePaths = this.state.product.ImagePaths || [];
            // let { imageSources } = this.state;
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
                            <h5>商品图片</h5>
                        </div>
                    </div>
                    <div className="row form-group">
                        {(ImagePaths).map((o, i) =>
                            <div key={i} className="text-center" style={{ float: 'left', border: 'solid 1px #ccc', marginLeft: 12, width: imageThumbSize, height: imageThumbSize }}>
                                <img key={i} style={{ width: '100%', height: '100%' }}
                                    ref={(e: HTMLImageElement) => {
                                        if (!e) return;
                                        ui.loadImage(e, { loadImage: () => station.getImageAsBase64(o, 100) });
                                    }} />
                                <div style={{ position: 'relative', bottom: 18, backgroundColor: 'rgba(0, 0, 0, 0.55)', color: 'white' }}>
                                    <button href="javascript:" style={{ color: 'white' }} className="btn-link"
                                        ref={(e: HTMLButtonElement) => {
                                            if (!e) return;
                                            e.onclick = ui.buttonOnClick(() => this.deleteImage(o), {
                                                confirm: '确定删除该图片吗？'
                                            })
                                        }}>
                                        删除
                                    </button>
                                </div>
                            </div>
                        )}
                        <a className="fileinput-button" style={{ float: 'left', padding: '0 12px 0 12px' }}>
                            <div className="text-center" style={{ width: imageThumbSize, height: imageThumbSize, padding: '16px 0 0 0', border: 'solid 1px #ccc' }}>
                                <i className="icon-plus icon-4x"></i>
                                <div>图片上传</div>
                                <input name="ImageUpload" type="file" style={{ position: 'relative', top: '-100%', width: '100%', height: '100%', opacity: 0 }}
                                    ref={(e: HTMLInputElement) => {
                                        if (!e) return;
                                        e.onchange = () => {
                                            if (e.files.length > 0)
                                                this.updloadImage(e.files[0]);
                                        }
                                    }}
                                />
                            </div>
                            {/* <input name="ImageUpload" type="file" style={{ position: 'relative', top: -112, left: 0, opacity: 0, width: 112, height: 112 }} /> */}
                        </a>
                    </div>
                    <hr />

                    <div className="row">
                        <div className="col-sm-12">
                            <h5>商品详情*</h5>
                        </div>
                    </div>
                    <div className="row form-group">
                        <div className="col-sm-12">
                            <script id="productEditEditor" type="text/html" dangerouslySetInnerHTML={{ __html: product.Introduce || '' }}>
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
                </div>
            );
        }
    }

    var element = document.createElement('div');
    page.element.appendChild(element);
    var productId = page.routeData.values.id || page.routeData.values.parentId;
    let p: Promise<Product>;
    if (productId) {
        p = shopping.product(productId);
    }
    else {
        p = Promise.resolve({
            ImagePaths: []
        } as Product);
    }

    p.then((product) => {
        if (page.routeData.values.parentId)
            product.Id = undefined;

        ReactDOM.render(<ProductEditPage product={product} />, element);
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

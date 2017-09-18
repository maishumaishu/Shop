import app = require('application')
import { default as shopping, Product as Product, Brand } from 'services/shopping';
import { StationService, guid } from 'services/station';
import { Service, ValueStore, imageUrl } from 'service';

import UE = require('ue.ext');
import { PropertiesComponent } from 'modules/shopping/product/properties';
import FormValidator from 'formValidator';
import * as ui from 'ui';
import tips from 'tips';

const station = new StationService();
const imageThumbSize = 112;

export default function (page: chitu.Page) {

    requirejs([`css!${page.routeData.actionPath}`]);
    var editorId = guid();

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
            UE.createUEEditor(editorId, this.introduceInput);
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
                // this.setState(this.state);
            })
        }
        updloadImage(imageFile: File) {
            ui.imageFileToBase64(imageFile)
                .then(data => {
                    return station.saveImage(data.base64).then(o => `${o._id}_${data.width}_${data.height}`);
                })
                .then(name => {
                    this.state.product.ImagePaths.push(name);
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
                            <h4>基本信息</h4>
                        </div>
                    </div>
                    <div className="row form-group">
                        <div className="col-lg-4 col-md-4">
                            <label className="col-lg-3">类别*</label>
                            <div className="col-lg-9">
                                <select name="ProductCategoryId" className="form-control"
                                    ref={(e: HTMLSelectElement) => {
                                        if (!e) return;
                                        e.value = product.ProductCategoryId || '';
                                        e.onchange = () => {
                                            product.ProductCategoryId = e.value;
                                        }
                                    }}>
                                    <option value="">请选择类别</option>
                                    {this.state.categories.map(o =>
                                        <option key={o.Id} value={o.Id}>{o.Name}</option>
                                    )}
                                </select>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4">
                            <label className="col-lg-3">名称*</label>
                            <div className="col-lg-9">
                                <input name="name" className="form-control" placeholder="请输入产品的名称"
                                    ref={(e: HTMLInputElement) => {
                                        if (!e) return;
                                        e.value = product.Name || '';
                                        e.onchange = () => {
                                            product.Name = e.value;
                                        }
                                    }} />
                            </div>
                        </div>
                        <div className="col-lg-4  col-md-4">
                            <label className="col-lg-3">品牌</label>
                            <div className="col-lg-9">
                                <select className="form-control"
                                    ref={(e: HTMLSelectElement) => {
                                        if (!e) return;
                                        e.value = product.BrandId || '';
                                        e.onchange = () => {
                                            product.BrandId = e.value;
                                        }
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
                                <input className="form-control"
                                    ref={(e: HTMLInputElement) => {
                                        if (!e) return;
                                        e.value = product.SKU || '';
                                        e.onchange = () => {
                                            product.SKU = e.value;
                                        }
                                    }} />
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4">
                            <label className="col-lg-3">价格*</label>
                            <div className="col-lg-9">
                                <div className="input-group">
                                    <input name="price" className="form-control" placeholder="请输入产品价格"
                                        ref={(e: HTMLInputElement) => {
                                            if (!e) return;
                                            e.value = product.Price as any || '';
                                            e.onchange = () => {
                                                product.Price = Number.parseFloat(e.value);
                                            }
                                        }} />
                                    <span className="input-group-addon">
                                        元
                                    </span>
                                </div>
                                <span className="price validationMessage" style={{ display: 'none' }}></span>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4">
                            <label className="col-lg-3">单位*</label>
                            <div className="col-lg-9">
                                <input name="unit" className="form-control" placeholder="请输入产品单位"
                                    ref={(e: HTMLInputElement) => {
                                        if (!e) return;
                                        e.value = product.Unit as any || '';
                                        e.onchange = () => {
                                            product.Unit = e.value;
                                        }
                                    }} />
                                <span className="price validationMessage" style={{ display: 'none' }}></span>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <PropertiesComponent ref={(e) => this.fieldPropertiies = e || this.fieldPropertiies} name="商品规格" properties={product.Fields}
                        emptyText={tips.noProductRegular} />
                    <hr />
                    <PropertiesComponent ref={(e => this.argumentsProperties = e || this.argumentsProperties)} name="商品属性" properties={product.Arguments}
                        emptyText={tips.noProductProperty} />
                    <hr />
                    <div className="row">
                        <div className="col-sm-12">
                            <h4>商品图片</h4>
                        </div>
                    </div>
                    <div className="row form-group">
                        {(ImagePaths).map((o, i) =>
                            <div key={i} className="text-center" style={{ float: 'left', border: 'solid 1px #ccc', marginLeft: 12, width: imageThumbSize, height: imageThumbSize }}>
                                <img key={i} src={imageUrl(o)} style={{ width: '100%', height: '100%' }} />
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
                            <h4>商品详情*</h4>
                        </div>
                    </div>
                    <div className="row form-group">
                        <div className="col-sm-12">
                            <script id={editorId} type="text/html" dangerouslySetInnerHTML={{ __html: product.Introduce || '' }}>
                            </script>
                            <span className="introduce validationMessage" style={{ display: 'none' }}></span>
                            <input name="introduce" type="hidden"
                                ref={(e: HTMLInputElement) => {
                                    if (!e) return;
                                    this.introduceInput = e;
                                    e.value = product.Introduce || '';
                                    e.onchange = (event) => {
                                        product.Introduce = (event.target as HTMLInputElement).value || '';
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

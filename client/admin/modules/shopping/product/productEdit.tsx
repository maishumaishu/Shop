import app from 'application';
import { default as shopping } from 'adminServices/shopping';
import { StationService } from 'services/station';
import { Service, imageUrl, guid } from 'services/service';

import UE = require('ue.ext');
import { PropertiesComponent } from 'modules/shopping/product/properties';
import FormValidator from 'formValidator';
import * as ui from 'ui';
import tips from 'tips';
import ImageUpload from 'adminComponents/imageUpload';

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

            let args: wuzhui.DataSourceSelectArguments = { maximumRows: 100 };
            shopping.brands(args).then(o => {
                this.state.brands = o.dataItems;
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
            let arr = imageName.split('_');
            console.assert(arr.length == 3);
            return station.removeImage(arr[0]).then(data => {
                var imagePaths = this.state.product.ImagePaths.filter(o => o != imageName);
                this.state.product.ImagePaths = imagePaths;
                this.setState(this.state);
                return data;
            });
        }
        saveContentImage(data: ui.ImageFileToBase64Result) {
            return station.saveImage(data.base64).then(o => {
                let name = `${o._id}_${data.width}_${data.height}`;
                this.state.product.ImagePaths.push(name);
                this.setState(this.state);
            });
        }
        saveCoverImage(data: ui.ImageFileToBase64Result) {
            return station.saveImage(data.base64).then(o => {
                let name = `${o._id}_${data.width}_${data.height}`;
                this.state.product.ImagePath = name;
                this.setState(this.state);
            });
        }

        render() {
            let product = this.state.product;
            let imagePaths = this.state.product.ImagePaths || [];
            let imagePath = this.state.product.ImagePath;
            return (
                <div className="Shopping-ProductEdit"
                    ref={(e: HTMLElement) => this.element = e || this.element}>
                    <div className="tabbable">
                        <ul className="nav nav-tabs">
                            <li className="pull-right">
                                <button className="btn btn-sm btn-primary" onClick={() => app.back()}>
                                    <i className="icon-reply" />
                                    <span>返回</span>
                                </button>
                            </li>
                            <li className="pull-right">
                                <button href="javascript:" className="btn btn-sm btn-primary"
                                    ref={(e: HTMLAnchorElement) => {
                                        if (!e) return;
                                        e.onclick = ui.buttonOnClick(() => this.save(), { toast: '保存商品成功' });

                                    }}>
                                    <i className="icon-save" />
                                    <span>保存</span>
                                </button>
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
                    </div>
                    <div className="row form-group">
                        <div className="col-lg-4 col-md-4">
                            <label className="col-lg-3">标题</label>
                            <div className="col-lg-9">
                                <input name="unit" className="form-control" placeholder="请输入产品标题"
                                    ref={(e: HTMLInputElement) => {
                                        if (!e) return;
                                        e.value = product.Title || '';
                                        e.onchange = () => {
                                            product.Title = e.value;
                                        }
                                    }} />
                                <span className="price validationMessage" style={{ display: 'none' }}></span>
                            </div>
                        </div>
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
                        {(imagePaths).map((o, i) => <ImageThumber imagePath={o} key={o}
                            removed={() => {
                                this.state.product.ImagePaths = imagePaths.filter((item, index) => index != i);
                                this.setState(this.state);
                            }} />)}
                        <a style={{ float: 'left', paddingLeft: 12 }}>
                            <ImageUpload title="内容图片"
                                saveImage={(data) => this.saveContentImage(data)} style={{ float: 'left' }} />
                        </a>
                        {imagePath ?
                            <ImageThumber imagePath={imagePath}
                                removed={() => {
                                    this.state.product.ImagePath = '', this.setState(this.state)
                                }} /> :
                            <a style={{ float: 'left', paddingLeft: 12 }}>
                                <ImageUpload title={'封面图片'}
                                    saveImage={(data) => this.saveCoverImage(data)} style={{ float: 'left' }} />
                            </a>}
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

{/* <div key={i} className="text-center" style={{ float: 'left', border: 'solid 1px #ccc', marginLeft: 12, width: imageThumbSize, height: imageThumbSize }}>
                                <img key={i} src={imageUrl(o)} style={{ width: '100%', height: '100%' }} />
                                <div style={{ position: 'relative', bottom: 24, backgroundColor: 'rgba(0, 0, 0, 0.55)', color: 'white' }}>
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
                            </div> */}

class ImageThumber extends React.Component<React.Props<ImageThumber> & { imagePath, removed: (sender: ImageThumber) => void }, {}>{
    setDeleteButton(e: HTMLButtonElement, imagePath: string) {
        if (!e) return;
        let arr = imagePath.split('_');
        console.assert(arr.length == 3);
        e.onclick = ui.buttonOnClick(() => station.removeImage(arr[0]).then(o => this.props.removed(this)), {
            confirm: '确定删除该图片吗？'
        })
    }
    render() {
        let imagePath = this.props.imagePath;
        return (
            <div className="text-center" style={{ float: 'left', border: 'solid 1px #ccc', marginLeft: 12, width: imageThumbSize, height: imageThumbSize }}>
                <img src={imageUrl(imagePath, 100)} style={{ width: '100%', height: '100%' }} />
                <div style={{ position: 'relative', bottom: 24, backgroundColor: 'rgba(0, 0, 0, 0.55)', color: 'white' }}>
                    <button href="javascript:" style={{ color: 'white' }} className="btn-link"
                        ref={(e: HTMLButtonElement) => this.setDeleteButton(e, imagePath)}>
                        删除
                    </button>
                </div>
            </div>
        );
    }
}

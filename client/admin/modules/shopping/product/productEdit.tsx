import app from 'application';
import { ShoppingService } from 'services/shopping';
import { StationService } from 'services/station';
import { Service, imageUrl, guid } from 'services/service';

import UE = require('ue.ext');
import { PropertiesComponent } from 'modules/shopping/product/properties';
import { FormValidator, rules } from 'dilu';

import tips from 'tips';
import ImageUpload from 'controls/imageUpload';
import 'jquery-ui';
// const station = new StationService();
const imageThumbSize = 112;

export default function (page: chitu.Page) {

    let shopping = page.createService(ShoppingService);
    let station = page.createService(StationService);

    var editorId = guid();
    app.loadCSS(page.name);
    type PageState = {
        categories: Array<{ Id: string, Name: string }>,
        brands: Array<Brand>, product: Product
    };
    class ProductEditPage extends React.Component<{ product: Product }, PageState>{
        productThumbers: HTMLElement;
        introduceError: HTMLElement;
        priceError: HTMLElement;
        categoryError: HTMLElement;
        private categoryDialog: CategoryDialog;
        private validator: FormValidator;
        private element: HTMLFormElement;
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
            UE.createEditor(editorId, this.introduceInput);
            let nameElement = this.element.querySelector('[name="name"]') as HTMLInputElement;
            let priceElement = this.element.querySelector('[name="price"]') as HTMLInputElement;
            this.validator = new FormValidator(this.element,
                { name: "categoryId", rules: [rules.required("类别不能为空")], errorElement: this.categoryError },
                { name: "name", rules: [rules.required("名称不能为空")] },
                { name: "price", rules: [rules.required("价格不能为空")], errorElement: this.priceError },
                { name: 'introduce', rules: [rules.required("商品详请不能为空")], errorElement: this.introduceError }
            )

            setTimeout(() => {
                $(this.productThumbers).sortable({
                    items: 'li[product-id]',
                    update: () => {
                        let productIds: string[] = [];
                        this.productThumbers.querySelectorAll('[product-id]')
                            .forEach(o => productIds.push(o.getAttribute('product-id')));
                        this.state.product.ImagePaths = productIds;
                        this.setState(this.state);
                    }
                });
            }, 100)
        }
        async save(): Promise<any> {
            let isValid = await this.validator.check();
            if (!isValid) {
                throw new Error("validate fail.");
            }
            this.state.product.Introduce = this.introduceInput.value;
            this.state.product.Fields = this.fieldPropertiies.state.properties;
            this.state.product.Arguments = this.argumentsProperties.state.properties;
            return shopping.saveProduct(this.state.product, page.data.parentId).then(data => {
                this.state.product.Id = data.Id;
                return data;
            })
        }
        updloadImage(imageFile: File) {
            ui.imageFileToBase64(imageFile)
                .then(data => {
                    return station.saveImage(data.base64).then(o => `${o.id}`);
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
                let name = `${o.id}`;
                this.state.product.ImagePaths.push(name);
                this.setState(this.state);
            });
        }
        saveCoverImage(data: ui.ImageFileToBase64Result) {
            return station.saveImage(data.base64).then(o => {
                let name = `${o.id}`;
                this.state.product.ImagePath = name;
                this.setState(this.state);
            });
        }

        render() {
            let product = this.state.product;
            let imagePaths = this.state.product.ImagePaths || [];
            let imagePath = this.state.product.ImagePath;
            return [
                <div key="main" className="Shopping-ProductEdit"
                    ref={(e: HTMLFormElement) => this.element = e || this.element}>
                    <div className="tabbable">
                        <ul className="nav nav-tabs">
                            <li className="pull-right">
                                <button className="btn btn-sm btn-primary" onClick={() => history.back()}>
                                    <i className="icon-reply" />
                                    <span>返回</span>
                                </button>
                            </li>
                            <li className="pull-right">
                                <button className="btn btn-sm btn-primary"
                                    ref={(e: HTMLButtonElement) => {
                                        if (!e) return;
                                        ui.buttonOnClick(e, () => this.save(), { toast: '保存商品成功' });

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
                                <div className="input-group">
                                    <select name="categoryId" className="form-control"
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
                                    <span className="input-group-addon"
                                        onClick={() => this.categoryDialog.show()}>
                                        <i className="icon-plus" />
                                    </span>
                                </div>
                                <span className={dilu.FormValidator.errorClassName} style={{ display: 'none' }}
                                    ref={(e: HTMLElement) => this.categoryError = e || this.categoryError}></span>
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
                                <span className={dilu.FormValidator.errorClassName} style={{ display: 'none' }}
                                    ref={(e: HTMLElement) => this.priceError = e || this.priceError}></span>
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
                        <div className="col-sm-12">
                            <ul className="images" ref={(e: HTMLElement) => this.productThumbers = e || this.productThumbers}>
                                {imagePaths.map(o =>
                                    <li key={o} product-id={o}>
                                        <ImageThumber imagePath={o} station={station}
                                            removed={() => {
                                                this.state.product.ImagePaths = imagePaths.filter(item => item != o);
                                                this.setState(this.state);
                                            }} />
                                    </li>
                                )}
                                <li>
                                    <ImageUpload title="内容图片" saveImage={(data) => this.saveContentImage(data)} />
                                </li>

                                {imagePath ?
                                    <li>
                                        <ImageThumber imagePath={imagePath} station={station}
                                            removed={() => {
                                                this.state.product.ImagePath = '', this.setState(this.state)
                                            }} />
                                    </li> :
                                    <li>
                                        <ImageUpload title={'封面图片'}
                                            saveImage={(data) => this.saveCoverImage(data)} />
                                    </li>}
                            </ul>
                        </div>
                    </div>
                    <hr />

                    <div className="row">
                        <div className="col-sm-12">
                            <h4>商品详情*</h4>
                        </div>
                    </div>
                    <div className="row form-group">
                        <div className="col-sm-12">
                            <span className={dilu.FormValidator.errorClassName} style={{ display: 'none' }}
                                ref={(e: HTMLElement) => this.introduceError = e || this.introduceError}></span>
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


                </div>,
                <CategoryDialog key="categoryDialog"
                    container={this}
                    ref={(e) => this.categoryDialog = e || this.categoryDialog} />
            ];
        }
    }

    var element = document.createElement('div');
    page.element.appendChild(element);
    var productId = page.data.id || page.data.parentId;
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
        if (page.data.parentId)
            product.Id = undefined;

        ReactDOM.render(<ProductEditPage product={product} />, element);
    })

    class CategoryDialog extends React.Component<{ container: ProductEditPage } & React.Props<CategoryDialog>, any>{

        private element: HTMLElement;
        private nameElement: HTMLInputElement;

        constructor(props) {
            super(props);
        }

        show() {
            ui.showDialog(this.element);
        }

        async confirm() {

            let shop = page.createService(ShoppingService);

            let category = { Name: this.nameElement.value } as Category;
            let result = await shop.addCategory(category);
            Object.assign(category, result);

            let c = this.props.container;
            c.state.categories.push(category);
            c.state.product.ProductCategoryId = category.Id;
            c.setState(c.state);

            return result;
        }

        render() {
            return (
                <div className="modal fade" ref={(e: HTMLElement) => this.element = e || this.element}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" onClick={() => ui.hideDialog(this.element)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <h4 className="modal-title">添加品类</h4>
                            </div>
                            <div className="modal-body form-horizontal">
                                <div className="form-group">
                                    <label className="col-sm-2 control-label">名称</label>
                                    <div className="col-sm-10">
                                        <input name="name" type="text" className="form-control" placeholder="请输入品类名称"
                                            ref={(e: HTMLInputElement) => this.nameElement = e || this.nameElement} />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
                                <button type="button" className="btn btn-primary"
                                    ref={async (e: HTMLButtonElement) => {
                                        if (!e) return;
                                        ui.buttonOnClick(e, async () => {
                                            await this.confirm();
                                            ui.hideDialog(this.element);
                                        })

                                    }}>确定</button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }

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

type ImageThumberProps = React.Props<ImageThumber> & {
    imagePath, removed: (sender: ImageThumber) => void, station: StationService
}
class ImageThumber extends React.Component<ImageThumberProps, {}>{
    setDeleteButton(e: HTMLButtonElement, imagePath: string) {
        if (!e) return;
        let arr = imagePath.split('_');
        // console.assert(arr.length == 3);
        let { station } = this.props;
        e.onclick = ui.buttonOnClick(() => station.removeImage(arr[0]).then(o => this.props.removed(this)), {
            confirm: '确定删除该图片吗？'
        })
    }
    render() {
        let imagePath = this.props.imagePath;
        return (
            <div className="text-center" style={{ border: 'solid 1px #ccc' }}>
                <img src={imageUrl(imagePath, 100)} style={{ width: '100%', height: '100%' }} />
                <div style={{ position: 'relative', marginTop: -24, backgroundColor: 'rgba(0, 0, 0, 0.55)', color: 'white' }}>
                    <button href="javascript:" style={{ color: 'white' }} className="btn-link"
                        ref={(e: HTMLButtonElement) => this.setDeleteButton(e, imagePath)}>
                        删除
                    </button>
                </div>
            </div>
        );
    }


}



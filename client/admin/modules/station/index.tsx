/** 店铺概况　页面 */
// import { Button, ImageBox } from 'common/controls';
import { default as site } from 'admin/site'
import { StationService } from 'admin/services/station';
import { imageUrl, Service } from 'admin/services/service';
import { FormValidator, rules } from 'dilu';
import 'bootstrap';
import { siteMap as userSiteMap, siteMap } from 'user/site';
import app from 'admin/application';

import QRCode = require('qrcode');
import ClipboardJS = require('clipboard');
import imageManager from 'admin/controls/imageManager';
import { MemberService } from 'admin/services/member';


let { protocol, port, host } = location;
let storeHomeUrl = `${protocol}//${host}/user/?appKey=${Service.appToken}`;

export default async function (page: chitu.Page) {

    app.loadCSS(page.name);

    let member = page.createService(MemberService);

    class StationIndexPage extends React.Component<{ store: Store }, { store: Store }>{
        private qrcodeElement: HTMLElement;
        private nameInput: HTMLInputElement;
        // private imageUpload: ImageUpload;
        private validator: FormValidator;

        constructor(props) {
            super(props);
            this.state = { store: this.props.store };
        }
        async save() {
            let isValid = await this.validator.check();
            if (!isValid)
                return Promise.reject({});

            // if (this.imageUpload.changed) {
            //     var data = await station.saveImage(this.imageUpload.state.src);
            //     this.state.store.Data.ImageId = data.id;
            // }
            return member.saveStore(this.state.store);
        }

        componentDidMount() {
            let { required } = rules;
            this.validator = new FormValidator(page.element,
                { name: "name", rules: [required("店铺名称不能为空")] }
            )

            // let qrcode = new QRCode(this.qrcodeElement, site.userClientUrl);
            let qrcode = new QRCode(this.qrcodeElement, {
                text: site.userClientUrl,
                width: 160,
                height: 160,
            });
            qrcode.makeCode(site.userClientUrl);
        }
        render() {
            let { store } = this.state;

            return (
                <div className="station-index">
                    <ul className="nav nav-tabs">
                        <li className="dropdown pull-right">
                            <button className="btn btn-sm btn-primary dropdown-toggle" data-toggle="dropdown">
                                <i className="icon-sitemap"></i>
                                <span>访问店铺</span>
                            </button>
                            <div className="dropdown-menu dropdown-menu-right" style={{ padding: 20 }}>
                                <div style={{ width: '100%', textAlign: 'center' }}>手机扫码访问</div>
                                <div style={{ width: 180, height: 180, padding: 10 }}
                                    ref={(e: HTMLElement) => this.qrcodeElement = e || this.qrcodeElement} />
                                <div style={{ width: '100%' }}>
                                    <button className="pull-left btn-link"
                                        ref={(e: HTMLButtonElement) => {
                                            if (!e) return;

                                            var clipboard = new ClipboardJS(e, {
                                                text: function () {
                                                    // let pageName = userSiteMap.nodes.home_index.name;
                                                    // console.assert(pageName != null);
                                                    // let { protocol, port, host } = location;
                                                    // let baseUrl = `${protocol}//${host}/user/?appKey=${Service.appToken}`;
                                                    // return baseUrl;
                                                    return storeHomeUrl;
                                                }
                                            });

                                            clipboard.on('success', function (e) {
                                                ui.showToastMessage('商品链接已经成功复制');
                                            });

                                            clipboard.on('error', function (e) {
                                                ui.alert('商品链接已经成功失败');
                                            });
                                        }}>
                                        复制页面链接
                                    </button>
                                    <div className="pull-right">
                                        <button className="btn-link"
                                            onClick={() => {
                                                // let url = userApp.createUrl(siteMap.nodes.home_index);
                                                window.open(storeHomeUrl, "_blank");
                                            }}>
                                            电脑访问
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className="pull-right">
                            <button className="btn btn-sm btn-primary"
                                ref={(e: HTMLButtonElement) => {
                                    if (!e) return;
                                    e.onclick = ui.buttonOnClick(() => this.save(), { toast: "保存成功" });
                                }}>
                                <i className="icon-save"></i>
                                <span>保存</span>
                            </button>
                        </li>
                    </ul>
                    <div className="clearfix">
                    </div>
                    <div className="well" style={{ minHeight: 100 }}>
                        <div className="row form-group">
                            <div className="col-lg-12">
                                <label className="col-md-4" style={{ width: 120 }}>店铺名称*</label>
                                <div className="col-md-8" style={{ maxWidth: 300 }}>
                                    <input name="name" className="form-control" value={store.Name}
                                        onChange={(e) => {
                                            store.Name = (e.target as HTMLInputElement).value;
                                            this.setState(this.state);
                                        }}
                                        ref={(e: HTMLInputElement) => this.nameInput = e || this.nameInput} />
                                </div>
                            </div>
                        </div>
                        <div className="row form-group">
                            <div className="col-lg-12">
                                <label className="col-md-4" style={{ width: 120 }}>店铺图标</label>
                                <div className="col-md-8" style={{ maxWidth: 300 }}>
                                    {/* <ImageUpload ref={e => this.imageUpload = e || this.imageUpload}
                                        src={store.Data.ImageId ? imageUrl(store.Data.ImageId) : null} /> */}
                                    <img className="img-responsive" src={imageUrl(store.Data.ImageId)}
                                        title="点击上传店铺图标"
                                        ref={(e: HTMLImageElement) => {
                                            if (!e) return;
                                            ui.renderImage(e, { imageSize: { width: 300, height: 300 } });
                                            e.onclick = () => {
                                                imageManager.show((imageIds) => {
                                                    store.Data.ImageId = imageIds[0];
                                                    debugger;
                                                    this.setState(this.state);
                                                    // ui.renderImage(e, { imageSize: { width: 300, height: 300 } });
                                                })
                                            }
                                        }} />
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* <div className="well summary">
                        <div className="pull-left text-center" style={{ width: '20%' }}>
                            <div className="number">0</div>
                            <span>微页面</span>
                        </div>
                        <div className="pull-left text-center" style={{ width: '20%' }}>
                            <div className="number">0</div>
                            <span>商品</span>
                        </div>
                        <div className="pull-left text-center" style={{ width: '20%' }}>
                            <div className="number">0</div>
                            <span>昨日浏览量</span>
                        </div>
                        <div className="pull-left text-center" style={{ width: '20%' }}>
                            <div className="number">0</div>
                            <span>昨日访客</span>
                        </div>
                        <div className="pull-left text-center" style={{ width: '20%' }}>
                            <div className="number">0</div>
                            <span>昨日访客</span>
                        </div>
                        <div className="clearfix"></div>
                    </div> */}
                </div>
            );
        }
    }

    let sotreId = site.appIdFromLocation();
    let store = await member.store(sotreId);
    ReactDOM.render(<StationIndexPage store={store} />, page.element);
}

interface ImageUploadProps extends React.Props<ImageUpload> {
    src?: string
}
interface ImageUploadState {
    src: string
}
class ImageUpload extends React.Component<ImageUploadProps, ImageUploadState>{
    private imageElement: HTMLImageElement;
    private width = 200;
    private height = 200;
    private _chnaged = false;
    constructor(props) {
        super(props);

        let emptyImage = ui.generateImageBase64(this.width, this.height, "请上传图片", { bgColor: 'white' })
        this.state = { src: this.props.src || emptyImage };
    }
    private async onFileChanged(e) {
        if (!e.files[0]) {
            return;
        }

        let data = await ui.imageFileToBase64(e.files[0], { width: this.width, height: this.height });
        this.state.src = data.base64;
        this._chnaged = true;
        this.setState(this.state);
    }
    get changed() {
        return this._chnaged;
    }
    render() {
        let src = this.state.src;
        return [
            <img key="img" style={{ width: this.width, height: this.height }} data-src={src}
                ref={(e: HTMLImageElement) => {
                    this.imageElement = e || this.imageElement;
                    e ? ui.renderImage(e) : null;
                }}
                src={src} />,
            <input key="file" name="ImageUpload" type="file" id="ImageUpload" multiple={true}
                style={{ position: 'absolute', top: 0, opacity: 0, height: this.height, width: this.width }}
                ref={(e: HTMLInputElement) => {
                    if (!e) return;
                    e.onchange = () => this.onFileChanged(e);
                }} />
        ]
    }
}
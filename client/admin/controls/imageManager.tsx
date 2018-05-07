import ImageUpload from 'admin/controls/imageUpload';
import ImageThumber from 'admin/controls/imageThumber';
import { StationService } from 'admin/services/station';
import 'wuzhui';
import { imageUrl } from 'share/common';
import app from 'admin/application';

requirejs(['less!admin/controls/imageManager']);

type State = {
    images: SiteImageData[],
    selectedItems: string[]
}

type Props = { element: HTMLElement } & React.Props<ImageManager>;//station: StationService 
class ImageManager extends React.Component<Props, State> {

    private showDialogCallback: (imageIds: string[]) => void;
    private dataSource: wuzhui.DataSource<SiteImageData>;
    private pagingBarElement: HTMLElement;
    // private element: HTMLElement;

    constructor(props) {
        super(props);

        this.state = { images: [], selectedItems: [] };
    }

    async componentDidMount() {
        let station = new StationService();
        station.error.add((sender, err) => app.error.fire(app, err, app.currentPage));

        let self = this;
        let dataSource = this.dataSource = new wuzhui.DataSource<SiteImageData>({
            primaryKeys: ['id'],
            async select(args) {
                let result = await station.images(args, 140, 140);
                self.state.images = result.dataItems;
                self.setState(self.state);
                return result;
            },
            async delete(item) {
                let result = await station.removeImage(item.id);
                self.state.images = self.state.images.filter(o => o.id != item.id);
                self.setState(self.state);
                return result;
            },
            async insert(item) {
                console.assert((item as any).data != null);
                let result = await station.saveImage((item as any).data);
                // item.id = result.id;
                Object.assign(item, result);
                self.state.images.unshift(item);
                self.setState(self.state);
                return result;
            }
        })

        let pagingBar = new wuzhui.NumberPagingBar({
            dataSource: dataSource,
            element: this.pagingBarElement,
            pagerSettings: {
                activeButtonClassName: 'active',
                buttonWrapper: 'li',
                buttonContainerWraper: 'ul',
                showTotal: false
            },
        });

        let ul = this.pagingBarElement.querySelector('ul');
        ul.className = "pagination";

        dataSource.selectArguments.maximumRows = 17;
        dataSource.select();
    }

    show(callback?: (imageIds: string[]) => void) {
        this.showDialogCallback = callback;
        this.state.selectedItems = [];
        this.setState(this.state);

        ui.showDialog(this.props.element);
    }

    async saveImage(data: string) {
        this.dataSource.insert({ data } as any);
    }

    removeImage(item: { id: string }): any {
        this.dataSource.delete(item);
    }

    render() {
        let { images, selectedItems } = this.state;
        let element = this.props.element;
        return (
            // <div className="image-manager modal fade" ref={(e: HTMLElement) => this.element = e || this.element}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close"
                            onClick={() => ui.hideDialog(element)}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h4 className="modal-title">选择图片</h4>
                    </div>
                    <div className="modal-body">
                        {images.map((o, i) => {
                            let thumber = <ImageThumber key={o.id} imagePath={o.id} className="col-xs-2"
                                remove={(imagePath: string) => this.removeImage(o)}
                                selectedText={selectedItems.indexOf(o.id) >= 0 ? `${selectedItems.indexOf(o.id) + 1}` : ''}
                                text={o.width != null && o.height != null ? `${o.width} X ${o.height}` : " "}
                                onClick={(sender, e) => {
                                    if (selectedItems.indexOf(o.id) >= 0) {
                                        this.state.selectedItems = selectedItems.filter(c => c != o.id);
                                    }
                                    else {
                                        this.state.selectedItems.push(o.id);
                                    }
                                    this.setState(this.state);
                                }} />

                            return thumber;
                        })}
                        <ImageUpload className="col-xs-2" saveImage={(data) => this.saveImage(data.base64)}
                            width={400} />
                        <div className="clearfix" />
                    </div>
                    <div className="modal-footer">
                        <div className="pull-left"
                            ref={(e: HTMLElement) => this.pagingBarElement = e || this.pagingBarElement}>
                        </div>
                        <button name="cancel" type="button" className="btn btn-default"
                            onClick={() => ui.hideDialog(element)}>
                            取消
                            </button>
                        <button name="ok" type="button" className="btn btn-primary"
                            onClick={() => {
                                if (this.showDialogCallback) {
                                    let imageIds = this.state.selectedItems.map(o => o);
                                    this.showDialogCallback(imageIds);
                                }
                                ui.hideDialog(element);
                            }}>
                            确定
                        </button>
                    </div>
                </div>
            </div>
            // </div>
        )
    }
}

let element = document.createElement('div');
element.className = 'image-manager modal fade';
element.style.zIndex = '1000';
document.body.appendChild(element);

let instance: ImageManager = ReactDOM.render(<ImageManager element={element} />, element);

export default {
    show(callback?: (imageIds: string[]) => void) {
        instance.show(callback);
    }
}
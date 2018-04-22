import ImageUpload from 'controls/imageUpload';
import ImageThumber from 'controls/imageThumber';
import station, { StationService } from 'services/station';
import 'wuzhui';
import { imageUrl } from 'share/common';

requirejs(['css!controls/imageManager']);

type State = { images: { id: string }[] }
type Props = { station: StationService } & React.Props<ImageManager>;
export default class ImageManager extends React.Component<Props, State> {

    private dataSource: wuzhui.DataSource<{ id: string }>;
    private pagingBarElement: HTMLElement;
    private element: HTMLElement;

    constructor(props) {
        super(props);

        this.state = { images: [] };
    }

    async componentDidMount() {
        let { station } = this.props;
        let self = this;
        let dataSource = this.dataSource = new wuzhui.DataSource({
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
            async insert(item: { id: string, data: string }) {
                console.assert(item.data != null);
                let result = await station.saveImage(item.data);
                item.id = result.id;
                self.state.images.unshift(item);
                self.setState(self.state);
                return result;
            }
        })

        // dataSource.selected.add((sender, result) => {
        //     this.state.images = result.dataItems;
        //     this.setState(this.state);
        // })
        // dataSource.deleted.add((sender, item) => {
        //     this.state.images = this.state.images.filter(o => o.id != item.id);
        //     this.setState(this.state);
        // })
        // dataSource.inserted.add((sender, item) => {
        //     this.state.images.unshift(item);
        //     this.setState(this.state);
        // })

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

        dataSource.selectArguments.maximumRows = 15;
        dataSource.select();
    }

    show() {
        ui.showDialog(this.element);
    }

    async saveImage(data: string) {
        this.dataSource.insert({ data } as any);
    }

    removeImage(item: { id: string }): any {
        this.dataSource.delete(item);
    }

    render() {
        let { images } = this.state;
        return (
            <div className="image-manager modal fade" ref={(e: HTMLElement) => this.element = e || this.element}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close"
                                onClick={() => ui.hideDialog(this.element)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title">选择图片</h4>
                        </div>
                        <div className="modal-body">
                            {images.map((o, i) =>
                                <ImageThumber key={i} imagePath={imageUrl(o.id, 140, 140)} className="col-xs-2"
                                    remove={(imagePath: string) => this.removeImage(o)} />
                            )}
                            <ImageUpload className="col-xs-2" saveImage={(data) => this.saveImage(data.base64)} />
                            <div className="clearfix" />
                        </div>
                        <div className="modal-footer">
                            <div className="pull-left"
                                ref={(e: HTMLElement) => this.pagingBarElement = e || this.pagingBarElement}>
                            </div>
                            <button name="cancel" type="button" className="btn btn-default"
                                onClick={() => ui.hideDialog(this.element)}>
                                取消
                            </button>
                            <button name="ok" type="button" className="btn btn-primary">
                                确定
                        </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
// import ImageUpload from 'admin/controls/imageUpload';
// import ImageThumber from 'admin/controls/imageThumber';
// import { StationService } from 'admin/services/station';
// import 'wuzhui';
// import { imageUrl } from 'share/common';
// import { app } from '../site';
// requirejs(['css!admin/controls/imageManager']);
// interface State<T> {
//     items: T[],
//     selectedItems: T[]
// }
// type Props = { element: HTMLElement } & React.Props<ItemSelectDialog<any>>;//station: StationService 
// export abstract class ItemSelectDialog<T> extends React.Component<Props, State<T>> {
//     element: HTMLElement;
//     private showDialogCallback: (imageIds: string[]) => void;
//     // private dataSource: wuzhui.DataSource<SiteImageData>;
//     private pagingBarElement: HTMLElement;
//     // private element: HTMLElement;
//     constructor(props) {
//         super(props);
//         this.state = { items: [], selectedItems: [] };
//     }
//     abstract get dataSource(): wuzhui.DataSource<SiteImageData>;
//     async componentDidMount() {
//         let station = new StationService();
//         station.error.add((sender, err) => app.error.fire(app, err, app.currentPage));
//         // let self = this;
//         // let dataSource = this.dataSource = new wuzhui.DataSource<SiteImageData>({
//         //     primaryKeys: ['id'],
//         //     async select(args) {
//         //         let result = await station.images(args, 140, 140);
//         //         self.state.items = result.dataItems;
//         //         self.setState(self.state);
//         //         return result;
//         //     },
//         //     async delete(item) {
//         //         let result = await station.removeImage(item.id);
//         //         self.state.items = self.state.items.filter(o => o.id != item.id);
//         //         self.setState(self.state);
//         //         return result;
//         //     },
//         //     async insert(item) {
//         //         console.assert((item as any).data != null);
//         //         let result = await station.saveImage((item as any).data);
//         //         // item.id = result.id;
//         //         Object.assign(item, result);
//         //         self.state.items.unshift(item);
//         //         self.setState(self.state);
//         //         return result;
//         //     }
//         // })
//         let pagingBar = new wuzhui.NumberPagingBar({
//             dataSource: this.dataSource,
//             element: this.pagingBarElement,
//             pagerSettings: {
//                 activeButtonClassName: 'active',
//                 buttonWrapper: 'li',
//                 buttonContainerWraper: 'ul',
//                 showTotal: false
//             },
//         });
//         let ul = this.pagingBarElement.querySelector('ul');
//         ul.className = "pagination";
//         this.dataSource.selectArguments.maximumRows = 17;
//         this.dataSource.select();
//     }
//     show(callback?: (imageIds: string[]) => void) {
//         this.showDialogCallback = callback;
//         this.state.selectedItems = [];
//         this.setState(this.state);
//         ui.showDialog(this.props.element);
//     }
//     async saveImage(data: string) {
//         this.dataSource.insert({ data } as any);
//     }
//     removeImage(item: { id: string }): any {
//         this.dataSource.delete(item);
//     }
//     render() {
//         let { items, selectedItems } = this.state;
//         let element = this.props.element;
//         return (
//             <div className="image-manager modal fade" ref={(e: HTMLElement) => this.element = e || this.element}>
//                 <div className="modal-dialog modal-lg">
//                     <div className="modal-content">
//                         <div className="modal-header">
//                             <button type="button" className="close"
//                                 onClick={() => ui.hideDialog(element)}>
//                                 <span aria-hidden="true">&times;</span>
//                             </button>
//                             <h4 className="modal-title">选择图片</h4>
//                         </div>
//                         <div className="modal-body">
//                             {items.map((o, i) =>
//                                 <div className="cols-lg-2">
//                                 </div>
//                             )}
//                             <ImageUpload className="col-xs-2" saveImage={(data) => this.saveImage(data.base64)}
//                                 width={400} />
//                             <div className="clearfix" />
//                         </div>
//                         <div className="modal-footer">
//                             <div className="pull-left"
//                                 ref={(e: HTMLElement) => this.pagingBarElement = e || this.pagingBarElement}>
//                             </div>
//                             <button name="cancel" type="button" className="btn btn-default"
//                                 onClick={() => ui.hideDialog(element)}>
//                                 取消
//                             </button>
//                             <button name="ok" type="button" className="btn btn-primary"
//                                 onClick={() => {
//                                     if (this.showDialogCallback) {
//                                         let imageIds = this.state.selectedItems.map(o => o);
//                                         this.showDialogCallback(imageIds);
//                                     }
//                                     ui.hideDialog(element);
//                                 }}>
//                                 确定
//                         </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         )
//     }
// }
// // let element = document.createElement('div');
// // element.className = 'image-manager modal fade';
// // document.body.appendChild(element);
// // let instance: ImageManager = ReactDOM.render(<ImageManager element={element} />, element);
// // export default {
// //     show(callback?: (imageIds: string[]) => void) {
// //         instance.show(callback);
// //     }
// // } 
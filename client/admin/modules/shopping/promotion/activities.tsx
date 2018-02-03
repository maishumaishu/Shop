
import { ActivityService } from 'adminServices/activity';
import site from 'site';
import app from 'application';
import { FormValidator, rules } from 'dilu';
import * as wz from 'myWuZhui';
import * as ui from 'ui';
import { GridViewItemPopupEditor } from 'myWuZhui';
// let JData = window['JData'];

export default function (page: chitu.Page) {

    let activity = page.createService(ActivityService);

    page.element.className = 'admin-pc';
    class ActivitiesPage extends React.Component<{}, {}>{
        private dataSource: wuzhui.DataSource<any>;
        private itemEditor: GridViewItemPopupEditor;

        componentDidMount() {
            let dataSource = this.dataSource = new wuzhui.DataSource<PromotionActivity>({
                primaryKeys: ['Id'],
                select: () => activity.activities(),
                insert: (dataItem) => activity.addActivity(dataItem),
                delete: (dataItem) => activity.deleteActivity(dataItem),
                update: (dataItem) => activity.updateActivity(dataItem)
            })
            wz.appendGridView(page.element, {
                dataSource,
                columns: [
                    new wz.BoundField({ dataField: 'Name', headerText: '活动名称' }),
                    new wz.BoundField({ dataField: 'BeginDate', headerText: '开始日期', dataFormatString: '{0:d}' }),
                    new wz.BoundField({ dataField: 'EndDate', headerText: '结束日期', dataFormatString: '{0:d}' }),
                    new wz.CommandField({
                        leftButtons(dataItem) {
                            return [
                                <button className="btn btn-minier btn-info" onClick={() => app.redirect(`shopping/promotion/activityEdit?id=${dataItem.Id}`)}>
                                    <i className="icon-cog" />
                                    <span>设置</span>
                                </button>
                            ];
                        },
                        itemStyle: { width: '130px' } as CSSStyleDeclaration,
                        itemEditor: this.itemEditor
                    })
                ]
            })
        }
        add() {
            this.itemEditor.show();
        }
        saveDataItem(dataItem: Promotion) {
            if (dataItem.Id)
                return this.dataSource.update(dataItem);

            return this.dataSource.insert(dataItem);
        }
        render() {
            return (
                <div>
                    <div name="tabs" className="tabbable">
                        <ul className="nav nav-tabs">
                            <li className="pull-right">
                                <button href="javascript:" className="btn btn-primary btn-sm pull-right"
                                    ref={(e: HTMLAnchorElement) => {
                                        if (!e) return;
                                        e.onclick = () => this.add();
                                    }}>
                                    <i className="icon-plus" />
                                    <span>添加</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                    <wz.GridViewItemPopupEditor name="活动"
                        ref={(e) => {
                            if (!e) return;
                            this.itemEditor = e;
                            // e.validator = new FormValidator(e.element, {
                            //     BeginDate: { rules: ['required'] },
                            //     EndDate: { rules: ['required'] }
                            // })
                            let beginDateElement = e.element.querySelector('[name="BeginDate"]') as HTMLInputElement;
                            let endDateElement = e.element.querySelector('[name="EndDate"]') as HTMLInputElement;
                            e.validator = new FormValidator(
                                { element: beginDateElement, rules: [rules.required()] },
                                { element: endDateElement, rules: [rules.required()] },
                            )
                        }}
                        saveDataItem={(dataItem) => {
                            if (dataItem.Id)
                                return this.dataSource.update(dataItem);

                            return this.dataSource.insert(dataItem);
                        }}>
                        <div className="form-group">
                            <label className="control-label col-sm-2">活动名称</label>
                            <div className="col-sm-10">
                                <input name="Name" className="form-control" autoFocus={true} placeholder="请输入活动的名称" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label col-sm-2">开始日期</label>
                            <div className="col-sm-10">
                                <input name="BeginDate" className="form-control" autoFocus={true} placeholder="请输入活动的开始日期" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label col-sm-2">结束日期</label>
                            <div className="col-sm-10">
                                <input name="EndDate" className="form-control" autoFocus={true} placeholder="请输入活动的结束日期" />
                            </div>
                        </div>
                    </wz.GridViewItemPopupEditor>
                </div>
            );
        }
    }

    ReactDOM.render(<ActivitiesPage />, page.element);

}
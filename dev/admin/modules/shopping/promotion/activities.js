define(["require", "exports", "admin/services/activity", "admin/application", "dilu", "admin/siteMap", "myWuZhui"], function (require, exports, activity_1, application_1, dilu_1, siteMap_1, wz) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // let JData = window['JData'];
    function default_1(page) {
        let activity = page.createService(activity_1.ActivityService);
        class ActivitiesPage extends React.Component {
            componentDidMount() {
                let dataSource = this.dataSource = new wuzhui.DataSource({
                    primaryKeys: ['Id'],
                    select: () => activity.activities(),
                    insert: (dataItem) => activity.addActivity(dataItem),
                    delete: (dataItem) => activity.deleteActivity(dataItem),
                    update: (dataItem) => activity.updateActivity(dataItem)
                });
                wz.appendGridView(page.element, {
                    dataSource,
                    columns: [
                        new wz.BoundField({ dataField: 'Name', headerText: '活动名称' }),
                        new wz.BoundField({ dataField: 'BeginDate', headerText: '开始日期', dataFormatString: '{d}' }),
                        new wz.BoundField({ dataField: 'EndDate', headerText: '结束日期', dataFormatString: '{d}' }),
                        new wz.CommandField({
                            leftButtons(dataItem) {
                                return [
                                    h("button", { className: "btn btn-minier btn-info", onClick: () => application_1.default.redirect(siteMap_1.siteMap.nodes.shopping_promotion_activityEdit, { id: dataItem.Id }) },
                                        h("i", { className: "icon-cog" }),
                                        h("span", null, "\u8BBE\u7F6E"))
                                ];
                            },
                            itemStyle: { width: '130px' },
                            itemEditor: this.itemEditor
                        })
                    ]
                });
            }
            add() {
                this.itemEditor.show();
            }
            saveDataItem(dataItem) {
                if (dataItem.Id)
                    return this.dataSource.update(dataItem);
                return this.dataSource.insert(dataItem);
            }
            render() {
                return (h("div", null,
                    h("div", { name: "tabs", className: "tabbable" },
                        h("ul", { className: "nav nav-tabs" },
                            h("li", { className: "pull-right" },
                                h("button", { href: "javascript:", className: "btn btn-primary btn-sm pull-right", ref: (e) => {
                                        if (!e)
                                            return;
                                        e.onclick = () => this.add();
                                    } },
                                    h("i", { className: "icon-plus" }),
                                    h("span", null, "\u6DFB\u52A0"))))),
                    h(wz.GridViewItemPopupEditor, { name: "活动", ref: (e) => {
                            if (!e)
                                return;
                            this.itemEditor = e;
                            // e.validator = new FormValidator(e.element, {
                            //     BeginDate: { rules: ['required'] },
                            //     EndDate: { rules: ['required'] }
                            // })
                            let beginDateElement = e.element.querySelector('[name="BeginDate"]');
                            let endDateElement = e.element.querySelector('[name="EndDate"]');
                            e.validator = new dilu_1.FormValidator(e.element, { name: "BeginDate", rules: [dilu_1.rules.required()] }, { name: "EndDate", rules: [dilu_1.rules.required()] });
                        }, saveDataItem: (dataItem) => {
                            if (dataItem.Id)
                                return this.dataSource.update(dataItem);
                            return this.dataSource.insert(dataItem);
                        } },
                        h("div", { className: "form-group" },
                            h("label", { className: "control-label col-sm-2" }, "\u6D3B\u52A8\u540D\u79F0"),
                            h("div", { className: "col-sm-10" },
                                h("input", { name: "Name", className: "form-control", autoFocus: true, placeholder: "请输入活动的名称" }))),
                        h("div", { className: "form-group" },
                            h("label", { className: "control-label col-sm-2" }, "\u5F00\u59CB\u65E5\u671F"),
                            h("div", { className: "col-sm-10" },
                                h("input", { name: "BeginDate", className: "form-control", autoFocus: true, placeholder: "请输入活动的开始日期" }))),
                        h("div", { className: "form-group" },
                            h("label", { className: "control-label col-sm-2" }, "\u7ED3\u675F\u65E5\u671F"),
                            h("div", { className: "col-sm-10" },
                                h("input", { name: "EndDate", className: "form-control", autoFocus: true, placeholder: "请输入活动的结束日期" }))))));
            }
        }
        ReactDOM.render(h(ActivitiesPage, null), page.element);
    }
    exports.default = default_1;
});

define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // let chitu = window['chitu'];
    let JData = window['JData'];
    let site = window['site'];
    // class AdvertItemListPage {
    function default_1(page) {
        requirejs([`text!${page.name}.html`], (html) => {
            page.element.innerHTML = html;
            page_load();
        });
        function page_load() {
            var sel_args = new JData.DataSourceSelectArguments();
            sel_args.set_maximumRows(10);
            var dataSource = new JData.WebDataSource(site.config.siteUrl + "AdvertItem/GetAdvertItems");
            dataSource.set_deleteUrl(site.config.siteUrl + 'AdvertItem/DeleteAdvertItem');
            $('<table>').appendTo(page.element).gridView({
                dataSource: dataSource,
                columns: [
                    { dataField: 'ImgUrl', headerText: '图片', itemStyle: { width: '280px' } },
                    { dataField: 'LinkUrl', headerText: '链接地址' },
                    { type: JData.CommandField, showDeleteButton: true, itemStyle: { width: '120px' } }
                ],
                rowCreated: function (sender, args) {
                    if (args.row.get_rowType() != JData.DataControlRowType.DataRow)
                        return;
                    var row = args.row.get_element();
                    var dataItem = args.row.get_dataItem();
                    var command_cell = row.cells[row.cells.length - 1];
                    site.createEditCommand(command_cell, '#Station/AdvertItemEdit?id=' + dataItem.Id);
                },
                pageIndexChanged: function (sender) {
                    sel_args.set_startRowIndex(sender.get_pageIndex() * sel_args.get_maximumRows());
                },
                allowPaging: true
            });
            dataSource.select(sel_args);
        }
    }
    exports.default = default_1;
});
// }

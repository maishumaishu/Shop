chitu.action(function (page) {
    /// <param name="page" type="chitu.Page"/>

    var sel_args = new JData.DataSourceSelectArguments();
    sel_args.set_maximumRows(10);

    var dataSource = new JData.WebDataSource();
    dataSource.set_selectUrl(site.config.siteUrl + 'MicroStationData/Select?source=News&selection=Id, Title, NewsCategory.Name as CategoryName, CreateDateTime');
    dataSource.set_deleteUrl(site.config.siteUrl + 'MicroStationData/Delete?source=News');
    dataSource.set_updateUrl(site.config.siteUrl + 'MicroStationData/Update?source=News');
    var select_url = dataSource.get_selectUrl();

    $('#tabNews').gridView({
        dataSource: dataSource,
        columns: [
            { dataField: 'Id', headerText: '编号', readOnly: true },
            { dataField: 'Title', headerText: '标题', itemStyle: { textAlign: 'left' } },
            { dataField: 'CategoryName', headerText: '类别', itemStyle: { width: '180px' } },
            { dataField: 'CreateDateTime', headerText: '创建时间', headerStyle: { width: '160px' }, dataFormatString: '{0:yy-mm-dd}' },
            { type: JData.CommandField, showDeleteButton: true, headerStyle: { width: '100px' } }
        ],
        allowPaging: true,
        rowCreated: function (sender, args) {
            if (args.row.get_rowType() != JData.DataControlRowType.DataRow)
                return;

            var cells = args.row.get_cells();
            var cmd_cell = cells[cells.length - 1];
            var url = String.format('#Station/NewsEdit/{0}', args.row.get_dataItem()['Id']);
            Site.createEditCommand(cmd_cell.get_element(), url);
        },
        pageIndexChanged: function (sender, args) {
            sel_args.set_maximumRows(10);
            sel_args.set_startRowIndex(10 * sender.get_pageIndex());
        }
    });

    var model = {
        search: function () {
            var arg = new JData.DataSourceSelectArguments();
            arg.set_startRowIndex(0);
            arg.set_maximumRows(10);
            if (model.searchText()) {
                dataSource.set_selectUrl(select_url + '&filter=' + encodeURI('Title like "' + model.searchText() + '"'));
            }
            else {
                dataSource.set_selectUrl(select_url);
            }
            dataSource.select(arg);
        },
        searchText: ko.observable()
    }
    ko.applyBindings(model, page.node());

    page.load.add(function () {
        dataSource.select(sel_args);
    });


});
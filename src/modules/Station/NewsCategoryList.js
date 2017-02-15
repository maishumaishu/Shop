chitu.action(['jquery.validate'], function (page) {
    /// <param name="page" type="chitu.Page"/>

    var dataSource = new JData.WebDataSource();

    dataSource.set_selectUrl(site.config.siteUrl + 'MicroStationData/Select?source=NewsCategories&selection=Id,ParentId,Name,Sort,CreateDateTime,Info');
    dataSource.set_updateUrl(site.config.siteUrl + 'MicroStationData/Update?source=NewsCategories');
    dataSource.set_insertUrl(site.config.siteUrl + 'MicroStationData/Insert?source=NewsCategories');
    dataSource.set_deleteUrl(site.config.siteUrl + 'MicroStationData/Delete?source=NewsCategories');

    var details_view = new JData.DetailsView($('<table>').appendTo(page.node())[0]);
    //details_view.set_caption('编辑');
    var $gridView = $("<table>").appendTo(page.node()).gridView({
        dataSource: dataSource,
        columns: [
            { dataField: 'Id', headerText: '编号', readOnly: true, width: '280px' },
            { dataField: "ParentId", headerText: '所属类别', visible: false },
            { dataField: "Name", headerText: '类别名称' },
            { dataField: "Sort", headerText: '次序' },
            { type: JData.DateTimeField, dataField: "CreateDateTime", headerText: '创建时间' },
            { type: JData.HtmlEditorField, dataField: "Info", headerText: '简介', visible: false },
            {
                type: JData.CommandField, headerText: '操作', width: "120px",
                showEditButton: true,
                showDeleteButton: true,
                showCancelButton: true
            }
        ],
        allowPaging: false,

        editor: $.extend(details_view, {
            _set_fields: details_view.set_fields,
            set_fields: function (fields) {
                for (var i = 1; i < fields.length; i++) {
                    var fieldName = fields[i].get_dataField == null ? '' : fields[i].get_dataField();
                    if (fieldName == 'Info')
                        fields[i].set_visible(true);

                    if (fieldName == 'CreateDateTime')
                        fields[i].set_visible(false);
                }
                this._set_fields(fields);
                //fields[1].get_controlStyle().set_width('35%');
                //fields[5].get_controlStyle().set_width('50px');
                //fields[7].get_controlStyle().set_width('35%');
            }
        })
    });
    $("#editor").validate({
        rules: {
            Name: { required: true },
            CreateDateTime: { required: true }
        },
        messages: {
            Name: { required: "请填写类别名称！" },
            CreateDateTime: { required: "请选择创建时间！" }
        }
    });
    $('#btnAdd').click(function () {
        $gridView.data('JData.GridView')._HandleNew();
    });

    var args = new JData.DataSourceSelectArguments();
    //args.set_maximumRows(10);
    dataSource.select(args);
});
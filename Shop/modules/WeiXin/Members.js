chitu.action(['sv/Member'], function (page) {
    /// <param name="page" type="chitu.Page"/>

    var $dlg_element = $(page.node()).find('[data-role="export"]');
    var $beginDate = $dlg_element.find('input[name="begin"]');
    var $endDate = $dlg_element.find('input[name="end"]');
    var $pyramid = $dlg_element.find('input[name="pyramid"]');

    //=======================================================
    // 事件
    function on_clearAccount(event) {
        var dataItem = $(event.target).parents('tr').first().data('dataItem');
        Site.confirm('确认注销', '确定要注销会员"' + dataItem.UserName + '"的账号吗？', function () {
            return service.account.removeAccount(dataItem.UserName).done(function () {
                bootbox.alert('移除账号成功');
            });
        });
    };
    //=======================================================

    var now = new Date();

    var dataSource = new JData.WebDataSource(site.config.weixinUrl + 'Member/GetWeiXinMembers');
    var $gridView = $('<table>').appendTo(page.node()).gridView({
        dataSource: dataSource,
        columns: [
            {
                dataField: 'NickName', headerText: '昵称'
            },
            { dataField: 'UserName', headerText: '用户名', width: '180px' },
            { dataField: 'Sex', headerText: '性别', width: '180px' },
            { dataField: 'Province', headerText: '省', width: '80px' },
            { dataField: 'City', headerText: '城市', width: '80px' },
            { type: JData.CheckBoxField, dataField: 'IsSubscribe', headerText: '关注', trueValue: '已关注', falseValue: '未关注' },
            { dataField: 'ParentName', headerText: '所属 P' },
            { dataField: 'ParentUserName', headerText: '所属 P' },
            { dataField: 'CreateDateTime', headerText: '创建时间', width: '150px', dataFormatString: '{0:G}' },
            { type: JData.Internal.DataControlField, itemStyle: { textAlign: 'left', width: '200px' } }
        ],
        rowCreated: function (sender, args) {
            if (args.row.get_rowType() != JData.DataControlRowType.DataRow)
                return;

            var row = args.row.get_element();
            var dataItem = args.row.get_dataItem();
            var command_cell = row.cells[row.cells.length - 1];

            var childrenCount = dataItem.ChildrenCount;
            if (dataItem.UserName != null && dataItem.ParentName != null)
                Site.createCommand(command_cell, 'javascript:', '注销').click(on_clearAccount);

            Site.createCommand(command_cell, '#Shopping/MemberOrders/' + dataItem.UserName, '订单');
            Site.createCommand(command_cell, '#WeiXin/ChildMembers/' + dataItem.OpenId, '子会员(' + childrenCount + ')');

        },
        allowPaging: true
    });

    var gridView = $gridView.data('JData.GridView');
    var sel_args = gridView._getSelectArgument();


    var model = {
        beginDate: ko.observable($.datepicker.formatDate('yy-mm-dd', new Date(now.getFullYear(), now.getMonth(), 1))),
        endDate: ko.observable($.datepicker.formatDate('yy-mm-dd', new Date(now.getFullYear(), now.getMonth() + 1, 0))),
        pyramid: ko.observable(''),
        exportUrl: ko.observable(),
        searchText: ko.observable(),
        members: ko.observableArray(),
        search: function () {
            var filter = chitu.Utility.format('UserName="{0}"', model.searchText());

            if (model.searchText())
                sel_args.set_filter(filter);
            else
                sel_args.set_filter(null);

            sel_args.set_startRowIndex(0);
            //(new JData.DataSourceSelectArguments()).set_startRowIndex(0);
            dataSource.select(sel_args);
        },
        exportData: function (sender, event) {
            $dlg_element.dialog('open');
        }
    };
    //model.exportUrl = ko.computed(function () {
    //    var url = site.config.weixinUrl + 'Member/ExportWeiXinMembers?begin=' + this.beginDate() + '&end=' + this.endDate() + '&pyramid=' + this.pyramid();

    //    return url;
    //}, model);

    ko.applyBindings(model, page.node());

    //var url_pattern = '/Member/ExportWeiXinMembers?begin={0}&end={1}';

    //$dlg_element
    //    .dialog({
    //        title: String.format("<div class='widget-header widget-header-small' style='padding-top:6px;'><h5>{0}</h5></div>", '订单导出'),
    //        title_html: true,
    //        width: '380px',
    //        autoOpen: false,
    //        position: {
    //            my: 'right top',
    //            at: 'right bottom',
    //            of: $(page.node()).find('[data-role="exprot_button"]')
    //        }
    //    })
    //    .find('input[name="begin"], input[name="end"]').datepicker({
    //        showOn: "click"
    //    });



    //$(page.node()).find('form').submit(function () {
    //    var url = '/Member/ExportWeiXinMembers?begin=' + $beginDate.val() + '&end=' + $endDate.val() + '&pyramid=' + $pyramid.val();
    //    model.exportUrl(url);
    //    return true;
    //});

    page.load.add(function () {
        dataSource.select(sel_args);
    });
})
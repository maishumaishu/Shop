chitu.action(['bootbox', 'sv/Member'], function (page) {
    /// <param name="page" type="chitu.Page"/>

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

    var data = page.context().routeData().values();
    var dataSource = new JData.WebDataSource(site.config.weixinUrl + 'Member/GetChildMembers?parentOpenId=' + data.id);
    $('<table>').appendTo(page.node()).gridView({
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
            { type: JData.DateTimeField, dataField: 'CreateDateTime', headerText: '创建时间', width: '120px', dataFormatString: '{0:yy-mm-dd}' },
            { type: JData.CommandField, width: '120px' }
        ],
        rowCreated: function (sender, args) {
            if (args.row.get_rowType() != JData.DataControlRowType.DataRow)
                return;

            var row = args.row.get_element();
            var dataItem = args.row.get_dataItem();
            var command_cell = row.cells[row.cells.length - 1];

            if (dataItem.UserName)
                Site.createCommand(command_cell, 'javascript:', '注销').click(on_clearAccount);

            Site.createCommand(command_cell, '/ShouTao/MemberOrders?username=' + dataItem.UserName, '订单');
        },
        allowPaging: true
    });

    var model = {
        searchText: ko.observable(),
        members: ko.observableArray(),
        search: function () {
            if (this.searchText())
                dataSource.filter('UserName="' + this.searchText() + '"');
            else
                dataSource.filter(null);
        }
    }

    page.load.add(function (sender, args) {
        var url = site.config.weixinUrl+ 'Member/GetChildMembers?parentOpenId=' + args.id;
        dataSource.set_selectUrl(url);
        var arg = new JData.DataSourceSelectArguments();
        arg.set_startRowIndex(0);
        arg.set_maximumRows(10);
        dataSource.set_selectUrl(url);
        dataSource.select(arg);
    });



    ko.applyBindings(model, page.node());
});
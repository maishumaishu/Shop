chitu.action(['sv/Member', 'sv/Shopping', 'knockout.validation'], function (page) {
    /// <param name="page" type="chitu.Page"/>
    var dataSource = services.operator.dataSource();
    var $gridView = $('<table>').appendTo(page.node()).gridView({
        dataSource: dataSource,
        columns: [
            { dataField: 'Mobile', headerText: '手机' },
            { dataField: 'Email', headerText: '邮箱' },
            { dataField: 'NickName', headerText: '昵称' },
            { dataField: 'Province', headerText: '省' },
            { dataField: 'City', headerText: '市' },
            { dataField: 'Gender', headerText: '性别' },
            { type: JData.CommandField, headerText: '操作', showDeleteButton: true }
        ],
        allowPaging: true,

    });



    var model = {
        userInfo: {
            UserId: ko.observable().extend({ required: true }),
            OutletId: ko.observable().extend({ required: true }),
            NickName: ko.observable(),
            Mobile: ko.observable(),
            HeadImageUrl: ko.observable()
        },
        searchText: ko.observable(),
        search: function () {
            var args = new JData.DataSourceSelectArguments();
            if (model.searchText()) {
                args.set_filter('Mobile="' + model.searchText() + '"');
            }
            else {
                args = sel_args;
            }

            return dataSource.select(args);
        },
        add: function () {
            $(page.node()).find('[name="dlg_opeator"]').modal();
        },
        confirm: function () {
            var obj = { UserId: model.userInfo.UserId, OuteletId: model.userInfo.OutletId };
            var val = ko.validation.group(obj);
            if (!obj.isValid())
                return val.showAllMessages();

            return services.userInfo.get(model.userInfo.UserId()).done(function (data) {
                ko.mapping.fromJS(data, {}, model.userInfo);
                $(page.node()).find('[name="dlg_opeator"]').modal('hide');
                $(page.node()).find('[name="dlg_userInfo"]').modal();
            })
        },
        create: function () {
            return services.operator.create(model.userInfo.UserId(), model.userInfo.OutletId()).done(function () {
                $(page.node()).find('[name="dlg_userInfo"]').modal('hide');
                sel_args.set_startRowIndex(0);
                dataSource.select(sel_args);
            });
        },
        outlets: ko.observableArray()

    };

    ko.applyBindings(model, page.node());

    var gridView = $gridView.data('JData.GridView');
    var sel_args = gridView.get_selectArguments();
    page.load.add(function () {
        dataSource.select(sel_args);

        var outletDataSource = services.outlet.dataSource();
        var args = new JData.DataSourceSelectArguments();
        outletDataSource.select(args).done(function (data) {
            data.unshift({ Name: '请选择门店' });
            model.outlets(data);
        });

    });
});
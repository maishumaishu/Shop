chitu.action(['sv/Shopping'], function (page) {
    /// <param name="page" type="chitu.Page"/>

    var dataSource = services.outlet.dataSource();
    var $gridView = $('<table>').appendTo(page.node()).gridView({
        dataSource: dataSource,
        columns: [
            { dataField: 'Id', visible: false, primaryKey: true },
            { dataField: 'Name', headerText: '名称' },
            { dataField: 'Address', headerText: '地址' },
            { dataField: 'CreateDateTime', headerText: '创建时间', dataFormatString: '{0:d}' },
            { type: JData.CommandField, headerText: '操作', showDeleteButton: true }
        ],
        rowCreated: function (sender, args) {
            if (args.row.get_rowType() != JData.DataControlRowType.DataRow)
                return;

            var row = args.row.get_element();
            var command_cell = row.cells[row.cells.length - 1];
            var $btn = site.createEditCommand(command_cell, 'javascript:');
            $btn.click(function (event) {
                var tr = $(event.target).parents('tr').first();
                var dataItem = $(tr).data('dataItem');
                ko.mapping.fromJS(dataItem, {}, model.outlet);
                model.dataItem = dataItem;
                model.showOutet();
            });
        }
    });

    var model = {
        dataItem: null,
        outlet: {
            Id: ko.observable(),
            Name: ko.observable(),
            Address: ko.observable()
        },
        showOutet: function () {
            $(page.node()).find('[name="dlg_outlet"]').modal();
        },
        addOutlet: function () {
            //for (var key in model.outlet)
            //    model.outlet[key]('');
            model.outlet.Id('');
            model.outlet.Name('');
            model.outlet.Address('');

            model.showOutet();
        },
        confirmOutlet: function () {
            var deferred;
            if (model.outlet.Id()) {
                $.extend(model.dataItem, ko.mapping.toJS(model.outlet));
                deferred = dataSource.update(model.dataItem);
            }
            else
                deferred = dataSource.insert(ko.mapping.toJS(model.outlet));

            return deferred.done(function () {
                $(page.node()).find('[name="dlg_outlet"]').modal('hide');
            });
        }
    };

    ko.applyBindings(model, page.node());

    page.load.add(function () {
        var gridView = $gridView.data('JData.GridView');
        var sel_args = gridView.get_selectArguments();
        dataSource.select(sel_args);
    });

    //var viewModel = {
    //    outlets: ko.observableArray([]),
    //    showSquareCode: function (entiy, event) {
    //        $('#dlgSquareCode').dialog({
    //            title: '门店二维码',
    //            width: 460,
    //            height: 480,
    //            position: {
    //                of: window,
    //                my: 'center center',
    //                at: 'center center'
    //            },
    //            open: function () {
    //                $(this).find('img').attr('src', entiy.SquareCodeUrl);
    //            }
    //        });
    //    },
    //    editItem: function (entiy, event) {
    //        location.href = site.config.shopUrl + 'Outlet/OutletEdit?Id=' + entiy.Id;
    //    },
    //    deleteItem: function (entity, event) {
    //        Site.confirm('删除', '确定删除吗？', function () {
    //            $.ajax({
    //                url: site.config.shopUrl + 'ShoppingData/Delete?source=Outlets',
    //                type: 'post',
    //                data: {
    //                    Id: entity.Id
    //                },
    //                success: function () {
    //                    viewModel.outlets.remove(entity);
    //                }
    //            });
    //        });
    //    }
    //};

    //ko.applyBindings(viewModel, page.node());
    //debugger;
    //var dataSource = new JData.WebDataSource();
    //dataSource.set_selectUrl(site.config.shopUrl + 'ShoppingData/Select?source=Outlets&selection=Id,Name,Contact,Phone,ImageUrl,SquareCodeUrl,DetailAddress');
    //dataSource.add_selected(function (sender, args) {
    //    $(args.items).each(function () {
    //        //this.SquareCodeUrl = null;
    //        if (this.ImageUrl == null || this.ImageUrl == '')
    //            this.ImageUrl = '/assets/images/tupian.gif';

    //        viewModel.outlets.push(this);
    //    });
    //});

    //$('#pagingBar').pagingBar({
    //    dataSource: dataSource,
    //    autoSelect: true
    //});



});




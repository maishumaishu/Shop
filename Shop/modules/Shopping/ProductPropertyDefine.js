chitu.action(["knockout.validation"], function (page) {
    /// <param name="page" type="chitu.Page"/>

    //var dataSource = new JData.WebDataSource();
    //dataSource.set_method('post');
    //dataSource.set_selectUrl(site.config.shopUrl + 'ShoppingData/Select?source=ProductPropertyDefines&selection=Id,Name,CreateDateTime');
    //dataSource.set_insertUrl(site.config.shopUrl + 'ShoppingData/Insert?source=ProductPropertyDefines');
    //dataSource.set_updateUrl(site.config.shopUrl + 'ShoppingData/Update?source=ProductPropertyDefines');
    //dataSource.set_deleteUrl(site.config.shopUrl + 'ShoppingData/Delete?source=ProductPropertyDefines');

    var $dialog = $(page.node()).find('[name="dlg_item"]');
    var $dlg_config = $(page.node()).find('[name="dlg_config"]');

    //var $gridView = $('<table>').appendTo(page.node()).gridView({
    //    dataSource: dataSource,
    //    columns: [
    //        { dataField: 'Id', headerText: '编号', itemStyle: { width: '320px' } },
    //        { dataField: 'Name', headerText: '名称' },
    //        { dataField: 'CreateDateTime', headerText: '创建时间', dataFormatString: '{0:g}', itemStyle: { width: '160px' } },
    //        { type: JData.CommandField, headerText: '操作', showDeleteButton: true, itemStyle: { width: '160px' } }
    //    ],
    //    allowPaging: true,
    //    rowCreated: function (sender, args) {
    //        if (args.row.get_rowType() != JData.DataControlRowType.DataRow)
    //            return;

    //        var row = args.row.get_element();
    //        var command_cell = row.cells[row.cells.length - 1];
    //        var $btn = site.createEditCommand(command_cell, 'javascript:');
    //        $btn.click(function (event) {
    //            var tr = $(event.target).parents('tr').first();
    //            var dataItem = $(tr).data('dataItem');
    //            ko.mapping.fromJS(dataItem, {}, model.item);
    //            $dialog.modal();
    //            $dialog.data('dataItem', dataItem);
    //        });

    //        var $btn_config = site.createCommand(command_cell, 'javascript:', '<i class="icon-cog"></i>');
    //        $btn_config.click(function (event) {
    //            $dlg_config.modal();
    //        });

    //    }
    //});
    $.ajax({
        url: site.config.shopUrl + 'ShoppingData/Select?source=ProductPropertyDefines&selection=Id,Name,CreateDateTime, \
                                    PropertyName1,PropertyOption1,PropertyName2,PropertyOption2,PropertyName3,PropertyOption3, \
                                    PropertyName4,PropertyOption4,PropertyName5,PropertyOption5,PropertyName6,PropertyOption6'
    })
    .done(function (data) {
        //model.items(data.DataItems);
        //debugger;
        for (var j = 0; j < data.DataItems.length; j++) {
            var dataItem = data.DataItems[j];

            var d = new PropertyDefine();
            d.Id(dataItem.Id);
            d.Name(dataItem.Name);

            var option_text = '';
            for (var i = 1; i <= 6; i++) {
                if (dataItem['PropertyName' + i]) {
                    var option = new PropertyDefineOption();
                    option.Name(dataItem['PropertyName' + i]);
                    option.Value(dataItem['PropertyOption' + i])

                    if (i == 1)
                        option_text = dataItem['PropertyName' + i] + ':' + dataItem['PropertyOption' + i];
                    else
                        option_text = option_text + '&nbsp;|&nbsp;' + dataItem['PropertyName' + i] + ':' + dataItem['PropertyOption' + i];
                }
            }

            d.OptionsText(option_text);
            model.items.push(d);
        }
    });

    //page.load.add(function () {
    //    page.load.add(function () {
    //        var gridView = $gridView.data('JData.GridView');
    //        var sel_args = gridView.get_selectArguments();
    //        dataSource.select(sel_args);
    //    });
    //});

    function PropertyDefineOption() {
        this.Name = ko.observable();
        this.Value = ko.observable();
    }

    function PropertyDefine() {
        this.Id = ko.observable();
        this.Name = ko.observable();
        this.Options = ko.observableArray();
        this.OptionsText = ko.observable();
    }

    var model = {
        item: {
            Id: ko.observable(),
            Name: ko.observable().extend({ required: true })
        },
        items: ko.observableArray(),
        add: function () {
            model.item.Id('');
            model.item.Name('');
            val.showAllMessages(false);
            $dialog.removeData('dataItem');
            $(page.node()).find('[name="dlg_item"]').modal();
        },
        save: function () {
            if (!model.item.isValid()) {
                val.showAllMessages();
                return;
            }

            if (!$dialog.data('dataItem')) {
                services.shopping.productPropertyDefines.insert({ Id: model.item.Id(), Name: model.item.Name() }).done(function () {
                    $dialog.modal('hide');
                });
            }
            else {
                var dataItem = $dialog.data('dataItem');
                ko.mapping.fromJS(ko.mapping.toJS(model.item), {}, dataItem);
                services.shopping.productPropertyDefines.update(dataItem).done(function () {
                    $dialog.modal('hide');
                });
            }
        }
    }

    ko.applyBindings(model, page.node());
    var val = ko.validation.group(model.item);
});
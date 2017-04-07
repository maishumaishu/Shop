// chitu.action(['jquery.validate', 'jquery.fileupload'], function (page) {
//     /// <param name="page" type="chitu.Page"/>

// });

import site = require('Site');


let JData = window['JData'];

class PageModel {
    dataItem: any;
    private $gridView: any;
    private $dlg_edit: any;
    private dataSource: any;

    constructor($gridView, $dlg_edit, dataSource) {
        this.$gridView = $gridView;
        this.$dlg_edit = $dlg_edit;
        this.dataSource = dataSource;
    }
    add(model: PageModel) {
        model.$gridView.data('JData.GridView')._HandleNew();
    }
    save(model: PageModel) {
        if (!model.$dlg_edit.valid()) {
            return;
        }

        var dataItem = model.dataItem || {};
        model.$dlg_edit.find('input, select').each(function () {
            dataItem[$(this).attr('name')] = $(this).val();
        });
        dataItem.Hidden = model.$dlg_edit.find('input[name="Hidden"]')[0].checked;

        var deferred;
        if (dataItem.Id) {
            deferred = model.dataSource.update(dataItem);
        }
        else {
            deferred = model.dataSource.insert(dataItem);
        }

        return deferred.done(function () {
            model.$dlg_edit.modal('hide');
        });
    }

}

class ProductCategoryListPage extends chitu.Page {
    constructor(params) {
        super(params);

        this.load.add(this.page_load);
    }

    private page_load(page: chitu.Page, args: any) {
        var dataSource = new JData.WebDataSource();
        dataSource.set_method('post');
        dataSource.set_selectUrl(site.config.shopUrl + 'ShoppingData/Select?source=ProductCategories&selection=Id,Name,ParentId,SortNumber,Remark,Hidden,ImagePath');
        dataSource.set_insertUrl(site.config.shopUrl + 'ShoppingData/Insert?source=ProductCategories');
        dataSource.set_deleteUrl(site.config.shopUrl + 'ShoppingData/Delete?source=ProductCategories');
        dataSource.set_updateUrl(site.config.shopUrl + 'ShoppingData/Update?source=ProductCategories');

        var validator: any;
        var $dlg_edit = $(page.element).find('[name="dlg_edit"]');
        var $gridView = (<any>$('<table>').appendTo(page.element)).gridView({
            dataSource: dataSource,
            columns: [
                { dataField: 'SortNumber', headerText: '序号', width: '80px', sortExpression: 'SortNumber' },
                { dataField: 'Name', headerText: '名称', sortExpression: 'Name' },
                { dataField: 'Remark', headerText: '备注', sortExpression: 'Remark' },
                { dataField: 'Hidden', headerText: '隐藏', sortExpression: 'Hidden' },
                { dataField: 'ImagePath', headerText: '图片', sortExpression: 'ImagePath', itemStyle: { width: '280px' } },
                { type: JData.CommandField, showEditButton: true, showDeleteButton: true, itemStyle: { width: '120px' } }
            ],
            _HandleNew: function () {
                validator.resetForm();
                (<any>$dlg_edit).modal().find('input').val('');
                model.dataItem = null;
            },
            _HandleEdit: function (row) {
                validator.resetForm();
                (<any>$dlg_edit).modal().find('input').val('');
                var dataItem = row.get_dataItem();
                (<any>$(page.element).find('[name="dlg_edit"]')).modal();
                $dlg_edit.find('input, select').each(function () {
                    $(this).val(dataItem[$(this).attr('name')]);
                });

                if (dataItem.Hidden) {
                    $dlg_edit.find('input[Name="Hidden"]').attr('checked', 'checked');
                }
                else {
                    $dlg_edit.find('input[Name="Hidden"]').removeAttr('checked');
                }
                model.dataItem = dataItem;
            }
        });

        requirejs(['jquery.fileupload'], function () {
            (<any>$(page.element).find('[name="ImageUpload"]')).fileupload({
                url: site.config.shopUrl + 'Common/UploadImage?dir=Shopping',
                dataType: 'json'
            }).on('fileuploaddone', function (e, data) {
                $(page.element).find('[name="ImagePath"]').val(data.result.path);
            }).on('fileuploadfail', function (error) {
                site.showInfo('上传图片失败');
            });
        });

        requirejs(['jquery.validate'], function () {
            validator = (<any>$dlg_edit).validate({
                rules: {
                    Name: {
                        required: true
                    },
                    SortNumber: {
                        required: true
                    }
                }
            });
        });


        var args = $gridView.data('JData.GridView').get_selectArguments();
        args.set_sortExpression('SortNumber asc');
        dataSource.select(args);

        var model = new PageModel($gridView, $dlg_edit, dataSource);
        ko.applyBindings(model, page.element);
    }
}

export = ProductCategoryListPage;
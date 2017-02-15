import site = require('Site');

let JData = window['JData'];

class BrandListPage extends chitu.Page {
    constructor(params) {
        super(params);

        this.load.add(this.page_load);
    }

    private page_load(page: BrandListPage, args: any) {
        var dataSource = new JData.WebDataSource();
        dataSource.set_method('post');
        var baseUrl = site.config.shopUrl + 'ShoppingData/';
        dataSource.set_selectUrl(baseUrl + 'Select?source=Brands&selection=Id,Name,Image,Recommend');
        dataSource.set_deleteUrl(baseUrl + 'Delete?source=Brands');
        dataSource.set_updateUrl(baseUrl + 'Update?source=Brands');

        var recommendFiled = {
            dataField: 'Recommend',
            headerText: '首页推荐',
            itemStyle: { width: '60px', textAlign: 'center' },
            setButton: function (button) {
                var dataItem = $(button).parents('tr').data('dataItem');
                var recommend = dataItem.Recommend;
                if (recommend) {
                    $(button).html('已推荐').attr('class', 'btn btn-primary btn-minier');
                }
                else {
                    $(button).html('未推荐').attr('class', 'btn btn-default btn-minier');
                }
            },
            displayValue: function (container, value) {
                var $btn = $('<button>').appendTo(container).data('recommend', value)
                    .click(function () {
                        var dataItem = $(this).parents('tr').data('dataItem');
                        dataItem.Recommend = !dataItem.Recommend;
                        recommendFiled.setButton(this);
                        dataSource.executeUpdate(dataItem);
                    });
                recommendFiled.setButton($btn[0]);
            }
        }

        var shoutRecommendFiled = {
            dataField: 'Recommend',
            headerText: '手淘推荐',
            itemStyle: { width: '60px', textAlign: 'center' },
            setButton: function (button) {
                var dataItem = $(button).parents('tr').data('dataItem');
                var recommend = dataItem.ShouTaoRecommend;
                if (recommend) {
                    $(button).html('已推荐').attr('class', 'btn btn-primary btn-minier');
                }
                else {
                    $(button).html('未推荐').attr('class', 'btn btn-default btn-minier');
                }
            },
            displayValue: function (container, value) {
                var $btn = $('<button>').appendTo(container)
                    .click(function () {
                        var dataItem = $(this).parents('tr').data('dataItem');
                        dataItem.ShouTaoRecommend = !dataItem.ShouTaoRecommend;
                        shoutRecommendFiled.setButton(this);
                        dataSource.executeUpdate(dataItem);
                    });
                shoutRecommendFiled.setButton($btn[0]);
            }
        }

        var $gridView = (<any>$('<table>').appendTo(page.element)).gridView({
            dataSource: dataSource,
            columns: [
                { dataField: 'Name', headerText: '名称', itemStyle: { width: '200px' }, sortExpression: 'Name' },
                { dataField: 'Image', headerText: '图片', width: '300px' },
                //{ dataField: 'Introduce', headerText: '介绍' }, 
                recommendFiled,
                shoutRecommendFiled,
                { type: JData.CommandField, showInsertButton: false, showDeleteButton: true, showCancelButton: true, itemStyle: { width: '120px' } }
            ],
            rowCreated: function (sender, args) {
                if (args.row.get_rowType() != JData.DataControlRowType.DataRow)
                    return;

                var row = args.row.get_element();
                var dataItem = args.row.get_dataItem();
                var command_cell = row.cells[row.cells.length - 1];
                site.createEditCommand(command_cell, '#Shopping/BrandEdit?id=' + dataItem.Id);
            },
            allowPaging: true,
            pageIndexChanged: function (sender) {
                sel_args.set_startRowIndex(sel_args.get_maximumRows() * sender.get_pageIndex());
            }
        });

        var gridView = $gridView.data('JData.GridView');
        var sel_args = gridView._getSelectArgument(); //new JData.DataSourceSelectArguments();

        page.load.add(function () {
            dataSource.select(sel_args);
        });
    }
}

export = BrandListPage;
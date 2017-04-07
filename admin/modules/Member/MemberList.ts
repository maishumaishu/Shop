// chitu.action(['sv/Member', 'ko.val'], function (page) {
//     /// <param name="page" type="chitu.Page"/>

// });

import memberService = require('services/Member');
import validation = require('knockout.validation');

let JData = window['JData'];

export default function (page: chitu.Page) {
    requirejs([`text!${page.routeData.actionPath}.html`], (html) => {
        page.element.innerHTML = html;
        page_load(page, page.routeData.values);
    })
}

function page_load(page: chitu.Page, args: any) {
    var dataSource = memberService.member.dataSource();
    var $gridView = (<any>$('<table>').appendTo(page.element)).gridView({
        dataSource: dataSource,
        columns: [
            { dataField: 'Id', headerText: '编号', itemStyle: { width: '280px' } },
            { dataField: 'Mobile', headerText: '手机', itemStyle: { width: '180px' } },
            //{ dataField: 'Email', headerText: '邮箱' },
            { dataField: 'NickName', headerText: '昵称' },
            {
                dataField: 'Gender', headerText: '性别',
                displayValue: function (container, value) {
                    //var text = value == 'Female' ? '女' : (value == 'Male' ? '男' : (value=='N/A'));
                    var text;
                    switch (value) {
                        case 'Female':
                            text = '女';
                            break;
                        case 'Male':
                            text = '男';
                            break;
                        case 'None':
                            text = 'N/A';
                            break
                        default:
                            text = '';
                            break;
                    }
                    $('<span>').text(text).appendTo($(container));
                }
            },
            { dataField: 'Province', headerText: '省' },
            { dataField: 'City', headerText: '市' },
            { dataField: 'Balance', headerText: '金额', dataFormatString: '￥{0:C2}', itemStyle: { textAlign: 'right' } }
            //, { type: JData.CommandField, headerText: '操作' }
        ],
        allowPaging: true,
    });

    var gridView = $gridView.data('JData.GridView');
    var sel_args = gridView.get_selectArguments();
    // page.load.add(function () {
    gridView.get_dataSource().select(sel_args);
    // });

    var model = {
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
        rechargeInfo: {
            memberId: ko.observable<string>(),
            amount: ko.observable<number>().extend({ required: true }),
            password: ko.observable<string>().extend({ required: true })
        },
        starRecharge: function () {
            (<any>$(page.element).find('[name="dlg_recharge"]')).modal();
        },
        confirmRecharge: function () {
            if (!(<any>model.rechargeInfo).isValid()) {
                val.showAllMessages();
                return;
            }
            var r = model.rechargeInfo;
            return memberService.account.recharge(r.memberId(), r.amount(), r.password()).done(function () {
                (<any>$(page.element).find('[name="dlg_recharge"]')).modal('hide');
            });
        }
    }

    var val = validation.group(model.rechargeInfo);

    ko.applyBindings(model, page.element);
}

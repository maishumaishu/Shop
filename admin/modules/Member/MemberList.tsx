import { default as memberService, UserInfo } from 'services/Member';
import * as ui from 'UI';

import FormValidator = require('common/formValidator');

export default function (page: chitu.Page) {
    let account = page
    class MemberListPage extends React.Component<{}, {}>{
        private membersTable: HTMLTableElement;
        private rechargeDialogElement: HTMLElement;
        private validator: FormValidator;

        private userIdInputElement: HTMLInputElement;
        private amountInputElement: HTMLInputElement;

        showRechargeDialog(userId: string) {
            this.userIdInputElement.value = userId;
            $(this.rechargeDialogElement).modal();
        }
        recharge() {
            if (!this.validator.validateForm())
                return;

            let userId = this.userIdInputElement.value;
            let amount = Number.parseFloat(this.amountInputElement.value);
            return memberService.recharge(userId, amount);
        }
        componentDidMount() {
            let self = this;
            let dataSource = new wuzhui.WebDataSource({ select: (args) => memberService.members(args) })
            let gridView = ui.appendGridView(page.element, {
                dataSource,
                columns: [
                    new ui.BoundField({ dataField: 'Id', headerText: '编号' }),
                    new ui.BoundField({ dataField: 'Mobile', headerText: '手机' }),
                    new ui.BoundField({ dataField: 'NickName', headerText: '昵称' }),
                    new ui.CustomField({
                        headerText: '性别', createItemCell(dataItem: UserInfo) {
                            let cell = new wuzhui.GridViewCell();
                            cell.element.innerText = dataItem.Gender == 'Male' ? '男' : '女';
                            return cell;
                        },
                        itemStyle: { textAlign: 'center' } as CSSStyleDeclaration
                    }),
                    new ui.BoundField({
                        dataField: 'Balance', headerText: '余额',
                        itemStyle: { textAlign: 'right' } as CSSStyleDeclaration,
                        dataFormatString: '￥{0:C2}'
                    }),
                    new ui.CustomField({
                        headerText: '操作',
                        itemStyle: { textAlign: 'center', width: '120px' } as CSSStyleDeclaration,
                        createItemCell(dataItem: UserInfo) {
                            let cell = new wuzhui.GridViewCell();
                            ReactDOM.render(
                                <div>
                                    <button className="btn btn-primary btn-minier"
                                        onClick={() => self.showRechargeDialog(dataItem.UserId)}>充值</button>
                                    <a className="btn btn-primary btn-minier" style={{ marginLeft: 4 }}>充值记录</a>
                                </div>,
                                cell.element);

                            return cell;
                        }
                    })
                ],
                pageSize: 10
            });

            this.validator = new FormValidator(this.rechargeDialogElement, {
                // account: { rules: ['required'], display: '账户' },
                amount: { rules: ['required', 'decimal', 'amount_greater_zero'], display: '余额' }
            });
            this.validator.messages['amount_greater_zero'] = '金额必须大于 0';
            this.validator.hooks['amount_greater_zero'] = function (field) {
                let amount = Number.parseFloat(field.value);
                return amount > 0;
            }
        }
        render() {
            return (
                <div>
                    <table ref={(e: HTMLTableElement) => this.membersTable = e || this.membersTable}>
                    </table>
                    <div className="modal fade" ref={(e: HTMLElement) => this.rechargeDialogElement = e || this.rechargeDialogElement}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal">
                                        <span aria-hidden="true">&times;</span><span className="sr-only">Close</span>
                                    </button>
                                    <h4 className="modal-title">充值</h4>
                                </div>
                                <div className="modal-body form-horizontal">
                                    <div className="form-group">
                                        <label className="col-sm-2">账户</label>
                                        <div className="col-sm-10">
                                            <input name="userId" className="form-control" placeholder="请输入要充值的账户"
                                                ref={(e: HTMLInputElement) => this.userIdInputElement = e || this.userIdInputElement} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-sm-2">金额</label>
                                        <div className="col-sm-10">
                                            <input name="amount" className="form-control" placeholder="请输入要充值的金额"
                                                ref={(e: HTMLInputElement) => this.amountInputElement = e || this.amountInputElement} />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-primary"
                                        onClick={() => $(this.rechargeDialogElement).modal('hide')}>取消</button>
                                    <button className="btn btn-primary"
                                        ref={(e: HTMLButtonElement) => {
                                            if (!e) return;
                                            e.onclick = ui.buttonOnClick(() => this.recharge());
                                        }}>确定</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }

    ReactDOM.render(<MemberListPage />, page.element);
}



/*function page_load(page: chitu.Page, args: any) {
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
}*/

import { default as memberService } from 'adminServices/user';
import * as wz from 'myWuZhui';
import FormValidator from 'formValidator';
import { userInfo } from 'userServices/memberService';

export default function (page: chitu.Page) {
    page.element.className = 'admin-pc';
    let account = page
    class MemberListPage extends React.Component<{}, {}>{
        private membersTable: HTMLTableElement;
        private rechargeDialogElement: HTMLElement;
        private validator: FormValidator;

        // private userAccountInput: HTMLInputElement;
        // private amountInputElement: HTMLInputElement;
        private dataSource = new wuzhui.WebDataSource({ select: (args) => memberService.members(args) });
        // private editMemeber: UserInfo;

        showRechargeDialog(account: string, callback?: ((amount: number) => void)) {
            // this.userAccountInput.value = user.Mobile;
            // this.editMemeber = user;

            let userAccountInput: HTMLInputElement;
            let amountInput: HTMLInputElement;
            React.render(
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
                                        readOnly={true}
                                        ref={(e: HTMLInputElement) => userAccountInput = e || userAccountInput} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-sm-2">金额</label>
                                <div className="col-sm-10">
                                    <input name="amount" className="form-control" placeholder="请输入要充值的金额"
                                        ref={(e: HTMLInputElement) => amountInput = e || amountInput} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary"
                                onClick={() => ui.hideDialog(this.rechargeDialogElement)}>取消</button>
                            <button className="btn btn-primary"
                                ref={(e: HTMLButtonElement) => {
                                    if (!e) return;

                                    e.onclick = ui.buttonOnClick(async () => {
                                        // this.recharge().then((o) => {
                                        // ui.alert({ title: '充值', message: '充值成功！' });
                                        // ui.hideDialog(this.rechargeDialogElement);
                                        // console.assert(this.editMemeber != null);
                                        // this.editMemeber.Balance = o.Balance;
                                        // this.dataSource.updated.fire(this.dataSource, { item: this.editMemeber });
                                        // })
                                        let data = await memberService.recharge(account, new Number(amountInput.value).valueOf());
                                        callback(data.Balance);
                                    });
                                }}>确定</button>
                        </div>
                    </div>
                </div>, this.rechargeDialogElement,
                () => {

                });

            ui.showDialog(this.rechargeDialogElement);
        }
        // recharge() {
        //     if (!this.validator.validateForm())
        //         return;

        //     let userId = this.userAccountInput.value;
        //     let amount = Number.parseFloat(this.amountInputElement.value);
        //     return memberService.recharge(userId, amount);
        // }
        componentDidMount() {
            let self = this;
            let gridView = wz.appendGridView(page.element, {
                dataSource: self.dataSource,
                columns: [
                    // new wz.BoundField({ dataField: 'Id', headerText: '编号' }),
                    new wz.BoundField({ dataField: 'Mobile', headerText: '手机' }),
                    new wz.BoundField({ dataField: 'NickName', headerText: '昵称' }),
                    new wz.CustomField({
                        headerText: '性别', createItemCell(dataItem: UserInfo) {
                            let cell = new wuzhui.GridViewCell();
                            cell.element.innerText =
                                dataItem.Gender == 'Male' ? '男' :
                                    dataItem.Gender == "Female" ? '女' : "";

                            return cell;
                        },
                        itemStyle: { textAlign: 'center' } as CSSStyleDeclaration
                    }),
                    new wz.BoundField({
                        dataField: 'Balance', headerText: '余额',
                        itemStyle: { textAlign: 'right' } as CSSStyleDeclaration,
                        dataFormatString: '￥{0:C2}'
                    }),
                    new wz.CustomField({
                        headerText: '操作',
                        itemStyle: { textAlign: 'center', width: '180px' } as CSSStyleDeclaration,
                        createItemCell(dataItem: UserInfo) {
                            let cell = new wuzhui.GridViewCell();
                            ReactDOM.render(
                                <div>
                                    <button className="btn btn-success btn-minier" style={{ marginLeft: 4 }}>
                                        <i className="icon-reorder" />
                                        <span>充值记录</span>
                                    </button>
                                    <button className="btn btn-info btn-minier"
                                        onClick={() => self.showRechargeDialog(dataItem.Id)}>
                                        <i className="icon-money" />
                                        <span>充值</span>
                                    </button>
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
                    <div name="tabs" className="tabbable">
                        <ul className="nav nav-tabs">
                            <li className="pull-right">
                                <button onClick={() => { }} className="btn btn-primary btn-sm">
                                    <i className="icon-money" />
                                    <span>充值</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                    <table ref={(e: HTMLTableElement) => this.membersTable = e || this.membersTable}>
                    </table>
                    <div className="modal fade" ref={(e: HTMLElement) => this.rechargeDialogElement = e || this.rechargeDialogElement}>

                    </div>
                </div>
            );
        }
    }

    ReactDOM.render(<MemberListPage />, page.element);
}



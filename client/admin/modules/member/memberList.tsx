import { UserService } from 'services/user';
import * as wz from 'myWuZhui';
import { FormValidator, rules } from 'dilu';
import { userInfo } from 'userServices/memberService';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

export default function (page: chitu.Page) {
    let memberService = page.createService(UserService);
    let account = page
    class MemberListPage extends React.Component<{}, {}>{
        private amountInput: HTMLInputElement;
        private accountInput: HTMLInputElement;
        private membersTable: HTMLTableElement;
        private rechargeDialogElement: HTMLElement;
        private validator: FormValidator;
        private mobileElement: HTMLElement;
        private dataSource = new wuzhui.DataSource({ select: (args) => memberService.members(args) });
        private selectedUserInfo: UserInfo;

        showRechargeDialog(userInfo: UserInfo) {
            // account: string, mobile: string
            this.selectedUserInfo = userInfo;
            let account = userInfo.Id;
            let mobile = userInfo.Mobile;

            console.assert(account != null);
            console.assert(mobile != null)

            this.accountInput.value = account;
            this.mobileElement.innerHTML = mobile;

            ui.showDialog(this.rechargeDialogElement);
        }
        async recharge() {
            let isValid = await this.validator.check();
            if (!isValid)
                return;

            let userId = this.accountInput.value;
            let amount = Number.parseFloat(this.amountInput.value);

            let message = `账户：${this.mobileElement.innerHTML}<br/><br/>金额：${this.amountInput.value}`;
            ui.confirm({
                title: "请确认", message,
                confirm: async () => {
                    let r = await memberService.recharge(userId, amount);
                    console.assert(this.selectedUserInfo != null);
                    this.selectedUserInfo.Balance = r.Balance;
                    this.dataSource.updated.fire(this.dataSource, this.selectedUserInfo);

                    ui.hideDialog(this.rechargeDialogElement);
                    ui.alert('冲值成功');
                }
            })


        }
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
                        dataFormatString: '￥{C2}'
                    }),
                    new wz.CustomField({
                        headerText: '操作',
                        itemStyle: { textAlign: 'center', width: '180px' } as CSSStyleDeclaration,
                        createItemCell(dataItem: UserInfo) {
                            let cell = new wuzhui.GridViewCell();
                            ReactDOM.render([
                                <button key="records" className="btn btn-success btn-minier">
                                    <i className="icon-reorder" />
                                    <span>充值记录</span>
                                </button>,
                                <button key="recharge" className="btn btn-info btn-minier"
                                    onClick={() => self.showRechargeDialog(dataItem)}>
                                    <i className="icon-money" />
                                    <span>充值</span>
                                </button>],
                                cell.element);
                            return cell;
                        }
                    })
                ],
                pageSize: 10
            });

            let { required, greaterThan } = rules;
            this.validator = new FormValidator(page.element,
                { name: "amount", rules: [greaterThan(() => 0, "金额必须大于 0")] }
            )
        }
        render() {
            return [
                <div key={10} name="tabs" className="tabbable">
                    <ul className="nav nav-tabs">
                        {/* <li className="pull-right">
                            <button onClick={() => { }} className="btn btn-primary btn-sm">
                                <i className="icon-money" />
                                <span>充值</span>
                            </button>
                        </li> */}
                        <li className="pull-right">
                            <button data-bind="click: search" className="btn btn-primary btn-sm">
                                <i className="icon-search" />
                                <span>搜索</span>
                            </button>
                        </li>
                        <li className="pull-right">
                            <input type="text" data-bind="value: searchText" className="form-control" style={{ width: 300 }}
                                placeholder="请输入会员手机" />
                        </li>
                    </ul>
                </div>,
                <table key={20} ref={(e: HTMLTableElement) => this.membersTable = e || this.membersTable}>
                </table>,
                <div key={30} className="modal fade" ref={(e: HTMLElement) => this.rechargeDialogElement = e || this.rechargeDialogElement}>
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
                                        <div ref={(m: HTMLElement) => this.mobileElement = m || this.mobileElement}></div>
                                        <input name="userId" className="form-control" placeholder="请输入要充值的账户"
                                            readOnly={true} type="hidden"
                                            ref={(e: HTMLInputElement) => this.accountInput = e || this.accountInput} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-2">金额</label>
                                    <div className="col-sm-10">
                                        <input name="amount" className="form-control" placeholder="请输入要充值的金额"
                                            ref={(e: HTMLInputElement) => this.amountInput = e || this.amountInput} />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-default"
                                    onClick={() => ui.hideDialog(this.rechargeDialogElement)}>取消</button>
                                <button className="btn btn-primary"
                                    ref={(e: HTMLButtonElement) => {
                                        if (!e) return;

                                        e.onclick = ui.buttonOnClick(() => this.recharge());
                                    }}>确定</button>
                            </div>
                        </div>
                    </div>
                </div>
            ];
        }
    }

    ReactDOM.render(<MemberListPage />, page.element);
}



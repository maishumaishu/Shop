var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "admin/services/user", "myWuZhui", "dilu", "react", "react-dom"], function (require, exports, user_1, wz, dilu_1, React, ReactDOM) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        let memberService = page.createService(user_1.UserService);
        let account = page;
        class MemberListPage extends React.Component {
            constructor() {
                super(...arguments);
                this.dataSource = new wuzhui.DataSource({ select: (args) => memberService.members(args) });
            }
            showRechargeDialog(userInfo) {
                // account: string, mobile: string
                this.selectedUserInfo = userInfo;
                let account = userInfo.Id;
                let mobile = userInfo.Mobile;
                console.assert(account != null);
                console.assert(mobile != null);
                this.accountInput.value = account;
                this.mobileElement.innerHTML = mobile;
                ui.showDialog(this.rechargeDialogElement);
            }
            recharge() {
                return __awaiter(this, void 0, void 0, function* () {
                    let isValid = yield this.validator.check();
                    if (!isValid)
                        return;
                    let userId = this.accountInput.value;
                    let amount = Number.parseFloat(this.amountInput.value);
                    let message = `账户：${this.mobileElement.innerHTML}<br/><br/>金额：${this.amountInput.value}`;
                    ui.confirm({
                        title: "请确认", message,
                        confirm: () => __awaiter(this, void 0, void 0, function* () {
                            let r = yield memberService.recharge(userId, amount);
                            console.assert(this.selectedUserInfo != null);
                            this.selectedUserInfo.Balance = r.Balance;
                            this.dataSource.updated.fire(this.dataSource, this.selectedUserInfo);
                            ui.hideDialog(this.rechargeDialogElement);
                            ui.alert('冲值成功');
                        })
                    });
                });
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
                            headerText: '性别', createItemCell(dataItem) {
                                let cell = new wuzhui.GridViewCell();
                                cell.element.innerText =
                                    dataItem.Gender == 'Male' ? '男' :
                                        dataItem.Gender == "Female" ? '女' : "";
                                return cell;
                            },
                            itemStyle: { textAlign: 'center' }
                        }),
                        new wz.BoundField({
                            dataField: 'Balance', headerText: '余额',
                            itemStyle: { textAlign: 'right' },
                            dataFormatString: '￥{C2}'
                        }),
                        new wz.CustomField({
                            headerText: '操作',
                            itemStyle: { textAlign: 'center', width: '180px' },
                            createItemCell(dataItem) {
                                let cell = new wuzhui.GridViewCell();
                                ReactDOM.render([
                                    h("button", { key: "records", className: "btn btn-success btn-minier" },
                                        h("i", { className: "icon-reorder" }),
                                        h("span", null, "\u5145\u503C\u8BB0\u5F55")),
                                    h("button", { key: "recharge", className: "btn btn-info btn-minier", onClick: () => self.showRechargeDialog(dataItem) },
                                        h("i", { className: "icon-money" }),
                                        h("span", null, "\u5145\u503C"))
                                ], cell.element);
                                return cell;
                            }
                        })
                    ],
                    pageSize: 10
                });
                let { required, greaterThan } = dilu_1.rules;
                this.validator = new dilu_1.FormValidator(page.element, { name: "amount", rules: [greaterThan(() => 0, "金额必须大于 0")] });
            }
            render() {
                return [
                    h("div", { key: 10, name: "tabs", className: "tabbable" },
                        h("ul", { className: "nav nav-tabs" },
                            h("li", { className: "pull-right" },
                                h("button", { "data-bind": "click: search", className: "btn btn-primary btn-sm" },
                                    h("i", { className: "icon-search" }),
                                    h("span", null, "\u641C\u7D22"))),
                            h("li", { className: "pull-right" },
                                h("input", { type: "text", "data-bind": "value: searchText", className: "form-control", style: { width: 300 }, placeholder: "请输入会员手机" })))),
                    h("table", { key: 20, ref: (e) => this.membersTable = e || this.membersTable }),
                    h("div", { key: 30, className: "modal fade", ref: (e) => this.rechargeDialogElement = e || this.rechargeDialogElement },
                        h("div", { className: "modal-dialog" },
                            h("div", { className: "modal-content" },
                                h("div", { className: "modal-header" },
                                    h("button", { type: "button", className: "close", "data-dismiss": "modal" },
                                        h("span", { "aria-hidden": "true" }, "\u00D7"),
                                        h("span", { className: "sr-only" }, "Close")),
                                    h("h4", { className: "modal-title" }, "\u5145\u503C")),
                                h("div", { className: "modal-body form-horizontal" },
                                    h("div", { className: "form-group" },
                                        h("label", { className: "col-sm-2" }, "\u8D26\u6237"),
                                        h("div", { className: "col-sm-10" },
                                            h("div", { ref: (m) => this.mobileElement = m || this.mobileElement }),
                                            h("input", { name: "userId", className: "form-control", placeholder: "请输入要充值的账户", readOnly: true, type: "hidden", ref: (e) => this.accountInput = e || this.accountInput }))),
                                    h("div", { className: "form-group" },
                                        h("label", { className: "col-sm-2" }, "\u91D1\u989D"),
                                        h("div", { className: "col-sm-10" },
                                            h("input", { name: "amount", className: "form-control", placeholder: "请输入要充值的金额", ref: (e) => this.amountInput = e || this.amountInput })))),
                                h("div", { className: "modal-footer" },
                                    h("button", { className: "btn btn-default", onClick: () => ui.hideDialog(this.rechargeDialogElement) }, "\u53D6\u6D88"),
                                    h("button", { className: "btn btn-primary", ref: (e) => {
                                            if (!e)
                                                return;
                                            e.onclick = ui.buttonOnClick(() => this.recharge());
                                        } }, "\u786E\u5B9A")))))
                ];
            }
        }
        ReactDOM.render(h(MemberListPage, null), page.element);
    }
    exports.default = default_1;
});

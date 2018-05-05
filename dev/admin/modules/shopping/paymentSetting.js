var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "dilu"], function (require, exports, dilu_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const label_max_width = 160;
    const input_max_width = 300;
    function default_1(page) {
        class PaymentSettingPage extends React.Component {
            constructor(props) {
                super(props);
                this.state = { enableWeixinPayment: false, enableTransfer: false };
            }
            save() {
                return __awaiter(this, void 0, void 0, function* () {
                    let isValid = yield this.validator.check();
                    if (!isValid)
                        return;
                    return Promise.resolve();
                });
            }
            componentDidMount() {
                let { required } = dilu_1.rules;
                this.validator = new dilu_1.FormValidator(page.element, {
                    name: "partnerKey", rules: [required()],
                    condition: () => {
                        return !this.partnerKeyInput.disabled;
                    }
                }, {
                    name: "transferTips", rules: [required()],
                    condition: () => {
                        return !this.transferTipsInput.disabled;
                    }
                });
            }
            render() {
                let { enableTransfer, enableWeixinPayment } = this.state;
                return [
                    h("ul", { key: 10, className: "nav nav-tabs" },
                        h("li", { className: "pull-right" },
                            h("button", { className: "btn btn-primary btn-sm", ref: (e) => {
                                    if (!e)
                                        return;
                                    ui.buttonOnClick(e, () => this.save(), {});
                                } },
                                h("i", { className: "icon-save" }),
                                h("span", null, "\u4FDD\u5B58")))),
                    h("div", { key: 20, className: "well" },
                        h("div", { className: "row form-group" },
                            h("label", { className: "col-md-4", style: { width: label_max_width } }, "\u5FAE\u652F\u4ED8\u5E94\u7528 ID"),
                            h("div", { className: "col-md-8", style: { maxWidth: input_max_width } },
                                h("input", { name: "partnerKey", type: "text", className: "form-control", disabled: !enableWeixinPayment, ref: (e) => this.partnerKeyInput = e || this.partnerKeyInput, placeholder: "请输入微信支付商户密钥" }))),
                        h("div", { className: "row form-group" },
                            h("label", { className: "col-md-4", style: { width: label_max_width } }, "\u5FAE\u652F\u4ED8\u5546\u6237\u5BC6\u94A5"),
                            h("div", { className: "col-md-8", style: { maxWidth: input_max_width } },
                                h("input", { type: "text", className: "form-control", disabled: !enableWeixinPayment, ref: (e) => this.partnerKeyInput = e || this.partnerKeyInput, placeholder: "请输入微信支付商户密钥" }))),
                        h("div", { className: "row form-group" },
                            h("label", { className: "col-md-4", style: { width: label_max_width } }),
                            h("label", { className: "col-md-8", style: { maxWidth: input_max_width } },
                                h("input", { type: "checkbox", checked: enableWeixinPayment, onChange: (e) => {
                                        this.state.enableWeixinPayment = e.target.checked;
                                        this.setState(this.state);
                                    } }),
                                "\u5F00\u542F\u5FAE\u4FE1\u652F\u4ED8")),
                        h("div", { className: "row form-group" },
                            h("label", { className: "col-md-4", style: { width: label_max_width } }, "\u8F6C\u8D26\u63D0\u793A"),
                            h("div", { className: "col-md-8", style: { maxWidth: input_max_width } },
                                h("textarea", { name: "transferTips", className: "form-control", multiple: true, style: { height: 80 }, ref: (e) => this.transferTipsInput = e || this.transferTipsInput, disabled: !enableTransfer, placeholder: "请输入提示用户进行转账的留言" }))),
                        h("div", { className: "row form-group" },
                            h("label", { className: "col-md-4", style: { width: label_max_width } }),
                            h("label", { className: "col-md-8", style: { maxWidth: input_max_width } },
                                h("input", { type: "checkbox", checked: enableTransfer, onChange: (e) => {
                                        this.state.enableTransfer = e.target.checked;
                                        this.setState(this.state);
                                    } }),
                                "\u5141\u8BB8\u4E2A\u4EBA\u8F6C\u8D26\u652F\u4ED8")))
                ];
            }
        }
        ReactDOM.render(h(PaymentSettingPage, null), page.element);
    }
    exports.default = default_1;
});

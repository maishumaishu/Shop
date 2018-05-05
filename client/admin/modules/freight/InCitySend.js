var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "dilu", "admin/services/shopping"], function (require, exports, dilu_1, shopping_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        let shopping = page.createService(shopping_1.ShoppingService);
        class InCitySendPage extends React.Component {
            constructor(props) {
                super(props);
                this.state = { cityFreight: this.props.cityFreight };
            }
            componentDidMount() {
                let { required } = dilu_1.rules;
                // let SendAmount = this.formElement.querySelector('[Name="SendAmount"]') as HTMLInputElement;
                // let Freight = this.formElement.querySelector('[Name="Freight"]') as HTMLInputElement;
                // let SendRadius = this.formElement.querySelector('[Name="SendRadius"]') as HTMLInputElement;
                this.validator = new dilu_1.FormValidator(this.formElement, { name: "SendAmount", rules: [required()] }, { name: "Freight", rules: [required()] }, { name: "SendRadius", rules: [required()] });
            }
            save() {
                return __awaiter(this, void 0, void 0, function* () {
                    let isValid = yield this.validator.check();
                    if (isValid == false)
                        return Promise.reject({});
                    let dataItem = this.state.cityFreight;
                    return shopping.updateCityFreight(dataItem);
                });
            }
            render() {
                let dataItem = this.state.cityFreight;
                return (h("form", { className: "form-horizontal", style: { maxWidth: 800 }, ref: (e) => this.formElement = e || this.formElement },
                    h("div", { className: "form-group" },
                        h("label", { className: "col-sm-2 control-label" }, "\u914D\u9001\u91D1\u989D"),
                        h("div", { className: "col-sm-10" },
                            h("input", { name: "SendAmount", type: "number", className: "form-control", placeholder: "请输入配送金额", ref: (e) => {
                                    if (!e)
                                        return;
                                    e.value = dataItem.SendAmount;
                                    e.onchange = () => {
                                        this.state.cityFreight.SendAmount = Number.parseFloat(e.value);
                                        this.setState(this.state);
                                    };
                                } }))),
                    h("div", { className: "form-group" },
                        h("label", { className: "col-sm-2 control-label" }, "\u914D\u9001\u8D39"),
                        h("div", { className: "col-sm-10" },
                            h("input", { name: "Freight", type: "number", className: "form-control", placeholder: "请输入配送费", ref: (e) => {
                                    if (!e)
                                        return;
                                    e.value = dataItem.Freight;
                                    e.onchange = () => {
                                        this.state.cityFreight.Freight = Number.parseFloat(e.value);
                                        this.setState(this.state);
                                    };
                                } }))),
                    h("div", { className: "form-group" },
                        h("label", { className: "col-sm-2 control-label" }, "\u914D\u9001\u8303\u56F4"),
                        h("div", { className: "col-sm-10" },
                            h("div", { className: "input-group" },
                                h("input", { name: "SendRadius", type: "number", className: "form-control", placeholder: "请输入配送范围", ref: (e) => {
                                        if (!e)
                                            return;
                                        e.value = dataItem.SendRadius;
                                        e.onchange = () => {
                                            this.state.cityFreight.SendRadius = Number.parseFloat(e.value);
                                            this.setState(this.state);
                                        };
                                    } }),
                                h("div", { className: "input-group-addon" }, "\u516C\u91CC")))),
                    h("div", { className: "form-group" },
                        h("div", { className: "col-sm-offset-2 col-sm-10" },
                            h("button", { className: "btn btn-primary", ref: (e) => {
                                    if (!e)
                                        return;
                                    e.onclick = ui.buttonOnClick((e) => {
                                        return this.save();
                                    }, { toast: '保存成功' });
                                } }, "\u4FDD\u5B58")))));
            }
        }
        shopping.cityFreight().then(dataItem => ReactDOM.render(h(InCitySendPage, { cityFreight: dataItem }), page.element));
    }
    exports.default = default_1;
});

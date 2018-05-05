define(["require", "exports", "components/editor", "admin/services/shopping", "ui", "dilu", "admin/services/service"], function (require, exports, editor_1, shopping_1, ui, dilu_1, service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const emptyImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAHpElEQVR4Xu2Y909UWxDHBxUVQWyAiopiiyJWBFuCMRJjQY0t0fj3mfiLGI0ajQ0LBhuCxt4VG7Ejiqjw8pm8s29dlwdXds2YzCSbvXv33HPmfL/znZlzM9ra2rrEzQwCGU6IGS7UESfEFh9OiDE+nBAnxBoCxvzxGuKEGEPAmDuuECfEGALG3HGFOCHGEDDmjivECTGGgDF3XCFOiDEEjLnjCnFCjCFgzB1XiBNiDAFj7rhCnBBjCBhzxxXihBhDwJg7rhAnxBgCxtxxhTghxhAw5o4rxAkxhoAxd1whTogxBIy54wpxQowhYMwdV4gTYgwBY+64QpwQYwgYc8cV4oQYQ8CYO64QJ8QYAsbccYU4IcYQMOaOK8QJMYaAMXfSrpBHjx7Ju3fvZPbs2TJgwADd/suXL+XFixcyffp0yc7O/gWSHz9+yMOHD6WoqEgGDhwoLS0t8ubNG5k5c6aOZT7u8X9WVlZkSL9+/Srfv3//Ze3Ozk7p169fbD7WHDJkyG+tEdmpfx9IOSHfvn2TxsbGmD8A//HjR5kyZUqMEDb6+vVrmTBhgm4Yy8nJiQF++fJluXnzphI2efJkaW5u1t/r168X5odQxqxevVry8vL+d+8dHR3S1tYmHz58UCJZFzJZd926dUp4IPnEiRNSVlYmkyZNEsipqanR/7Zs2SIZGRm/i3Gk51JOyJcvX2TPnj2RnGBwQUGBrFq1SlDU2bNnJT8/X8aPHy9Xr15VoiBk6tSp8vz5cyksLJTbt2/Ltm3bZNCgQbG1AL2pqUnwIXxQW6JlZmbqHKWlpTJixAj9+8GDB1JfX69EoLzRo0fLxYsXZdq0abJo0aLI+/ndB1JOSKIjdXV1CjLgEY2fP3+W8+fPy7Nnz5QAiAjGOMYTvbNmzdKIBqhEQlATKkFBGGmGyEYNBAOAsxYfrlHpsGHDlIDhw4frdXxqCuu/fftWg4E0CqHv379X/1gvmaEkiE2lpZ0QCHj8+LFubNSoURrB165dkxUrVsi4ceN+2gvpBELKy8ultrZWo5VUQVriP6KZlEX+B7Bg1Kbt27cnxYWxu3fv1rVYsydjPOnw7t27PQ2VhQsXyowZM3ocF2VAWgjp6uqSAwcOaPSQdo4ePSrz58/XqD906JAQidQPojfY3LlzNTIB5MyZM6ognidFxRuRDVHMBcknT56UZcuWSXFxsbS2tkpDQ8NP4xnLXIMHD9Y0mGiVlZVa486dO6ekEUD37t1TJUE0gTBnzhxNjaS//v37S25urhw/flxTGSktlZY2Qnbt2qXFEYcDIZCwf/9+jXpIw9ggRoFGAdQGcjfdEykGsOKN36Qg5kI5V65c0eLMsxAN4VFs586dSiSqgDhszJgxSg73Eo10R3Ch4CVLlmizkkr7o4S8evVKI558z2bZeFVVVWw/AE2nA1nUETbPvWQ2dOhQjXhqzI4dO2LEJo6NkrIIBhSC+vbt26cKAfRjx47J0qVLtePDSMGoOCjzrySEiCMCiezly5crIXROixcv1u4J496tW7e0iJIeNmzYIDdu3PhpvyiBeUgrkILCqquru8UkCiFMQoojcEhJzE3QsF58cWfOJ0+eCOmOjiyV9kcVQhoiqgGSTe3du1dzO+cLjC6JMwebJf2sWbPmlxaaSCWHHz58WJ8hmkkhtLyXLl1Kig0qY53Q4sYPQomoIJBx5MgRBZ+DKYZaOUjSsYXOjHrCeskak76SkxZCcOr+/fsaaXRDAAIYiYAAPp3XvHnz9DsYhZqWNxDCKX/ixInaKCxYsEDnOXXqlJIaDocU30BSFFAIjo0bN+ojT58+1XnpnOjmCAoKN/MSCOyDVhhFU+dWrlwpY8eOjbJcj2PTRgiHLNIKkQlwfLgmFbHZ+OtE6VNH2DgRePDgQamoqFBlcY1xTSFub2+XrVu36lzdWZSURa3gfEOTQGsOyfgWCIGw8AqH9Jp4juoR7V4MSDshnA+oA5y4eQVBKqA13bRpk0YcxCUSQv4mJXAeIWKJRBTDc6Q90gzAYBwaaRL6SggEU8jp3FDd6dOntQHhxB5qCK9gSGGolfq3du1aGTlyZC9g7v2QlBMCkBRm3hdxTVsImMg/nBWIPK7paEhrFE5SFrUAI1Jpb1EC9WTz5s0KDsQC0J07dxQ41IaSqAGhA0rcem8VkthkXLhwIdYGx89JQFBP8Kcndfaehv9GppwQop4Ij2pEPcBjnFsgCqOLQUEU1uvXryspHCBJF9QnyCNqUVxIXfjAWIwzD78JjFC8k/nGKxdSKSqOP7CGsajz06dP2nlR+/iGkFRbyglJhYNEK2DTzZSUlMRek9OFcaKm0IbX7uR81BTea7F+6OAgkbMEXRlkJOuygr+oGOJYL5nRpKAayEchNBfdqbIvGJgkpC8b+tufdUKMMeiEOCHGEDDmjivECTGGgDF3XCFOiDEEjLnjCnFCjCFgzB1XiBNiDAFj7rhCnBBjCBhzxxXihBhDwJg7rhAnxBgCxtxxhTghxhAw5o4rxAkxhoAxd1whTogxBIy54wpxQowhYMwdV4gTYgwBY+64QpwQYwgYc8cV4oQYQ8CYO64QJ8QYAsbccYU4IcYQMOaOK8QJMYaAMXf+AZXqN2hDkscnAAAAAElFTkSuQmCC';
    class CategoriesEditor extends editor_1.Editor {
        constructor(props) {
            super(props);
            this.control = this.props.control;
            this.shopping = this.elementPage.createService(shopping_1.ShoppingService);
            this.shopping.categories().then(categories => {
                this.state.categories = categories;
                this.setState(this.state);
            });
        }
        save() {
            if (!this.validator.check()) {
                return Promise.reject("form validate fail");
            }
            var category = Object.assign({}, this.currentItem);
            category.Name = this.nameInput.value;
            category.Remark = this.remarkInput.value;
            category.ImagePath = this.picture.value;
            category.SortNumber = this.sortNumberInput.value ? Number.parseInt(this.sortNumberInput.value) : null;
            if (category.Id)
                return this.shopping.updateCategory(category)
                    .then(o => {
                    var c = this.state.categories.filter(o => o.Id == category.Id)[0];
                    Object.assign(c, category);
                    this.setState(this.state);
                    ui.hideDialog(this.dialogElement);
                });
            return this.shopping.addCategory(category).then(data => {
                Object.assign(category, data);
                this.state.categories.push(category);
                this.setState(this.state);
                ui.hideDialog(this.dialogElement);
            });
        }
        setState(value) {
            this.control.state.categories = this.state.categories;
            super.setState(value);
        }
        edit(category) {
            this.validator.clearErrors();
            this.dialogElement.querySelectorAll('input, select, img')
                .forEach((o) => o.value = '');
            if (!category)
                category = {};
            this.currentItem = category;
            this.sortNumberInput.value = (category.SortNumber == null ? '' : category.SortNumber).toString();
            this.nameInput.value = category.Name || '';
            this.remarkInput.value = category.Remark || '';
            this.hiddenInput.checked = category.Hidden || false;
            this.picture.value = service_1.imageUrl(category.ImagePath || emptyImage);
            ui.showDialog(this.dialogElement);
        }
        componentDidMount() {
            // var pic = Object.assign(this.picture, { name: '图片' });
            Object.defineProperty(this.picture, 'value', {
                get: function () {
                    return this.src;
                },
                set: function (value) {
                    this.src = value;
                }
            });
            let { showIcons } = this.state;
            let checkPicture = function (value) {
                if (!showIcons)
                    return true;
                return value && value != emptyImage;
            };
            let { required, custom } = dilu_1.rules;
            this.validator = new dilu_1.FormValidator(this.dialogElement, { name: "name", rules: [required()] }, //rule: rules.required(this.nameInput)
            {
                name: "picture", rules: [custom(checkPicture, "图片不允许为空")]
                //rule: new Rule(this.picture, checkPicture.bind(this.validator), "图片不允许为空"),
            });
            this.showIconsInput.checked = this.state.showIcons;
            this.showIconsInput.onchange = () => {
                this.state.showIcons = this.showIconsInput.checked;
                this.setState(this.state);
            };
        }
        onFileChanged(e) {
            if (!e.files[0]) {
                return;
            }
            ui.imageFileToBase64(e.files[0], { width: 100, height: 100 })
                .then(data => {
                this.picture.value = data.base64;
            });
        }
        refDeleteButton(e) {
        }
        render() {
            var { categories, showIcons } = this.state;
            if (categories)
                categories.sort((a, b) => a.SortNumber - b.SortNumber);
            return (h("div", null,
                h("div", { className: "well" },
                    h("div", { className: "pull-left", style: { paddingTop: 4, paddingRight: 10, paddingLeft: 10 } }, "\u663E\u793A\u56FE\u6807"),
                    h("label", { className: "pull-left switch" },
                        h("input", { type: "checkbox", className: "ace ace-switch ace-switch-5", ref: (e) => this.showIconsInput = e || this.showIconsInput }),
                        h("span", { className: "lbl middle" })),
                    h("div", { className: "pull-right" },
                        h("button", { className: "btn btn-primary", onClick: () => this.edit() },
                            h("i", { className: "icon-plus", style: { marginRight: 4 } }),
                            "\u6DFB\u52A0\u7C7B\u522B")),
                    h("div", { className: "clearfix" })),
                categories ?
                    h("table", { className: "table table-striped table-bordered table-hover" },
                        h("thead", null,
                            h("tr", null,
                                h("th", null, "\u5E8F\u53F7"),
                                h("th", null, "\u540D\u79F0"),
                                h("th", null, "\u5907\u6CE8"),
                                h("th", null, "\u9690\u85CF"),
                                h("th", null, "\u56FE\u7247"),
                                h("th", null, "\u64CD\u4F5C"))),
                        h("tbody", null, categories.map(o => h("tr", { key: o.Id },
                            h("td", null, o.SortNumber),
                            h("td", null, o.Name),
                            h("td", null, o.Remark),
                            h("td", null, o.Hidden),
                            h("td", { style: { textAlign: 'center' } },
                                h("img", { src: service_1.imageUrl(o.ImagePath), style: { height: 36 } })),
                            h("td", { style: { textAlign: 'center' } },
                                h("button", { className: "btn btn-minier btn-info", style: { marginRight: 4 }, ref: (e) => {
                                        if (!e)
                                            return;
                                        e.onclick = () => this.edit(o);
                                    } },
                                    h("i", { className: "icon-pencil" })),
                                h("button", { className: "btn btn-minier btn-danger", ref: (e) => {
                                        if (!e)
                                            return;
                                        e.onclick = ui.buttonOnClick((event) => {
                                            return this.shopping.deleteCategory(o.Id).then(() => {
                                                this.state.categories = categories.filter(a => a.Id != o.Id);
                                                this.setState(this.state);
                                            });
                                        }, { confirm: `确定要删除类别'${o.Name}'吗?` });
                                    } },
                                    h("i", { className: "icon-trash" }))))))) : null,
                h("form", { name: "dlg_edit", className: "modal fade", ref: (o) => this.dialogElement = this.dialogElement || o },
                    h("input", { name: "Id", type: "hidden" }),
                    h("div", { className: "modal-dialog" },
                        h("div", { className: "modal-content" },
                            h("div", { className: "modal-header" },
                                h("button", { type: "button", className: "close", "data-dismiss": "modal" },
                                    h("span", { "aria-hidden": "true" }, "\u00D7"),
                                    h("span", { className: "sr-only" }, "Close")),
                                h("h4", { className: "modal-title" }, "\u7F16\u8F91")),
                            h("div", { className: "modal-body" },
                                h("div", { className: "form-horizontal" },
                                    h("div", { className: "form-group" },
                                        h("label", { className: "control-label col-sm-2" }, "\u5E8F\u53F7"),
                                        h("div", { className: "col-sm-10" },
                                            h("input", { name: "sortNumber", className: "form-control", placeholder: "商品类别的序号(可空)", ref: (e) => this.sortNumberInput = e || this.sortNumberInput }))),
                                    h("div", { className: "form-group" },
                                        h("label", { className: "control-label col-sm-2" }, "\u540D\u79F0*"),
                                        h("div", { className: "col-sm-10" },
                                            h("input", { name: "Name", className: "form-control", placeholder: "商品类别的名称(必填)", ref: (e) => this.nameInput = e || this.nameInput }))),
                                    h("div", { className: "form-group" },
                                        h("label", { className: "control-label col-sm-2" }, "\u5907\u6CE8"),
                                        h("div", { className: "col-sm-10" },
                                            h("input", { name: "Remark", className: "form-control", placeholder: "商品类别的备注信息(可空)", ref: (e) => this.remarkInput = e || this.remarkInput }))),
                                    h("div", { className: "form-group", style: { display: showIcons ? 'block' : 'none' } },
                                        h("label", { className: "control-label col-sm-2" }, "\u56FE\u7247"),
                                        h("div", { className: "col-sm-10" },
                                            h("div", { className: "well", style: { margin: 0, padding: 0 } },
                                                h("img", { style: { width: 100, height: 100 }, ref: (e) => this.picture = e || this.picture, src: emptyImage }),
                                                h("input", { name: "ImageUpload", type: "file", id: "ImageUpload", multiple: true, style: { position: 'absolute', top: 0, opacity: 0, height: '100%', width: '100%' }, ref: (e) => {
                                                        if (!e)
                                                            return;
                                                        e.onchange = () => this.onFileChanged(e);
                                                    } })))),
                                    h("div", { className: "form-group" },
                                        h("div", { className: "col-sm-offset-2 col-sm-10" },
                                            h("div", { className: "checkbox" },
                                                h("label", null,
                                                    h("input", { name: "Hidden", type: "checkbox", ref: (e) => {
                                                            if (!e)
                                                                return;
                                                            this.hiddenInput = e;
                                                            e.onchange = () => {
                                                                this.hiddenInput.value = e.checked;
                                                            };
                                                        } }),
                                                    "\u5728\u524D\u53F0\u9690\u85CF\u8BE5\u7C7B\u522B")))))),
                            h("div", { className: "modal-footer", style: { marginTop: 0 } },
                                h("button", { type: "button", className: "btn btn-default", "data-dismiss": "modal" }, "\u53D6\u6D88"),
                                h("button", { type: "button", className: "btn btn-primary", ref: (e) => {
                                        if (!e)
                                            return;
                                        e.onclick = ui.buttonOnClick(() => this.save(), {
                                            toast: '保存成功!'
                                        });
                                    } }, "\u4FDD\u5B58")))))));
        }
    }
    exports.default = CategoriesEditor;
});

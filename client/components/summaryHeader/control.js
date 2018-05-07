define(["require", "exports", "user/services/service", "components/common", "ui", "user/application", "user/siteMap", "../../user/services/memberService"], function (require, exports, service_1, common, ui, application_1, siteMap_1, memberService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Data {
    }
    exports.Data = Data;
    class SummaryHeaderControl extends common.Control {
        constructor(props) {
            super(props);
            this.state = { store: null, mode: 'normal' };
            let station = this.elementPage.createService(memberService_1.MemberService);
            station.store().then(data => {
                this.state.store = data;
                this.setState(this.state);
            });
            this.loadControlCSS();
        }
        get persistentMembers() {
            return ['mode'];
        }
        _render() {
            let { mode } = this.state;
            let props = this.props;
            // switch (mode) {
            //     case 'simple':
            //         return <SimpleHeader {...props}
            //             ref={(e) => {
            //                 if (!e) return;
            //                 e.state = this.state;
            //                 e.setState(e.state);
            //             }} />;
            //     default:
            //     case 'normal':
            return h(NormalHeader, Object.assign({}, props, { ref: (e) => {
                    if (!e)
                        return;
                    e.state = this.state;
                    e.setState(e.state);
                } }));
            // }
        }
    }
    exports.default = SummaryHeaderControl;
    class NormalHeader extends React.Component {
        render() {
            if (!this.state) {
                return null;
            }
            let url = '';
            let { store } = this.state;
            store = store || {};
            let src;
            if (store.Data && store.Data.ImageId) {
                src = service_1.imageUrl(store.Data.ImageId);
            }
            else {
                src = ui.generateImageBase64(100, 100, store.Name || "");
            }
            return [
                h("div", { key: 10, className: "headerImage pull-left" },
                    h("img", { src: src, ref: (e) => e ? ui.renderImage(e) : null })),
                h("div", { key: 20, className: "headerContent" },
                    h("h4", { className: "title" }, store.Name),
                    h("div", { className: "item" },
                        h("div", { className: "number" }, "0"),
                        h("div", { className: "text" }, "\u5168\u90E8\u5546\u54C1")),
                    h("div", { className: "item" },
                        h("div", { className: "number" }, "0"),
                        h("div", { className: "text" }, "\u4E0A\u65B0\u5546\u54C1")),
                    h("div", { className: "item" },
                        h("div", { className: "number" }, "0"),
                        h("div", { className: "text" }, "\u6211\u7684\u8BA2\u5355")),
                    h("div", { className: "clearfix" }))
            ];
        }
    }
    class SimpleHeader extends React.Component {
        render() {
            if (!this.state) {
                return null;
            }
            return (h("div", { className: "summaryHeaderControl simpleHeader" },
                h("i", { className: "icon-user pull-right", onClick: () => application_1.app.redirect(siteMap_1.default.nodes.user_index) }),
                h("div", { className: "position interception" },
                    h("i", { className: "icon-map-marker" }),
                    h("span", null, "\u6682\u65F6\u83B7\u53D6\u4E0D\u5230\u4F4D\u7F6E\u4FE1\u606F"),
                    h("i", { className: "icon-sort-down", style: { margin: 0, position: 'relative', left: 6, top: -2 } }))));
        }
    }
});

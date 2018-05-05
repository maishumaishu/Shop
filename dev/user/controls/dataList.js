define(["require", "exports", "ui"], function (require, exports, ui_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class DataList extends React.Component {
        constructor(props) {
            super(props);
            this.pageIndex = 0;
            this.state = { items: [] };
            this.loadData();
        }
        loadData() {
            if (this.status == 'complted' || this.status == 'loading') {
                return;
            }
            this.status = 'loading';
            this.props.loadData(this.pageIndex).then(items => {
                this.status = 'finish';
                if (items.length < this.props.pageSize)
                    this.status = 'complted';
                this.pageIndex = this.pageIndex + 1;
                this.state.items = this.state.items.concat(items);
                this.setState(this.state);
            }).catch(() => {
                this.status = 'fail';
            });
        }
        reset() {
            this.pageIndex = 0;
            this.status = null;
            this.state.items = [];
            this.setState(this.state);
        }
        componentDidMount() {
            let scroller;
            if (this.props.scroller)
                scroller = this.props.scroller();
            if (scroller == null) {
                scroller = this.element.parentElement;
            }
            scrollOnBottom(scroller, this.loadData.bind(this));
        }
        createDataItem(data, index) {
            try {
                return this.props.dataItem(data, index);
            }
            catch (e) {
                let error = e;
                return h("div", null, error.message);
            }
        }
        render() {
            let indicator;
            switch (this.status) {
                case 'complted':
                    indicator = this.props.showCompleteText ?
                        h("div", null,
                            h("span", null, "\u6570\u636E\u5DF2\u5168\u90E8\u52A0\u8F7D\u5B8C"))
                        :
                            null;
                    break;
                case 'fail':
                    indicator =
                        h("button", { className: "btn btn-default btn-block", onClick: this.loadData }, "\u70B9\u51FB\u52A0\u8F7D\u6570\u636E");
                    break;
                default:
                    indicator =
                        h("div", null,
                            h("i", { className: "icon-spinner icon-spin" }),
                            h("span", null, "\u6570\u636E\u6B63\u5728\u52A0\u8F7D\u4E2D..."));
                    break;
            }
            return (h("div", { ref: (o) => this.element = o, className: this.props.className },
                this.state.items.map((o, i) => this.createDataItem(o, i)),
                this.props.emptyItem != null && this.state.items.length == 0 ?
                    this.props.emptyItem
                    :
                        h("div", { className: "data-loading col-xs-12" }, indicator)));
        }
    }
    exports.DataList = DataList;
    let dataListDefaultProps = {};
    dataListDefaultProps.pageSize = 10;
    DataList.defaultProps = dataListDefaultProps;
    /**
     * 滚动到底部触发回调事件
     */
    function scrollOnBottom(element, callback, deltaHeight) {
        console.assert(element != null);
        console.assert(callback != null);
        deltaHeight = deltaHeight || 10;
        element.addEventListener('scroll', function () {
            let maxScrollTop = element.scrollHeight - element.clientHeight;
            if (element.scrollTop + deltaHeight >= maxScrollTop) {
                callback();
            }
        });
    }
    // define('datalist', function () {
    //     return `
    //         .datalist-footer {
    //             text-align: center;
    //             height: 50px;
    //             padding-top: 10px;
    //         }
    //     `;
    // })
    requirejs(['css!components/dataList']);
    class MyDataList {
        constructor(args) {
            this._status = 'init';
            this.pageIndex = 0;
            this.preRecordsCount = 0;
            args = args || {};
            if (!args.element)
                throw ui_1.errors.argumentNull('element');
            if (!args.item)
                throw ui_1.errors.argumentNull('item');
            if (!args.loadData)
                throw ui_1.errors.argumentNull('loadData');
            this.loadData = args.loadData;
            this.renderItem = args.item;
            this.element = args.element;
            this.itemsElement = document.createElement("div");
            this.itemsElement.className = "datalist-items clearfix";
            this.footerElement = document.createElement('div');
            this.footerElement.className = "datalist-footer";
            this.footerElement.onclick = () => {
                if (this.status != 'fail')
                    return;
                this.loadDataItems();
            };
            this.element.appendChild(this.itemsElement);
            this.element.appendChild(this.footerElement);
            this.loadDataItems();
            scrollOnBottom(args.element.parentElement, () => this.loadDataItems(), 50);
        }
        loadDataItems() {
            if (this.status == 'loading' || this.status == 'completed')
                return;
            this.status = 'loading';
            this.loadData(this.pageIndex)
                .then(items => {
                var itemElements = items.map((o, i) => this.renderItem(o, i));
                itemElements.forEach(o => this.itemsElement.appendChild(o));
                this.pageIndex = this.pageIndex + 1;
                if (items.length == 0 || items.length < this.preRecordsCount)
                    this.status = 'completed';
                else
                    this.status = 'finish';
                this.preRecordsCount = items.length;
            })
                .catch(() => {
                this.status = 'fail';
            });
        }
        get status() {
            return this._status;
        }
        set status(value) {
            this._status = value;
            switch (value) {
                case 'loading':
                    this.footerElement.innerHTML =
                        `<i className="icon-spinner icon-spin"></i>
                    <span>数据正在加载中...</span>`;
                    break;
                case 'completed':
                    this.footerElement.innerHTML =
                        `<div>
                        <span>数据已全部加载完</span>
                    </div>
                    `;
                    break;
                case 'fail':
                    this.footerElement.innerHTML =
                        `<span>数据加载失败，点击加载</span>`;
                    break;
                default:
                case 'finish':
                    this.footerElement.innerHTML = "";
                    break;
            }
        }
        reset(loadData) {
            this.loadData = loadData;
            this.pageIndex = 0;
            this.itemsElement.innerHTML = "";
            this.status = 'init';
            this.loadDataItems();
        }
    }
    exports.MyDataList = MyDataList;
    function dataList(args) {
        return new MyDataList(args);
    }
    exports.dataList = dataList;
});

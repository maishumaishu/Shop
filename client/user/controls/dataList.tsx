import { errors } from "ui";


interface DataListProps extends React.Props<DataList> {
    loadData: ((pageIndex: number) => Promise<Array<any>>),
    dataItem: ((o: any, index: number) => JSX.Element),
    className?: string,
    pageSize?: number,
    scroller?: () => HTMLElement,
    emptyItem?: JSX.Element,
    showCompleteText?: boolean
}
interface DataListState {
    items: Array<any>
}
export class DataList extends React.Component<DataListProps, DataListState>{
    private pageIndex: number;
    private status: 'loading' | 'complted' | 'finish' | 'fail';

    element: HTMLElement;

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
        let scroller: HTMLElement;
        if (this.props.scroller)
            scroller = this.props.scroller();

        if (scroller == null) {
            scroller = this.element.parentElement;
        }
        scrollOnBottom(scroller, this.loadData.bind(this));
    }

    createDataItem(data: any, index: number) {
        try {
            return this.props.dataItem(data, index);
        }
        catch (e) {
            let error = e as Error;
            return <div>{error.message}</div>
        }
    }

    render() {
        let indicator: JSX.Element;
        switch (this.status) {
            case 'complted':
                indicator = this.props.showCompleteText ?
                    <div>
                        <span>数据已全部加载完</span>
                    </div>
                    :
                    null
                break;
            case 'fail':
                indicator =
                    <button className="btn btn-default btn-block" onClick={this.loadData} >
                        点击加载数据
                    </button>
                break;
            default:
                indicator =
                    <div>
                        <i className="icon-spinner icon-spin"></i>
                        <span>数据正在加载中...</span>
                    </div>
                break;
        }
        return (
            <div ref={(o: HTMLElement) => this.element = o} className={this.props.className}>
                {this.state.items.map((o, i) =>
                    this.createDataItem(o, i)
                )}
                {this.props.emptyItem != null && this.state.items.length == 0 ?
                    this.props.emptyItem
                    :
                    <div className="data-loading col-xs-12">
                        {indicator}
                    </div>}

            </div >
        );
    }
}

let dataListDefaultProps: DataListProps = {} as DataListProps;
dataListDefaultProps.pageSize = 10;
DataList.defaultProps = dataListDefaultProps;

/**
 * 滚动到底部触发回调事件
 */
function scrollOnBottom(element: HTMLElement, callback: Function, deltaHeight?: number) {
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

requirejs(['css!user/components/dataList']);
type DataListStatus = 'loading' | 'completed' | 'finish' | 'fail' | 'init';
export class MyDataList<T> {
    private _status: DataListStatus = 'init';
    private element: HTMLElement;
    private renderItem: (dataItem: T, index: number) => HTMLElement;
    private pageIndex: number = 0;

    private loadData: (pageIndex: number) => Promise<T[]>;
    private itemsElement: HTMLElement;
    private footerElement: HTMLElement;
    private preRecordsCount = 0;

    constructor(args: {
        element: HTMLElement,
        item: (dataItem: T, index: number) => HTMLElement,
        loadData: ((pageIndex: number) => Promise<Array<any>>),
    }) {

        args = args || {} as any;

        if (!args.element)
            throw errors.argumentNull('element');

        if (!args.item)
            throw errors.argumentNull('item');

        if (!args.loadData)
            throw errors.argumentNull('loadData');

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
        }

        this.element.appendChild(this.itemsElement);
        this.element.appendChild(this.footerElement);

        this.loadDataItems();
        scrollOnBottom(args.element.parentElement, () => this.loadDataItems(), 50);
    }

    private loadDataItems() {
        if (this.status == 'loading' || this.status == 'completed')
            return;

        this.status = 'loading';
        this.loadData(this.pageIndex)
            .then(items => {
                var itemElements = items.map((o, i) => this.renderItem(o, i))
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
            })
    }

    get status(): DataListStatus {
        return this._status;
    }
    set status(value: DataListStatus) {
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
                    `<span>数据加载失败，点击加载</span>`
                break;
            default:
            case 'finish':
                this.footerElement.innerHTML = "";
                break;
        }
    }

    reset(loadData: (pageIndex: number) => Promise<T[]>) {
        this.loadData = loadData;
        this.pageIndex = 0;
        this.itemsElement.innerHTML = "";
        this.status = 'init';
        this.loadDataItems();
    }

}

export function dataList<T>(args: {
    element: HTMLElement,
    item: (dataItem: T, index: number) => HTMLElement,
    loadData: ((pageIndex: number) => Promise<Array<any>>),
}) {

    return new MyDataList(args);

}
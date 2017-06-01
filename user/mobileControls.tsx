
(function (module) {
  /**
 * https://github.com/gre/bezier-easing
 * BezierEasing - use bezier curve for transition easing function
 * by Gaëtan Renaudeau 2014 - 2015 – MIT License
 */

  // These values are established by empiricism with tests (tradeoff: performance VS precision)
  var NEWTON_ITERATIONS = 4;
  var NEWTON_MIN_SLOPE = 0.001;
  var SUBDIVISION_PRECISION = 0.0000001;
  var SUBDIVISION_MAX_ITERATIONS = 10;

  var kSplineTableSize = 11;
  var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

  var float32ArraySupported = typeof Float32Array === 'function';

  function A(aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
  function B(aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
  function C(aA1) { return 3.0 * aA1; }

  // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
  function calcBezier(aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT; }

  // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
  function getSlope(aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1); }

  function binarySubdivide(aX, aA, aB, mX1, mX2) {
    var currentX, currentT, i = 0;
    do {
      currentT = aA + (aB - aA) / 2.0;
      currentX = calcBezier(currentT, mX1, mX2) - aX;
      if (currentX > 0.0) {
        aB = currentT;
      } else {
        aA = currentT;
      }
    } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
    return currentT;
  }

  function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
    for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
      var currentSlope = getSlope(aGuessT, mX1, mX2);
      if (currentSlope === 0.0) {
        return aGuessT;
      }
      var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
      aGuessT -= currentX / currentSlope;
    }
    return aGuessT;
  }

  module.exports = function bezier(mX1, mY1, mX2, mY2) {
    if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
      throw new Error('bezier x values must be in [0, 1] range');
    }

    // Precompute samples table
    var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
    if (mX1 !== mY1 || mX2 !== mY2) {
      for (var i = 0; i < kSplineTableSize; ++i) {
        sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
      }
    }

    function getTForX(aX) {
      var intervalStart = 0.0;
      var currentSample = 1;
      var lastSample = kSplineTableSize - 1;

      for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
        intervalStart += kSampleStepSize;
      }
      --currentSample;

      // Interpolate to provide an initial guess for t
      var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
      var guessForT = intervalStart + dist * kSampleStepSize;

      var initialSlope = getSlope(guessForT, mX1, mX2);
      if (initialSlope >= NEWTON_MIN_SLOPE) {
        return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
      } else if (initialSlope === 0.0) {
        return guessForT;
      } else {
        return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
      }
    }

    return function BezierEasing(x) {
      if (mX1 === mY1 && mX2 === mY2) {
        return x; // linear
      }
      // Because JavaScript number are imprecise, we should guarantee the extremes are right.
      if (x === 0) {
        return 0;
      }
      if (x === 1) {
        return 1;
      }
      return calcBezier(getTForX(x), mY1, mY2);
    };
  };


  window['BezierEasing'] = module.exports;

})({ exports: {} });

export function createHammerManager(element: HTMLElement): Hammer.Manager {
    let manager = new Hammer.Manager(element, { touchAction: 'auto' });
    return manager;
}
export class Callback<T> {
    private funcs = new Array<(args: T) => void>();
    private _value: T;

    constructor() {
    }
    add(func: (args: T) => any): (args: T) => any {
        this.funcs.push(func);
        return func;
    }
    remove(func: (args: T) => any) {
        this.funcs = this.funcs.filter(o => o != func);
    }
    fire(args: T) {
        this.funcs.forEach(o => o(args));
    }
}

export let isAndroid = navigator.userAgent.indexOf('Android') > -1;
export let isIOS = navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPad') > 0;
export let isCordovaApp = location.protocol === 'file:';
export let isWeb = location.protocol === 'http:' || location.protocol === 'https:';

function getChildren(props): Array<any> {
    props = props || {};
    let children = [];
    if (props['children'] instanceof Array) {
        children = props['children'];
    }
    else if (props['children'] != null) {
        children = [props['children']];
    }
    return children;
}

export class PageComponent extends React.Component<{}, {}>{
    render() {
        let children = getChildren(this.props);
        let header = children.filter(o => o instanceof PageHeader)[0];
        let footer = children.filter(o => o instanceof PageFooter)[0];
        let bodies = children.filter(o => !(o instanceof PageHeader) && !(o instanceof PageFooter));
        let views = children.filter(o => o instanceof PageView);
        return (
            <div>
                {header != null ? (header) : null}
                {bodies.map(o => (o))}
                {footer != null ? (footer) : null}
            </div>
        );
    }
}

export class PageHeader extends React.Component<React.Props<PageHeader> & { style?: React.CSSProperties }, {}> {
    static tagName = 'HEADER';
    element: HTMLElement;

    render() {
        let children = getChildren(this.props);
        return (
            <header ref={(o: HTMLElement) => this.element = o} style={this.props.style}>
                {children.map(o => (o))}
            </header>
        );
    }
}

export class PageFooter extends React.Component<React.Props<PageHeader> & { style?: React.CSSProperties }, {}>{
    static tagName = 'FOOTER';
    element: HTMLElement;

    render() {
        let children = getChildren(this.props);
        return (
            <footer ref={(o: HTMLElement) => this.element = o} style={this.props.style}>
                {children.map(o => (o))}
            </footer>
        );
    }
}

let easing = BezierEasing(0, 0, 1, 0.5);



interface PageViewProps extends React.Props<PageView> {
    className?: string, style?: React.CSSProperties,
    //panEnd?: () => boolean,
    pullDownIndicator?: { initText: string, readyText: string, distance?: number, onRelease?: () => void }
    pullUpIndicator?: { initText: string, readyText: string, distance?: number, onRelease?: () => void }
}

/** 是否为安卓系统 */
export class PageView extends React.Component<PageViewProps, {}>{
    private pullDownIndicator: PullDownIndicator;
    private pullUpIndicator: PullUpIndicator;

    static tagName = 'SECTION';

    element: HTMLElement;

    iosAppComponentDidMount() {

    }
    protected componentDidMount() {
        if (isIOS && isCordovaApp) {
            this.iosAppComponentDidMount();
            return;
        }

        let start: number;

        //======================================
        let scroller = this.element as HTMLElement;
        scroller.style.transition = '0';

        let hammer = createHammerManager(scroller);;
        var pan = new Hammer.Pan({ direction: Hammer.DIRECTION_VERTICAL });
        let moving: 'moveup' | 'movedown' | 'overscroll' = null;

        hammer.add(pan);
        hammer.on('panstart', (event) => {
            scroller.style.transition = '0s';
        })

        let panVertical = (event) => {
            console.log('deltaY:' + event.deltaY);
            if (scroller.scrollTop == 0 && (event.direction & Hammer.DIRECTION_DOWN) == Hammer.DIRECTION_DOWN) {
                moving = 'movedown';
            }
            else if (scroller.scrollTop + scroller.clientHeight == scroller.scrollHeight &&
                (event.direction & Hammer.DIRECTION_UP) == Hammer.DIRECTION_UP) {
                moving = 'moveup';
            }
            else if ((scroller.scrollTop + scroller.clientHeight > scroller.scrollHeight) || scroller.scrollTop < 0) {//FOR IOS
                moving = 'overscroll';
            }

            if (moving) {
                let distance = easing(event.distance / 1000) * 1000;
                if (moving == 'movedown') {
                    scroller.style.transform = `translateY(${distance}px)`;
                    scroller.setAttribute('data-scrolltop', `${0 - distance}`);
                }
                else if (moving == 'moveup') {
                    scroller.style.transform = `translateY(-${distance}px)`;
                    scroller.setAttribute('data-scrolltop', `${scroller.scrollTop + distance}`);
                }
                else if (moving == 'overscroll') {//FOR IOS
                    scroller.setAttribute('data-scrolltop', `${scroller.scrollTop}`);
                }
            }
        };
        hammer.on('panup', panVertical);
        hammer.on('pandown', panVertical);

        let end = () => {
            if (!moving) {
                return;
            }

            this.element.style.touchAction = 'auto';
            scroller.removeAttribute('data-scrolltop');

            // let pullDownRelease: () => void;
            // let pullUpRelease: () => void;
            // if (moving == 'movedown' && this.props.pullDownIndicator) {
            //     pullDownRelease = this.props.pullDownIndicator.onRelease;
            // }
            // else if (moving == 'moveup' && this.props.pullUpIndicator) {
            //     pullUpRelease = this.props.pullUpIndicator.onRelease;
            // }

            if (moving == 'movedown' && this.pullDownIndicator != null && this.pullDownIndicator.status == 'ready') {
                this.onRelease('pullDown');
            }
            else if (moving == 'moveup' && this.pullUpIndicator != null && this.pullUpIndicator.status == 'ready') {
                this.onRelease('pullUp');
            }
            else {
                this.resetPosition();
            }


            moving = null;
        }

        hammer.on('pancancel', end);
        hammer.on('panend', end);

        let startY: number;
        scroller.addEventListener('touchstart', (event) => {
            startY = event.touches[0].clientY;
        })
        scroller.addEventListener('touchmove', (event) => {
            let deltaY = event.touches[0].clientY - startY;
            if (deltaY < 0 && scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight) {
                event.preventDefault();
            }
            else if (deltaY > 0 && scroller.scrollTop <= 0) {
                event.preventDefault();
            }
        })
    }

    private onRelease(action: 'pullDown' | 'pullUp') {
        if (action == 'pullDown' && this.props.pullDownIndicator.onRelease != null) {
            this.props.pullDownIndicator.onRelease();
        }
        else if (action == 'pullUp' && this.props.pullUpIndicator.onRelease != null) {
            this.props.pullUpIndicator.onRelease();
        }
        else {
            this.resetPosition();
        }
    }

    resetPosition() {
        this.element.style.removeProperty('transform');
    }

    slide(direction: 'up' | 'down' | 'origin') {
        this.element.style.transition = `0.4s`;
        if (direction == 'down') {
            this.element.style.transform = `translateY(100%)`;
        }
        else if (direction == 'up') {
            this.element.style.transform = `translateY(-100%)`;
        }
        else if (direction == 'origin') {
            this.element.style.transform = `translateY(0)`;
        }
    }

    render() {
        let children = getChildren(this.props);
        let pullDownIndicator: JSX.Element = null;
        let pullUpIndicator: JSX.Element = null;
        if (this.props.pullDownIndicator) {
            let p = this.props.pullDownIndicator;
            pullDownIndicator =
                <PullDownIndicator initText={p.initText}
                    readyText={p.readyText}
                    distance={p.distance}
                    ref={(o) => this.pullDownIndicator = o}>
                </PullDownIndicator>
        }
        if (this.props.pullUpIndicator) {
            let p = this.props.pullUpIndicator;
            pullUpIndicator =
                <PullUpIndicator initText={p.initText}
                    readyText={p.readyText}
                    distance={p.distance}
                    ref={(o) => this.pullUpIndicator = o}>
                </PullUpIndicator>
        }
        return (
            <section ref={(o: HTMLElement) => this.element = o} className={this.props.className} style={this.props.style}>
                {pullDownIndicator}
                {children.map(o => (o))}
                {pullUpIndicator}
            </section>
        );
    }
}


type IndicatorStatus = 'init' | 'ready';
interface IndicatorProps {
    initText?: string,
    readyText?: string,
    distance?: number
}

let defaultIndicatorProps = {} as IndicatorProps;
defaultIndicatorProps.distance = 50;

export class PullUpIndicator extends React.Component<IndicatorProps & React.Props<PullUpIndicator>, {}>{//, { status: IndicatorStatus }

    private element: HTMLElement;
    private initElement: HTMLElement;
    private readyElement: HTMLElement;
    private _status: IndicatorStatus;

    constructor(props: IndicatorProps) {

        super(props);
        this.state = {};//
    }

    public get status(): IndicatorStatus {
        if (!this.initElement.style.display || this.initElement.style.display == 'block') {
            return 'init';
        }

        return 'ready';
    }

    public set status(value: IndicatorStatus) {
        if (this._status == value)
            return;

        this._status = value;

        if (this._status == 'init') {
            this.initElement.style.display = 'block';
            this.readyElement.style.display = 'none';
        }
        else {
            this.initElement.style.display = 'none';
            this.readyElement.style.display = 'block';
        }
    }


    componentDidMount() {
        let indicator = this.element; //this.refs['pull-up-indicator'] as HTMLElement;
        let viewElement = this.element.parentElement;
        console.assert(viewElement != null);
        this.status = 'init';

        let preventDefault = false;
        let start = false;
        let startY: number;

        let manager = createHammerManager(viewElement); //new Hammer.Manager(viewElement, { touchAction: 'auto' });
        manager.add(new Hammer.Pan({ direction: Hammer.DIRECTION_VERTICAL }));
        manager.on('panstart', (event) => {
            if (viewElement.scrollTop + viewElement.clientHeight >= viewElement.scrollHeight)
                start = true;
            else
                start = false;
        });

        viewElement.addEventListener('touchmove', (event) => {
            if (!start) {
                return;
            }

            if (preventDefault) {
                event.preventDefault();
                return;
            }

            let currentY = indicator.getBoundingClientRect().top;
            if (startY == null) {
                startY = currentY;
                return;
            }

            let status: IndicatorStatus = null;
            let deltaY = currentY - startY;
            let distance = 0 - Math.abs(this.props.distance);
            if (deltaY < distance && this.status != 'ready') {
                status = 'ready';
            }
            else if (deltaY > distance && this.status != 'init') {
                status = 'init';
            }

            if (status != null) {
                //=================================
                // 延时设置，避免卡
                //window.setTimeout(() => {
                preventDefault = true;
                this.status = status;
                //this.setState(this.state);
                //}, 100);
                //=================================
                // 因为更新 DOM 需要时间，一定时间内，不要移动，否则会闪
                window.setTimeout(() => preventDefault = false, 200);
                //=================================
            }
        });

        manager.on('panend', () => {
            // if (this.onBottom) {
            //     if (this.status == 'ready' && this.props.onRelease != null) {
            //         this.props.onRelease();
            //     }
            //     else if (this.status == 'init' && this.props.onCancel != null) {
            //         this.props.onCancel();
            //     }
            // }

            //=================================
            // 延时避免在 IOS 下闪烁
            window.setTimeout(() => {
                preventDefault = false;
                startY = null;
                start = false;
                this.status = 'init';
                //     this.setState(this.state);
            }, 100);
            //=================================
        });
    }

    private get onBottom() {
        return this.element.scrollTop + this.element.clientHeight >= this.element.scrollHeight;
    }
    //style={{ display: this.state.status == 'init' ? 'block' : 'none' }}
    //style={{ display: this.state.status == 'ready' ? 'block' : 'none' }}
    render() {
        return (
            <div className="pull-up-indicator" ref={(o: HTMLElement) => this.element = o}>
                <div className="init" ref={(o: HTMLElement) => this.initElement = o}>
                    <i className="icon-chevron-up"></i>
                    <span>{this.props.initText}</span>
                </div>
                <div className="ready" ref={(o: HTMLElement) => this.readyElement = o} >
                    <i className="icon-chevron-down"></i>
                    <span>{this.props.readyText}</span>
                </div>
            </div>
        );
    }
}

PullUpIndicator.defaultProps = defaultIndicatorProps;
//{ status: IndicatorStatus }
export class PullDownIndicator extends React.Component<IndicatorProps & React.Props<PullDownIndicator>, {}>{

    private element: HTMLElement;
    private initElement: HTMLElement;
    private readyElement: HTMLElement;
    private _status: IndicatorStatus;

    constructor(props: IndicatorProps) {

        super(props);
        this.state = {};
    }

    public get status(): IndicatorStatus {
        if (!this.initElement.style.display || this.initElement.style.display == 'block') {
            return 'init';
        }

        return 'ready';
    }

    public set status(value: IndicatorStatus) {
        if (this._status == value)
            return;

        this._status = value;
        if (this._status == 'init') {
            this.initElement.style.display = 'block';
            this.readyElement.style.display = 'none';
        }
        else {
            this.initElement.style.display = 'none';
            this.readyElement.style.display = 'block';
        }
    }

    componentDidMount() {
        let indicator = this.element;
        let viewElement = this.element.parentElement;
        console.assert(viewElement != null);
        this.status = 'init'

        let preventDefault = false;
        let manager = createHammerManager(viewElement); //new Hammer.Manager(viewElement);
        manager.add(new Hammer.Pan({ direction: Hammer.DIRECTION_VERTICAL }));
        viewElement.addEventListener('touchmove', (event) => {
            let scrollTopString = viewElement.getAttribute('data-scrolltop');
            let scrollTop = scrollTopString ? Number.parseInt(scrollTopString) : viewElement.scrollTop;
            if (scrollTop >= 0) {
                return;
            }

            if (preventDefault) {
                event.preventDefault();
                return;
            }

            let currentY = indicator.getBoundingClientRect().top;
            let status: IndicatorStatus = null;

            let distance = 0 - Math.abs(this.props.distance);
            if (scrollTop < distance && this.status != 'ready') {
                status = 'ready';
            }
            else if (scrollTop > distance && this.status != 'init') {
                status = 'init';
            }

            if (status != null) {
                //=================================
                // 延时设置，避免卡
                // window.setTimeout(() => {
                preventDefault = true;
                this.status = status;
                //     //this.setState(this.state);
                // }, 100);
                //=================================
                // 因为更新 DOM 需要时间，一定时间内，不要移动，否则会闪
                window.setTimeout(() => preventDefault = false, 200);
                //=================================
            }
        });

        manager.on('panend', () => {
            //=================================
            // 延时避免在 IOS 下闪烁
            window.setTimeout(() => {
                //     preventDefault = false;
                this.status = 'init';
                //this.setState(this.state);
            }, 100);
            //=================================
        });
    }

    private get onTop() {
        return this.element.scrollTop <= 0;
    }

    render() {
        return (
            <div className="pull-down-indicator" ref={(o: HTMLElement) => this.element = o}>
                <div className="init" ref={(o: HTMLElement) => this.initElement = o}>
                    <i className="icon-chevron-down"></i>
                    <span>{this.props.initText}</span>
                </div>
                <div className="ready" ref={(o: HTMLElement) => this.readyElement = o}>
                    <i className="icon-chevron-up"></i>
                    <span>{this.props.readyText}</span>
                </div>
            </div>
        );
    }
}

PullDownIndicator.defaultProps = defaultIndicatorProps;

//==============================================================
// DataList 控件

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
        //let deltaHeight = 10;
        if (element.scrollTop + deltaHeight >= maxScrollTop) {
            callback();
        }
    });
}

//==============================================================
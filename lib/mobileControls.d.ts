declare namespace controls {
    class ImageFileSelector extends React.Component<React.Props<ImageFileSelector>, {
        images: string[];
    }> {
        private inputElement;
        private imageFileLoader;
        constructor();
        componentDidMount(): void;
        readonly imageDatas: string[];
        render(): JSX.Element;
    }
}
declare namespace controls {
    function getChildren(props: React.Props<any>): Array<any>;
    function createHammerManager(element: HTMLElement): Hammer.Manager;
    class Callback<T> {
        private funcs;
        private _value;
        constructor();
        add(func: (args: T) => any): (args: T) => any;
        remove(func: (args: T) => any): void;
        fire(args: T): void;
    }
    let isAndroid: boolean;
    let isIOS: boolean;
    let isCordovaApp: boolean;
    let isWeb: boolean;
}
declare namespace controls {
    interface DataListProps extends React.Props<DataList> {
        loadData: ((pageIndex: number) => Promise<Array<any>>);
        dataItem: ((o: any, index: number) => JSX.Element);
        className?: string;
        pageSize?: number;
        scroller?: () => HTMLElement;
        emptyItem?: JSX.Element;
        showCompleteText?: boolean;
    }
    interface DataListState {
        items: Array<any>;
    }
    class DataList extends React.Component<DataListProps, DataListState> {
        private pageIndex;
        private status;
        element: HTMLElement;
        constructor(props: any);
        loadData(): void;
        reset(): void;
        componentDidMount(): void;
        createDataItem(data: any, index: number): JSX.Element;
        render(): JSX.Element;
    }
}
declare namespace controls {
    interface DialogProps extends React.Props<Dialog> {
        footer?: JSX.Element;
        content?: string;
    }
    interface DialogState {
        content?: string;
    }
    class Dialog extends React.Component<DialogProps, DialogState> {
        private animateTime;
        private element;
        private dialogElement;
        constructor(props: any);
        content: string;
        show(): void;
        hide(): void;
        componentDidMount(): void;
        render(): JSX.Element;
    }
    interface ConfirmDialogProps extends React.Props<ConfirmDialog> {
        content?: string;
    }
    class ConfirmDialog extends React.Component<ConfirmDialogProps, {}> {
        private cancel;
        private ok;
        private dialog;
        constructor(props: any);
        show(): Promise<{}>;
        hide(): void;
        render(): JSX.Element;
    }
}
declare namespace controls {
    class HtmlView extends React.Component<{
        content: string;
        imageText?: string;
        className?: string;
    }, {}> {
        componentDidMount(): void;
        render(): JSX.Element;
    }
}
declare namespace controls {
    let imageBoxConfig: {
        imageBaseUrl: string;
        imageDisaplyText: string;
    };
    /** 加载图片到 HTMLImageElement */
    function loadImage(element: HTMLImageElement, imageUrl: string, imageText?: string): Promise<string>;
    class ImageBox extends React.Component<React.Props<ImageBox> & {
        src: string;
        className?: string;
        style?: React.CSSProperties;
        text?: string;
        onChange?: (base64Data: string) => void;
    }, {
        src: string;
    }> {
        private unmount;
        constructor(props: any);
        componentWillUnmount(): void;
        render(): JSX.Element;
    }
}
declare namespace controls {
    type IndicatorStatus = 'init' | 'ready';
    interface IndicatorProps {
        initText?: string;
        readyText?: string;
        distance?: number;
    }
    class PullUpIndicator extends React.Component<IndicatorProps & React.Props<PullUpIndicator>, {}> {
        private element;
        private initElement;
        private readyElement;
        private _status;
        constructor(props: IndicatorProps);
        status: IndicatorStatus;
        componentDidMount(): void;
        private readonly onBottom;
        render(): JSX.Element;
    }
    class PullDownIndicator extends React.Component<IndicatorProps & React.Props<PullDownIndicator>, {}> {
        private element;
        private initElement;
        private readyElement;
        private _status;
        constructor(props: IndicatorProps);
        status: IndicatorStatus;
        componentDidMount(): void;
        private readonly onTop;
        render(): JSX.Element;
    }
}
declare namespace controls {
    class Page extends React.Component<React.Props<Page> & {
        className?: string;
    }, {}> {
        private _element;
        constructor(props: any);
        readonly element: HTMLElement;
        render(): JSX.Element;
    }
    class PageComponent extends Page {
    }
    class PageHeader extends React.Component<React.Props<PageHeader> & {
        style?: React.CSSProperties;
    }, {}> {
        static tagName: string;
        element: HTMLElement;
        render(): JSX.Element;
    }
    class PageFooter extends React.Component<React.Props<PageHeader> & {
        style?: React.CSSProperties;
    }, {}> {
        static tagName: string;
        element: HTMLElement;
        render(): JSX.Element;
    }
    interface PageViewProps extends React.Props<PageView> {
        className?: string;
        style?: React.CSSProperties;
        pullDownIndicator?: {
            initText: string;
            readyText: string;
            distance?: number;
            onRelease?: () => void;
        };
        pullUpIndicator?: {
            initText: string;
            readyText: string;
            distance?: number;
            onRelease?: () => void;
        };
    }
    /** 是否为安卓系统 */
    class PageView extends React.Component<PageViewProps, {}> {
        private pullDownIndicator;
        private pullUpIndicator;
        static tagName: string;
        element: HTMLElement;
        iosAppComponentDidMount(): void;
        protected componentDidMount(): void;
        private onRelease(action);
        resetPosition(): void;
        slide(direction: 'up' | 'down' | 'origin'): void;
        render(): JSX.Element;
    }
}
declare namespace controls {
    interface PanelProps extends React.Props<Panel> {
        header?: JSX.Element;
        body?: JSX.Element;
        footer?: JSX.Element;
    }
    class Panel extends React.Component<PanelProps, {}> {
        private panel;
        private modalDialog;
        private header;
        private body;
        private footer;
        private modal;
        private backdrop;
        constructor(props: any);
        readonly element: HTMLElement;
        show(from: 'left' | 'right' | 'top' | 'bottom'): void;
        hide(): void;
        protected componentDidMount(): void;
        render(): JSX.Element;
        render1(): JSX.Element;
    }
}
declare namespace controls {
    interface TabsProps extends React.Props<Tabs> {
        scroller?: () => HTMLElement;
        onItemClick?: (index: number) => void;
        className?: string;
        defaultActiveIndex?: number;
    }
    class Tabs extends React.Component<TabsProps, {
        activeIndex: number;
    }> {
        private element;
        constructor(props: any);
        protected componentDidMount(): void;
        private activeItem(index);
        render(): JSX.Element;
    }
}

define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Tabs extends React.Component {
        constructor(props) {
            super(props);
            this.state = { activeIndex: this.props.defaultActiveIndex || 0 };
        }
        componentDidMount() {
            setTimeout(() => {
                let scroller;
                if (this.props.scroller != null) {
                    scroller = this.props.scroller();
                }
                if (scroller == null) {
                    return;
                }
                let scrollTop;
                scroller.addEventListener('scroll', (event) => {
                    if (scrollTop == null) {
                        scrollTop = scroller.scrollTop;
                        return;
                    }
                    if (scroller.scrollTop - scrollTop > 0) {
                        if (scroller.scrollTop > 100)
                            this.element.style.top = '0px';
                    }
                    else {
                        this.element.style.removeProperty('top');
                    }
                    scrollTop = scroller.scrollTop;
                });
            }, 500);
        }
        activeItem(index) {
            this.state.activeIndex = index;
            this.setState(this.state);
            if (this.props.onItemClick) {
                this.props.onItemClick(index);
            }
        }
        render() {
            let children = getChildren(this.props);
            let itemWidth = 100 / children.length;
            return (h("ul", { ref: (o) => this.element = o, className: this.props.className, style: { transition: '0.4s' } }, children.map((o, i) => (h("li", { key: i, onClick: () => this.activeItem(i), className: i == this.state.activeIndex ? 'active' : '', style: { width: `${itemWidth}%` } }, (o))))));
        }
    }
    exports.Tabs = Tabs;
    function getChildren(props) {
        props = props || {};
        let children = [];
        if (props.children instanceof Array) {
            children = props.children;
        }
        else if (props['children'] != null) {
            children = [props['children']];
        }
        return children;
    }
    exports.getChildren = getChildren;
});
// } 

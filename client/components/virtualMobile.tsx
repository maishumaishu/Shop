import { Control } from 'components/common';
requirejs(['css!lib/devices.css']);

interface Props extends React.Props<VirtualMobile> {
    scale?: number,
    color?: string,
}
export class VirtualMobile extends React.Component<Props, {}>{
    private _screenElement: HTMLElement;
    constructor(props) {
        super(props);
    }

    get screenElement() {
        return this._screenElement;
    }

    render() {
        let children = React.Children.toArray(this.props.children) || [];
        let scale = this.props.scale != null ? this.props.scale : 1;
        let color = this.props.color ? this.props.color : 'blue';
        return (
            <div className={`marvel-device iphone5c ${color}`} style={{ transform: `scale(${scale})` }}>
                <div className="top-bar"></div>
                <div className="sleep"></div>
                <div className="volume"></div>
                <div className="camera"></div>
                <div className="sensor"></div>
                <div className="speaker"></div>
                <div className="screen"
                    ref={(e: HTMLElement) => {
                        if (!e) return;
                        this._screenElement = e;
                    }}>
                    {children}
                </div>
                <div className="home"></div>
                <div className="bottom-bar"></div>
            </div>
        );
    }


}
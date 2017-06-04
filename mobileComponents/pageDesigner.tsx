import { PageData } from 'services/Station';
requirejs(['../scripts/css!../content/devices.css']);
export class PageDesiger extends React.Component<{}, { pageData: PageData }>{
    mobilePageFrame: HTMLFrameElement;
    constructor(props) {
        super(props);
    }
    render() {
        let pageData = this.state.pageData || {};
        let data = JSON.stringify(pageData);
        return (
            <div>
                <div className="pull-left">
                    <div className="marvel-device iphone5c blue">
                        <div className="top-bar"></div>
                        <div className="sleep"></div>
                        <div className="volume"></div>
                        <div className="camera"></div>
                        <div className="sensor"></div>
                        <div className="speaker"></div>
                        <div className="screen" style={{ backgroundColor: 'white' }}>
                            {/*<iframe src={`mobilePage.html#${pageData}`} style={{ border: 'none' }}>
                            </iframe>*/}
                            
                        </div>
                        <div className="home"></div>
                        <div className="bottom-bar"></div>
                    </div>

                </div>
                <div className="pull-right">
                </div>
            </div>
        );
    }
}
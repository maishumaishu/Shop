import { PageData } from 'services/Station';
class MobilePage extends React.Component<{}, { pageData: PageData }>{
    constructor() {
        super();
        document.addEventListener('hashchange', () => {
            let str = (document.location.hash || '').substr(1);
            if (str) {
                this.state.pageData = JSON.parse(str);
                this.setState(this.state);
            }
        })
    }
    render() {

    }
}


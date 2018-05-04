import { ShoppingService } from "user/services/shoppingService";
import { app } from "user/application";
import { defaultNavBar } from "user/site";
import { INPUT_START } from "hammer";

interface RegiosPageState {
    title: string, cities: Region[], countries: Region[], provinces: Region[],
    activeIndex: number

    // currentProvince: Region, currentCity: Region,
    // currentCounty: Region,
    currentProvince?: Region, currentCity?: Region, currentCounty?: Region,
    elementPage?: chitu.Page,
    onSelecteRegion?: (province, city, county) => void;
}

interface RegiosPageProps extends React.Props<RegionSelector> {
    // provinces: Region[], 
    // shop: ShoppingService,
    pageElement: HTMLElement,

}

type SelectedRegions = { province: Region, city: Region, county: Region };

export class RegionSelector extends React.Component<RegiosPageProps, RegiosPageState>
{
    private callback: (regions: { province: Region; city: Region; county: Region; }) => void;
    // element: HTMLElement;
    shop: ShoppingService;
    private provincesView: HTMLElement;
    private citiesView: HTMLElement;
    private countriesView: HTMLElement;
    private views: HTMLElement[];
    private activeViewIndex: number = 0;
    private viewsCount = 3;

    constructor(props) {
        super(props);
        this.state = {
            title: '请选择省', cities: [], countries: [], provinces: [],
            activeIndex: 0,
        };

        // this.shop = this.props.elementPage.createService(ShoppingService);
        // this.shop.provinces().then(items => {
        //     this.state.provinces = items;
        //     this.setState(this.state);
        // })
    }
    private showCities(province: Region) {
        this.state.currentProvince = province;
        this.state.title = '请选择市'
        this.shop.cities(province.Id).then(cities => {
            this.state.cities = cities;
            this.setState(this.state);
        })
        this.showNextView();
    }
    private showCountries(city: Region) {
        this.state.currentCity = city;
        this.state.title = '请选择县'
        this.shop.counties(city.Id).then(counties => {
            this.state.countries = counties;
            this.setState(this.state);
        });
        this.showNextView();
    }
    private showPrevView() {
        let activeIndex = this.state.activeIndex - 1;
        if (activeIndex < 0)
            return;

        this.state.activeIndex = activeIndex;
        this.setState(this.state);
    }
    private showNextView() {
        let activeIndex = this.state.activeIndex + 1;
        if (activeIndex > this.viewsCount - 1)
            return;

        this.state.activeIndex = activeIndex;
        this.setState(this.state);
        let { protocol, host, pathname, search } = location;
        let url = `${protocol}//${host}${pathname}${search}#user_regions?activeIndex=` + activeIndex;
    }
    private selectCounty(county: Region) {
        this.state.currentCounty = county;
        this.setState(this.state);

        let { currentProvince, currentCity, currentCounty } = this.state;
        this.callback({ province: currentProvince, city: currentCity, county: currentCounty });
        this._hide();
    }
    static show(page: chitu.Page, regions: SelectedRegions, callback: (regions: SelectedRegions) => void) {
        let shop = page.createService(ShoppingService);
        shop.provinces().then(items => {
            instance.state.provinces = items;
            instance.setState(instance.state);
        })

        instance.shop = shop;
        instance.callback = callback;
        instance.props.pageElement.style.removeProperty('display');

        let topPadding = page.element.className.indexOf('topbar-padding') >= 0;
        let className = `mobile-page ${topPadding ? 'topbar-padding' : ''}`;
        instance.props.pageElement.className = className;
        instance.state.currentProvince = regions.province;
        instance.state.currentCity = regions.city;
        instance.state.currentCounty = regions.county;
        instance.setState(instance.state);

        // history.pushState("skip", "", 'user_regions');
    }
    private _hide() {
        this.props.pageElement.style.display = 'none';
    }
    static hide() {
        instance._hide();
    }
    componentDidMount() {
        this.views = [this.provincesView, this.citiesView, this.countriesView];
    }
    render() {
        let provinces = this.state.provinces;
        let cities = this.state.cities;
        let countries = this.state.countries;
        let province = this.state.currentProvince;
        let city = this.state.currentCity;
        let county = this.state.currentCounty;
        let activeIndex = this.state.activeIndex;

        return [
            <header key="header">
                {defaultNavBar(this.props.pageElement, { title: this.state.title })} */}
                </header>,
            <footer key="footer">
                <div className="container">
                    <div className="form-group">
                        <button className="btn btn-primary btn-block" disabled={activeIndex <= 0}
                            onClick={() => this.showPrevView()}>上一步</button>
                    </div>
                </div>
            </footer>,
            <section key="view1" ref={(o: HTMLElement) => this.provincesView = o}
                style={{ transform: `translateX(${0 - activeIndex * 100}%)`, paddingBottom: 60 }}>
                <ul className="list-group">
                    {provinces.map(o =>
                        <li className="list-group-item" key={o.Id}
                            onClick={() => this.showCities(o)}>
                            {o.Name}
                            {province != null && province.Id == o.Id ? <i className="icon-ok pull-right"></i> : null}
                        </li>
                    )}
                </ul>
            </section>,
            <section key="view2" ref={(o: HTMLElement) => this.citiesView = o}
                style={{ transform: `translateX(${100 - activeIndex * 100}%)`, paddingBottom: 60 }}>
                <ul className="list-group">
                    {cities.map(o =>
                        <li className="list-group-item" key={o.Id}
                            onClick={() => this.showCountries(o)}>
                            {o.Name}
                            {city != null && city.Id == o.Id ? <i className="icon-ok pull-right"></i> : null}
                        </li>
                    )}
                </ul>
            </section>,
            <section key="view3" ref={(o: HTMLElement) => this.countriesView = o}
                style={{ transform: `translateX(${200 - activeIndex * 100}%)`, paddingBottom: 60 }}>
                <ul className="list-group">
                    {countries.map(o =>
                        <li className="list-group-item" key={o.Id}
                            onClick={() => this.selectCounty(o)}>
                            {o.Name}
                            {county != null && county.Id == o.Id ? <i className="icon-ok pull-right"></i> : null}
                        </li>
                    )}
                </ul>
            </section>
        ]
    }
}

let element = document.createElement('article');
element.style.paddingBottom = '60px';
element.style.display = 'none';
element.style.zIndex = `1000`;
document.body.appendChild(element);
var instance: RegionSelector;
ReactDOM.render(<RegionSelector ref={(e) => instance = e || e} pageElement={element} />, element);
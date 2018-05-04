import { defaultNavBar, app } from 'user/site';
import { ShoppingService } from 'user/services/shoppingService';

export interface RegionsPageRouteValues {
    // province: Region,
    // city: Region,
    // county: Region,
    selecteRegion: (province: Region, city: Region, county: Region) => void,
    cityId: string,
    cityName: string,
    countyId: string,
    countyName: string,
    provinceId: string,
    provinceName: string,
}
export default async function (page: chitu.Page) {
    
    let shop = page.createService(ShoppingService);
    let routeValues = (page.data || {}) as RegionsPageRouteValues;
    let { cityId, cityName, provinceId, provinceName, countyId, countyName } = routeValues;
    let province: Region = { Id: provinceId, Name: provinceName };
    let city: Region = { Id: cityId, Name: cityName };
    let county: Region = { Id: countyId, Name: countyName };

    let provinces = await shop.provinces();
    let regionsPage: RegionsPage;
    ReactDOM.render(<RegionsPage provinces={provinces} shop={shop}
        currentProvince={province} currentCity={city} currentCounty={county}
        ref={e => regionsPage = e || regionsPage} elementPage={page} />, page.element,
        () => {
            if (regionsPage != null)
                regionsPage.onSelecteRegion = routeValues.selecteRegion;
        });

    page.showing.add((sender) => {
        let routeValues = sender.data as RegionsPageRouteValues;

        let { cityId, cityName, provinceId, provinceName, countyId, countyName } = routeValues;
        let province: Region = { Id: provinceId, Name: provinceName };
        let city: Region = { Id: cityId, Name: cityName };
        let county: Region = { Id: countyId, Name: countyName };

        regionsPage.state.currentCity = city;
        regionsPage.state.currentCounty = county;
        regionsPage.state.currentProvince = province;
        regionsPage.state.cities = [];
        regionsPage.state.countries = [];
        regionsPage.state.activeIndex = 0;
        regionsPage.setState(regionsPage.state);

        regionsPage.onSelecteRegion = routeValues.selecteRegion;
    })

}

interface RegiosPageState {
    title: string, cities: Region[], countries: Region[],
    currentProvince?: Region, currentCity?: Region, currentCounty?: Region,
    activeIndex: number
}

interface RegiosPageProps extends React.Props<RegionsPage> {
    provinces: Region[], shop: ShoppingService,
    currentProvince?: Region, currentCity?: Region,
    currentCounty?: Region,
    elementPage: chitu.Page
}



class RegionsPage extends React.Component<RegiosPageProps, RegiosPageState>
{
    private provincesView: HTMLElement;
    private citiesView: HTMLElement;
    private countriesView: HTMLElement;
    private views: HTMLElement[];
    private activeViewIndex: number = 0;
    private viewsCount = 3;

    onSelecteRegion: (province, city, county) => void;

    constructor(props) {
        super(props);
        let { currentProvince, currentCity, currentCounty } = this.props;
        this.state = {
            title: '请选择省', cities: [], countries: [],
            currentProvince, currentCity,
            currentCounty, activeIndex: 0
        };

        // window.addEventListener('popstate', this.onBack)
    }
    private onBack = () => {
        var page = app.currentPage;
        if (page.name == "user.regions") {
            this.showPrevView();
        }
    }
    showCities(province: Region) {
        this.state.currentProvince = province;
        this.state.title = '请选择市'
        this.props.shop.cities(province.Id).then(cities => {
            this.state.cities = cities;
            this.setState(this.state);
        })
        this.showNextView();
    }
    showCountries(city: Region) {
        this.state.currentCity = city;
        this.state.title = '请选择县'
        this.props.shop.counties(city.Id).then(counties => {
            this.state.countries = counties;
            this.setState(this.state);
        });
        this.showNextView();
    }
    componentDidMount() {
        this.views = [this.provincesView, this.citiesView, this.countriesView];
    }
    showPrevView() {
        let activeIndex = this.state.activeIndex - 1;
        if (activeIndex < 0)
            return;

        this.state.activeIndex = activeIndex;
        this.setState(this.state);
    }
    showNextView() {
        let activeIndex = this.state.activeIndex + 1;
        if (activeIndex > this.viewsCount - 1)
            return;

        this.state.activeIndex = activeIndex;
        this.setState(this.state);
        let { protocol, host, pathname, search } = location;
        let url = `${protocol}//${host}${pathname}${search}#user_regions?activeIndex=` + activeIndex;
    }
    selectCounty(county: Region) {
        this.state.currentCounty = county;
        this.setState(this.state);
        if (!this.onSelecteRegion) {
            return;
        }

        // history.go(-3);
        let { currentProvince, currentCity, currentCounty } = this.state;
        this.onSelecteRegion(currentProvince, currentCity, currentCounty);
        app.back();
    }
    render() {
        let provinces = this.props.provinces;
        let cities = this.state.cities;
        let countries = this.state.countries;
        let province = this.state.currentProvince;
        let city = this.state.currentCity;
        let county = this.state.currentCounty;
        let activeIndex = this.state.activeIndex;
        return (
            <div>
                <header>
                    {defaultNavBar(this.props.elementPage, { title: this.state.title })}
                </header>
                <footer>
                    <div className="container">
                        <div className="form-group">
                            <button className="btn btn-primary btn-block" disabled={activeIndex <= 0}
                                onClick={() => this.showPrevView()}>上一步</button>
                        </div>
                    </div>
                </footer>
                <section ref={(o: HTMLElement) => this.provincesView = o}
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
                </section>
                <section ref={(o: HTMLElement) => this.citiesView = o}
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
                </section>
                <section ref={(o: HTMLElement) => this.countriesView = o}
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
            </div>
        );
    }
}
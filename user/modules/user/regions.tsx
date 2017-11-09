import { defaultNavBar, app } from 'site';
import { ShoppingService } from 'userServices/shoppingService';

export interface RegionsPageRouteValues {
    province: Region,
    city: Region,
    country: Region,
    selecteRegion: (province: Region, city: Region, country: Region) => void
}
export default function (page: chitu.Page) {
    let shop = page.createService(ShoppingService);
    let routeValues = (page.routeData.values || {}) as RegionsPageRouteValues;
    interface RegiosPageState {
        title: string, cities: Region[], countries: Region[],
        currentProvince?: Region, currentCity?: Region, currentCountry?: Region
    }

    class RegiosPage extends React.Component<{ provinces: Region[] }, RegiosPageState>
    {
        private provincesView: HTMLElement;
        private citiesView: HTMLElement;
        private countriesView: HTMLElement;
        private views: HTMLElement[];
        private activeViewIndex: number = 0;

        constructor(props) {
            super(props);
            this.state = {
                title: '请选择省', cities: [], countries: [],
                currentProvince: routeValues.province, currentCity: routeValues.city,
                currentCountry: routeValues.country
            };
        }
        showCities(province: Region) {
            this.state.currentProvince = province;
            this.state.title = '请选择市'
            shop.cities(province.Id).then(cities => {
                this.state.cities = cities;
                this.setState(this.state);
            })
            this.showNextView();
        }
        showCountries(city: Region) {
            this.state.currentCity = city;
            this.state.title = '请选择县'
            shop.counties(city.Id).then(counties => {
                this.state.countries = counties;
                this.setState(this.state);
            });
            this.showNextView();
        }
        back() {
            if (this.activeViewIndex == 0) {
                app.back();
                return;
            }
            this.showPrevView();
        }
        componentDidMount() {
            this.views = [this.provincesView, this.citiesView, this.countriesView];
        }
        showPrevView() {
            let activeView = this.views[this.activeViewIndex];
            let prevView = this.views[this.activeViewIndex - 1];
            if (prevView == null) {
                return;
            }

            prevView.style.transform = 'translateX(-100%)';
            setTimeout(() => {
                activeView.style.transition = '0.4s';
                activeView.style.transform = 'translateX(100%)';
                prevView.style.transition = '0.4s';
                prevView.style.transform = 'translateX(0)';
            }, 100);

            this.activeViewIndex = this.activeViewIndex - 1;
        }
        showNextView() {
            let activeView = this.views[this.activeViewIndex];
            let nextView = this.views[this.activeViewIndex + 1];
            if (nextView == null) {
                return;
            }

            nextView.style.transform = 'translateX(100%)';
            setTimeout(() => {
                activeView.style.transition = '0.4s';
                activeView.style.transform = 'translateX(-100%)';
                nextView.style.transition = '0.4s';
                nextView.style.transform = 'translateX(0)';
            }, 100);
            this.activeViewIndex = this.activeViewIndex + 1;
        }
        selectCountry(country: Region) {
            this.state.currentCountry = country;
            this.setState(this.state);
            if (!routeValues.selecteRegion) {
                return;
            }

            let { currentProvince, currentCity, currentCountry } = this.state;
            routeValues.selecteRegion(currentProvince, currentCity, currentCountry);
            app.back();
        }
        render() {
            let provinces = this.props.provinces;
            let cities = this.state.cities;
            let countries = this.state.countries;
            let province = this.state.currentProvince;
            return [
                <header key="h">
                    {defaultNavBar({ title: this.state.title, back: () => this.back() })}
                </header>,
                <section key="v1" ref={o => this.provincesView = o as HTMLElement}>
                    <ul className="list-group">
                        {provinces.map(o =>
                            <li className="list-group-item" key={o.Id}
                                onClick={() => this.showCities(o)}>
                                {o.Name}
                                {this.state.currentProvince.Id == o.Id ? <i className="icon-ok pull-right"></i> : null}
                            </li>
                        )}
                    </ul>
                </section>,
                <section key="v2" ref={o => this.citiesView = o as HTMLElement} style={{ transform: 'translateX(100%)' }}>
                    <ul className="list-group">
                        {cities.map(o =>
                            <li className="list-group-item" key={o.Id}
                                onClick={() => this.showCountries(o)}>
                                {o.Name}
                                {this.state.currentCity.Id == o.Id ? <i className="icon-ok pull-right"></i> : null}
                            </li>
                        )}
                    </ul>
                </section>,
                <section key="v3" ref={o => this.countriesView = o as HTMLElement} style={{ transform: 'translateX(200%)' }}>
                    <ul className="list-group">
                        {countries.map(o =>
                            <li className="list-group-item" key={o.Id}
                                onClick={() => this.selectCountry(o)}>
                                {o.Name}
                                {this.state.currentCountry.Id == o.Id ? <i className="icon-ok pull-right"></i> : null}
                            </li>
                        )}
                    </ul>
                </section>
            ]
        }
    }

    shop.provinces().then((regons) => {
        ReactDOM.render(<RegiosPage provinces={regons} />, page.element);
    })

} 
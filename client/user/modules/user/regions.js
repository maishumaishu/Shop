var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "user/site", "user/services/shoppingService"], function (require, exports, site_1, shoppingService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        return __awaiter(this, void 0, void 0, function* () {
            let shop = page.createService(shoppingService_1.ShoppingService);
            let routeValues = (page.data || {});
            let { cityId, cityName, provinceId, provinceName, countyId, countyName } = routeValues;
            let province = { Id: provinceId, Name: provinceName };
            let city = { Id: cityId, Name: cityName };
            let county = { Id: countyId, Name: countyName };
            let provinces = yield shop.provinces();
            let regionsPage;
            ReactDOM.render(h(RegionsPage, { provinces: provinces, shop: shop, currentProvince: province, currentCity: city, currentCounty: county, ref: e => regionsPage = e || regionsPage, elementPage: page }), page.element, () => {
                if (regionsPage != null)
                    regionsPage.onSelecteRegion = routeValues.selecteRegion;
            });
            page.showing.add((sender) => {
                let routeValues = sender.data;
                let { cityId, cityName, provinceId, provinceName, countyId, countyName } = routeValues;
                let province = { Id: provinceId, Name: provinceName };
                let city = { Id: cityId, Name: cityName };
                let county = { Id: countyId, Name: countyName };
                regionsPage.state.currentCity = city;
                regionsPage.state.currentCounty = county;
                regionsPage.state.currentProvince = province;
                regionsPage.state.cities = [];
                regionsPage.state.countries = [];
                regionsPage.state.activeIndex = 0;
                regionsPage.setState(regionsPage.state);
                regionsPage.onSelecteRegion = routeValues.selecteRegion;
            });
        });
    }
    exports.default = default_1;
    class RegionsPage extends React.Component {
        constructor(props) {
            super(props);
            this.activeViewIndex = 0;
            this.viewsCount = 3;
            this.onBack = () => {
                var page = site_1.app.currentPage;
                if (page.name == "user.regions") {
                    this.showPrevView();
                }
            };
            let { currentProvince, currentCity, currentCounty } = this.props;
            this.state = {
                title: '请选择省', cities: [], countries: [],
                currentProvince, currentCity,
                currentCounty, activeIndex: 0
            };
            // window.addEventListener('popstate', this.onBack)
        }
        showCities(province) {
            this.state.currentProvince = province;
            this.state.title = '请选择市';
            this.props.shop.cities(province.Id).then(cities => {
                this.state.cities = cities;
                this.setState(this.state);
            });
            this.showNextView();
        }
        showCountries(city) {
            this.state.currentCity = city;
            this.state.title = '请选择县';
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
        selectCounty(county) {
            this.state.currentCounty = county;
            this.setState(this.state);
            if (!this.onSelecteRegion) {
                return;
            }
            // history.go(-3);
            let { currentProvince, currentCity, currentCounty } = this.state;
            this.onSelecteRegion(currentProvince, currentCity, currentCounty);
            site_1.app.back();
        }
        render() {
            let provinces = this.props.provinces;
            let cities = this.state.cities;
            let countries = this.state.countries;
            let province = this.state.currentProvince;
            let city = this.state.currentCity;
            let county = this.state.currentCounty;
            let activeIndex = this.state.activeIndex;
            return (h("div", null,
                h("header", null, site_1.defaultNavBar(this.props.elementPage, { title: this.state.title })),
                h("footer", null,
                    h("div", { className: "container" },
                        h("div", { className: "form-group" },
                            h("button", { className: "btn btn-primary btn-block", disabled: activeIndex <= 0, onClick: () => this.showPrevView() }, "\u4E0A\u4E00\u6B65")))),
                h("section", { ref: (o) => this.provincesView = o, style: { transform: `translateX(${0 - activeIndex * 100}%)`, paddingBottom: 60 } },
                    h("ul", { className: "list-group" }, provinces.map(o => h("li", { className: "list-group-item", key: o.Id, onClick: () => this.showCities(o) },
                        o.Name,
                        province != null && province.Id == o.Id ? h("i", { className: "icon-ok pull-right" }) : null)))),
                h("section", { ref: (o) => this.citiesView = o, style: { transform: `translateX(${100 - activeIndex * 100}%)`, paddingBottom: 60 } },
                    h("ul", { className: "list-group" }, cities.map(o => h("li", { className: "list-group-item", key: o.Id, onClick: () => this.showCountries(o) },
                        o.Name,
                        city != null && city.Id == o.Id ? h("i", { className: "icon-ok pull-right" }) : null)))),
                h("section", { ref: (o) => this.countriesView = o, style: { transform: `translateX(${200 - activeIndex * 100}%)`, paddingBottom: 60 } },
                    h("ul", { className: "list-group" }, countries.map(o => h("li", { className: "list-group-item", key: o.Id, onClick: () => this.selectCounty(o) },
                        o.Name,
                        county != null && county.Id == o.Id ? h("i", { className: "icon-ok pull-right" }) : null))))));
        }
    }
});

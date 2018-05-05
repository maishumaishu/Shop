define(["require", "exports", "user/services/shoppingService", "user/site"], function (require, exports, shoppingService_1, site_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class RegionSelector extends React.Component {
        constructor(props) {
            super(props);
            this.activeViewIndex = 0;
            this.viewsCount = 3;
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
        showCities(province) {
            this.state.currentProvince = province;
            this.state.title = '请选择市';
            this.shop.cities(province.Id).then(cities => {
                this.state.cities = cities;
                this.setState(this.state);
            });
            this.showNextView();
        }
        showCountries(city) {
            this.state.currentCity = city;
            this.state.title = '请选择县';
            this.shop.counties(city.Id).then(counties => {
                this.state.countries = counties;
                this.setState(this.state);
            });
            this.showNextView();
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
            let { currentProvince, currentCity, currentCounty } = this.state;
            this.callback({ province: currentProvince, city: currentCity, county: currentCounty });
            this._hide();
        }
        static show(page, regions, callback) {
            let shop = page.createService(shoppingService_1.ShoppingService);
            shop.provinces().then(items => {
                instance.state.provinces = items;
                instance.setState(instance.state);
            });
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
        _hide() {
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
                h("header", { key: "header" },
                    site_1.defaultNavBar(this.props.pageElement, { title: this.state.title }),
                    " */}"),
                h("footer", { key: "footer" },
                    h("div", { className: "container" },
                        h("div", { className: "form-group" },
                            h("button", { className: "btn btn-primary btn-block", disabled: activeIndex <= 0, onClick: () => this.showPrevView() }, "\u4E0A\u4E00\u6B65")))),
                h("section", { key: "view1", ref: (o) => this.provincesView = o, style: { transform: `translateX(${0 - activeIndex * 100}%)`, paddingBottom: 60 } },
                    h("ul", { className: "list-group" }, provinces.map(o => h("li", { className: "list-group-item", key: o.Id, onClick: () => this.showCities(o) },
                        o.Name,
                        province != null && province.Id == o.Id ? h("i", { className: "icon-ok pull-right" }) : null)))),
                h("section", { key: "view2", ref: (o) => this.citiesView = o, style: { transform: `translateX(${100 - activeIndex * 100}%)`, paddingBottom: 60 } },
                    h("ul", { className: "list-group" }, cities.map(o => h("li", { className: "list-group-item", key: o.Id, onClick: () => this.showCountries(o) },
                        o.Name,
                        city != null && city.Id == o.Id ? h("i", { className: "icon-ok pull-right" }) : null)))),
                h("section", { key: "view3", ref: (o) => this.countriesView = o, style: { transform: `translateX(${200 - activeIndex * 100}%)`, paddingBottom: 60 } },
                    h("ul", { className: "list-group" }, countries.map(o => h("li", { className: "list-group-item", key: o.Id, onClick: () => this.selectCounty(o) },
                        o.Name,
                        county != null && county.Id == o.Id ? h("i", { className: "icon-ok pull-right" }) : null))))
            ];
        }
    }
    exports.RegionSelector = RegionSelector;
    let element = document.createElement('article');
    element.style.paddingBottom = '60px';
    element.style.display = 'none';
    element.style.zIndex = `1000`;
    document.body.appendChild(element);
    var instance;
    ReactDOM.render(h(RegionSelector, { ref: (e) => instance = e || e, pageElement: element }), element);
});

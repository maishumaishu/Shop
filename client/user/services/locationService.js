define(["require", "exports", "user/services/service"], function (require, exports, service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class LocationService extends service_1.Service {
        constructor() {
            super(...arguments);
            this.getLocation = (data) => {
                return this.getByJson("http://restapi.amap.com/v3/ip", data).then(function (result) {
                    return result;
                });
            };
            this.getProvinces = () => {
                return this.getByJson(this.url('Address/GetProvinces')).then(function (result) {
                    return result;
                });
            };
            this.getCities = (provinceId) => {
                return this.getByJson(this.url('Address/GetCities'), { provinceId: provinceId }).then((result) => {
                    return result;
                });
            };
            this.getProvincesAndCities = () => {
                return this.getByJson(this.url('Address/GetProvinces'), { includeCities: true }).then(function (result) {
                    return result;
                });
            };
        }
        url(path) {
            return `UserShop/${path}`;
        }
    }
    exports.LocationService = LocationService;
});

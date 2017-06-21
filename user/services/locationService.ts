namespace userServices {
    export interface Provinces {
        Id: string,
        Name: string
        Cities: Array<Cities>
    }
    export interface Cities {
        Id: string,
        Name: string,
    }
    export class LocationService extends Service {
        private url(path: string) {
            return `${config.service.shop}${path}`;
        }

        getLocation = (data) => {
            return this.get<Provinces[]>("http://restapi.amap.com/v3/ip", data).then(function (result) {
                return result;
            });
        }
        getProvinces = () => {
            return this.get<Provinces[]>(this.url('Address/GetProvinces')).then(function (result) {
                return result;
            });
        }

        getCities = (provinceId) => {
            return this.get<Cities[]>(this.url('Address/GetCities'), { provinceId: provinceId }).then((result) => {
                return result;
            });
        }

        getProvincesAndCities = () => {
            return this.get<any>(this.url('Address/GetProvinces'), { includeCities: true }).then(function (result) {
                return result;
            });
        }
    }
}
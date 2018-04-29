import { Service, config } from 'user/services/service';


export class LocationService extends Service {
    private url(path: string) {
        return `UserShop/${path}`;
    }

    getLocation = (data) => {
        return this.getByJson<Province[]>("http://restapi.amap.com/v3/ip", data).then(function (result) {
            return result;
        });
    }
    getProvinces = () => {
        return this.getByJson<Province[]>(this.url('Address/GetProvinces')).then(function (result) {
            return result;
        });
    }

    getCities = (provinceId) => {
        return this.getByJson<Citie[]>(this.url('Address/GetCities'), { provinceId: provinceId }).then((result) => {
            return result;
        });
    }

    getProvincesAndCities = () => {
        return this.getByJson<any>(this.url('Address/GetProvinces'), { includeCities: true }).then(function (result) {
            return result;
        });
    }
}
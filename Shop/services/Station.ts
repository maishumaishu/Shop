
import Service = require('services/Service');


let JData = window['JData'];

class StationService extends Service {
    homeProduct = new JData.WebDataSource(
        Service.config.siteUrl + 'MicroStationData/Select?source=HomeProducts',
        Service.config.siteUrl + 'MicroStationData/Insert?source=HomeProducts',
        Service.config.siteUrl + 'MicroStationData/Update?source=HomeProducts',
        Service.config.siteUrl + 'MicroStationData/Delete?source=HomeProducts'
    )
}

export = new StationService();
// (function (factory) {
//     var references = ['sv/Services', 'JData'];
//     if (typeof define === 'function' && define.amd) {
//         define(references, factory);
//     } else if (typeof module !== 'undefined' && module.exports) {
//         module.exports = factory(require(references));
//     } else {
//         window.services = factory(jQuery);
//     }

// })(function () {

//     if (arguments.length > 0 && window.service == null) {
//         window.service = arguments[0];
//     }

//     //service.callMethod()
//     services.freight = {};
//     services.freight.freightSolutions = new JData.WebDataSource(
//         site.config.shopUrl + 'ShoppingData/Select?source=FreightSolutions&selection=Id,Name',
//         site.config.shopUrl + 'Freight/AddFreightSolution', //'/ShoppingData/Insert?source=FreightSolutions',
//         site.config.shopUrl + 'ShoppingData/Update?source=FreightSolutions',
//         site.config.shopUrl + 'ShoppingData/Delete?source=FreightSolutions'
//     );

//     services.freight.productFreight = new JData.WebDataSource(
//         site.config.shopUrl + 'ShoppingData/Select?source=ProductFreights&selection=Id,Name,ObjectId,ObjectType,FreightSolution.Name as SolutionName,IsSingle',
//         site.config.shopUrl + 'Freight/AddProductFreight',
//         site.config.shopUrl + 'ShoppingData/Update?source=ProductFreights',
//         site.config.shopUrl + 'ShoppingData/Delete?source=ProductFreights'
//     );


//     return services;
// });

import Services = require('services/Service');
let JData = window['JData'];

class FreightService extends Services {
    freightSolutions = new JData.WebDataSource(
        Services.config.shopUrl + 'ShoppingData/Select?source=FreightSolutions&selection=Id,Name',
        Services.config.shopUrl + 'Freight/AddFreightSolution', //'/ShoppingData/Insert?source=FreightSolutions',
        Services.config.shopUrl + 'ShoppingData/Update?source=FreightSolutions',
        Services.config.shopUrl + 'ShoppingData/Delete?source=FreightSolutions'
    )
    productFreight = new JData.WebDataSource(
        Services.config.shopUrl + 'ShoppingData/Select?source=ProductFreights&selection=Id,Name,ObjectId,ObjectType,FreightSolution.Name as SolutionName,IsSingle',
        Services.config.shopUrl + 'Freight/AddProductFreight',
        Services.config.shopUrl + 'ShoppingData/Update?source=ProductFreights',
        Services.config.shopUrl + 'ShoppingData/Delete?source=ProductFreights'
    );
}

export = new FreightService();


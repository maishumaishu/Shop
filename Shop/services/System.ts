// (function (factory) {
//     var references = ['sv/Services', 'JData'];
//     if (typeof define === 'function') {
//         define(references, factory);
//     } else {
//         factory(services, JData);
//     }

// })(function () {

//services.system = {
//addNotifyUrl: function (type, url) {
//    return services.callMethod('System/AddNotifyUrl', { type: type, url: url });
//},
//deleteNotifyUrl: function (id) {
//    return services.callMethod('System/DeleteNotifyUrl', { id: id });
//},
//getNotifyUrls: function () {
//    return services.callMethod('System/GetNotifyUrls');
//},

// };

// return services;

//});

import Service = require('services/Service');

class SystemService {
    getNotifyTypes() {
        return Service.callMethod('System/GetNotifyTypes');
    }
}

export = new SystemService();
requirejs.config({
    //urlArgs: "bust=5",
    // baseUrl:'paths',
    shim: {
        ui: {
            exports: 'ui',
            deps: ['polyfill']
        },
    },
    baseUrl: '../../',
    paths: {

        react: 'lib/react',
        'react-dom': 'lib/react-dom',

        chitu: 'lib/chitu',
        ui: 'lib/ui',
        polyfill: 'lib/polyfill',
        qrcode: 'lib/qrcode',
        'socket.io': 'http://shopws.bailunmei.com/socket.io/socket.io',
    }
});

// if (location.hash) {
var path = location.hash.substr(1);
var references = ['react', 'react-dom', 'admin/weixin/build'];
requirejs(references, function (React, ReactDOM) {
    window['React'] = React;
    window['ReactDOM'] = ReactDOM;
    window['h'] = React.createElement;

    requirejs(['admin/weixin/application'], function (app) {
        (app.default as chitu.Application).run();
    })
});
//}

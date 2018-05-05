requirejs.config({
    //urlArgs: "bust=5",
    // baseUrl:'paths',
    shim: {
        ui: {
            exports: 'ui',
            deps: ['polyfill']
        },
    },
    paths: {
        'maishu-chitu': '../../scripts/chitu',
        'share': '../../share',
        'react-dom': '../../scripts/react-dom',
        ui: '../../scripts/ui',
        polyfill: '../../scripts/polyfill',
        react: '../../scripts/react',
        services: '../services',
        qrcode: '../../scripts/qrcode',
        weixin: './',
        'socket.io': 'http://shopws.bailunmei.com/socket.io/socket.io',
    }
});
if (location.hash) {
    var path = location.hash.substr(1);
    var references = ['react', 'react-dom'];
    requirejs(references, function (React, ReactDOM) {
        window['React'] = React;
        window['ReactDOM'] = ReactDOM;
        window['h'] = React.createElement;
        requirejs(['application'], function (app) {
            app.default.run();
        });
    });
}

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
        'share/common': '../../share/common',
        'react-dom': '../../scripts/react-dom',

        ui: '../../scripts/ui',
        polyfill: '../../scripts/polyfill',
        react: '../../scripts/react',

        services: '../services',
        userServices: '../../user/services',
        qrcode: '../../scripts/qrcode',
        weixin: './',
        'socket.io': 'http://maishu.alinq.cn:48015/socket.io/socket.io',
    }
});

if (location.hash) {
    var path = location.hash.substr(1);
    var references = ['react', 'react-dom', 'application'];
    requirejs(references, function (React, ReactDOM, app) {
        window['React'] = React;
        window['ReactDOM'] = ReactDOM;
        window['h'] = React.createElement;

        (app.default as chitu.Application).run();
        // let container = document.getElementById('container');
        // objs.default(container);
    });
}

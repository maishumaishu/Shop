requirejs.config({
    shim: {
        dilu: {
            exports: 'dilu'
        },
        fetch: {
            exports: 'fetch'
        },
        'react-dom': {
            deps: ['react'],
            exports: window['ReactDOM'],
            init: function () {
                debugger;
            }
        },
        react: {
            exports: window['React'],
            init: function () {
                debugger;
            }
        },
        controls: {
            deps: ['react-dom', 'react']
        },
        application: {
            deps: ['maishu-chitu']
        },
        mobileControls: {
            exports: 'controls',
            deps: ['hammer', 'bezier-easing', 'react']
        },
        userServices: {
            exports: 'userServices'
        },
        ui: {
            exports: 'ui',
            deps: ['polyfill']
        },
        site: {
            deps: ['react', 'maishu-chitu', 'polyfill']
        },
        'prop-types': {
            deps: ['react']
        },
        'maishu-chitu': {
            deps: ['polyfill']
        }
    },
    baseUrl: '../',
    paths: {
        css: 'lib/css',
        less: 'lib/require-less-0.1.5/less',
        lessc: 'lib/require-less-0.1.5/lessc',
        normalize: 'lib/require-less-0.1.5/normalize',
        text: 'lib/text',
        'art-template': 'lib/template-web',
        'bezier-easing': 'lib/bezier-easing',
        // chitu: 'lib/chitu',
        'maishu-chitu': 'lib/chitu',
        dilu: 'lib/dilu',
        fetch: 'lib/fetch',
        hammer: 'lib/hammer',
        iscroll: 'lib/iscroll-lite',
        react: 'lib/react',
        'react-dom': 'lib/react-dom',
        'chitu.mobile': 'lib/chitu.mobile',
        carousel: 'lib/carousel',
        formValidator: 'lib/formValidator',
        mobileControls: 'lib/mobileControls',
        polyfill: 'lib/polyfill',
        'prop-types': 'lib/prop-types',
        userServices: 'services',
        // services: './services',
        ui: 'lib/ui',
    }
});
requirejs(['user/build'], function () {
    requirejs(["css!user/content/font-awesome"]);
    requirejs(['react', 'react-dom', 'user/application', 'ui', 'prop-types'], function (React, ReactDOM, appExports) {
        window['React'] = React;
        window['ReactDOM'] = ReactDOM;
        window['h'] = React.createElement;
        ui.dialogConfig.dialogContainer = document.getElementById('dialogContainer');
        debugger;
        let app = window["user-app"] = new appExports.Application();
        app.run();
    });
});

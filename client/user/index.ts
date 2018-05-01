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
        'art-template': 'scripts/template-web',
        'bezier-easing': 'scripts/bezier-easing',
        // chitu: 'scripts/chitu',
        'maishu-chitu': 'scripts/chitu',
        css: 'scripts/css',
        dilu: 'scripts/dilu',
        fetch: 'scripts/fetch',
        hammer: 'scripts/hammer',
        iscroll: 'scripts/iscroll-lite',
        react: 'scripts/react',
        'react-dom': 'scripts/react-dom',
        text: 'scripts/text',
        'chitu.mobile': 'scripts/chitu.mobile',
        carousel: 'scripts/carousel',
        formValidator: 'scripts/formValidator',
        mobileControls: 'scripts/mobileControls',
        polyfill: 'scripts/polyfill',
        'prop-types': 'scripts/prop-types',
        userServices: 'services',
        // services: './services',
        ui: 'scripts/ui',
        // user: '.',
        // admin: '../admin',
        // share: '../share',
        // 'share/common': '../share/common',
        // build: 'user/build',
        // site: 'user/site',
    }
});

requirejs(['user/build'], function () {
    requirejs(["css!user/content/font-awesome"]);
    requirejs(['react', 'react-dom', 'user/site', 'ui', 'prop-types'],
        function (React, ReactDOM, site) {
            window['React'] = React;
            window['ReactDOM'] = ReactDOM;
            window['h'] = React.createElement;

            ui.dialogConfig.dialogContainer = document.getElementById('dialogContainer');

            site.app.run();
        })
})

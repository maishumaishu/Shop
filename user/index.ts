requirejs.config({
    shim: {
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
            deps: ['chitu']
        },
        mobileControls: {
            exports: 'controls',
            deps: ['hammer', 'bezier-easing', 'react']
        },
        userServices: {
            exports: 'userServices'
        },
        ui: {
            exports: 'ui'
        },
        site: {
            deps: ['react', 'chitu']
        },
        'prop-types': {
            deps: ['react']
        }
    },
    paths: {
        'bezier-easing': 'scripts/bezier-easing',
        chitu: 'scripts/chitu',
        css: 'scripts/css',
        fetch: 'scripts/fetch',
        hammer: 'scripts/hammer',
        ping: 'scripts/ping',
        react: 'scripts/react',
        'react-dom': 'scripts/react-dom',
        text: 'scripts/text',
        // controls: 'controls',
        'chitu.mobile': 'scripts/chitu.mobile',
        carousel: 'scripts/carousel',
        // mobileComponents: 'pageComponents',
        formValidator: 'scripts/formValidator',
        mobileControls: 'scripts/mobileControls',
        'prop-types': 'scripts/prop-types',

        services: 'userServices',
        ui: 'scripts/ui',
        'user': '.',
    }
});

requirejs(['react', 'react-dom', 'site', 'ui', 'ping', 'prop-types'], function (React, ReactDOM, site) {
    window['React'] = React;
    window['ReactDOM'] = ReactDOM;
    window['h'] = React.createElement;


    ui.setDialogContainer(document.getElementById('dialogContainer'));

    site.app.run();


})

// import * as React from 'react';
// import * as ReactDOM from 'react-dom';
// import 'babel-polyfill';

// import * as chitu from 'maishu-chitu';
// import { app } from 'site';

// // import 'requirejs'
// // import 'require-css';

// window['React'] = React;
// window['ReactDOM'] = ReactDOM;
// window['chitu'] = chitu;

// window['h'] = React.createElement;
// // window['requirejs'] = window['require'];



// app.run();

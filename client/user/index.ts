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
    paths: {
        'bezier-easing': 'scripts/bezier-easing',
        // chitu: 'scripts/chitu',
        'maishu-chitu': 'scripts/chitu',
        css: 'scripts/css',
        dilu: 'scripts/dilu',
        fetch: 'scripts/fetch',
        hammer: 'scripts/hammer',
        react: 'scripts/react',
        'react-dom': 'scripts/react-dom',
        text: 'scripts/text',
        'chitu.mobile': 'scripts/chitu.mobile',
        carousel: 'scripts/carousel',
        formValidator: 'scripts/formValidator',
        mobileControls: 'scripts/mobileControls',
        polyfill: 'scripts/polyfill',
        'prop-types': 'scripts/prop-types',
        userServices: './services',
        // services: './services',
        ui: 'scripts/ui',
        'user': '.'
    }
});


// define('build', function () {

// })

let references1 = ['react', 'react-dom', 'site', 'ui', 'prop-types', 'errorHandle'];
let references2 = ['build']
requirejs(['build'], function () {
    requirejs(["css!content/font-awesome"]);
    requirejs(references1, function (React, ReactDOM, site) {
        window['React'] = React;
        window['ReactDOM'] = ReactDOM;
        window['h'] = React.createElement;

        ui.loadImageConfig.imageDisaplyText = "你好"
        ui.dialogConfig.dialogContainer = document.getElementById('dialogContainer');

        site.app.run();
    })
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

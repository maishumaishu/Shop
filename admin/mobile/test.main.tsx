requirejs.config({
    //urlArgs: "bust=5",
    shim: {
        ace: {
            deps: ['jquery', 'bootstrap']
        },
        bootstrap: {
            deps: ['jquery']
        },
        bootbox: {
            deps: ['bootstrap']
        },
        chitu: {
            deps: ['jquery', 'knockout', 'crossroads']
        },
        custom: {
            deps: ['jquery', 'jquery-ui', 'jquery.cookie', 'JData']
        },
        crossroads: {
            deps: ['jquery']
        },
        knockout: {
            exports: 'ko'
        },
        'ko.ext/knockout.extentions': {
            deps: ['jquery']
        },
        'ko.val': {
            deps: ['knockout.validation'],
            exports: 'ko.validation'
        },
        'ko.map': {
            deps: ['knockout']
        },
        JData: {
            deps: ['MicrosoftAjax.debug', 'jquery-ui']
        },
        'jquery.fileupload': {
            deps: ['scripts/jQuery.FileUpload/jquery.iframe-transport',
                'css!scripts/jQuery.FileUpload/css/jquery.fileupload-ui.css']
        },
        'Site': {
            deps: ['jquery.cookie', 'bootbox']
        },
        'Application': {
            deps: ['chitu']
        }
    },
    paths: {
        ace: '../assets/js/uncompressed/ace',
        bootstrap: '../assets/js/uncompressed/bootstrap',
        bootbox: '../scripts/bootbox',
        chitu: '../scripts/chitu',
        css: '../scripts/css',
        JData: '../scripts/JData',
        jquery: '../scripts/jquery-2.1.3',
        'jquery-ui': '../scripts/jquery-ui',
        'jquery.cookie': '../scripts/jquery.cookie',
        'MicrosoftAjax.debug': '../scripts/MicrosoftAjax.debug',
        react: '../scripts/react',
        'react-dom': '../scripts/react-dom',
        text: 'scripts/text',
        ue: 'ueditor',
        common: '../common',
        mobile: './',
        custom: '../Custom',
        services: '../services'
    }
});
var references = ['react', 'react-dom'];
requirejs(references, function (React, ReactDOM) {
    window['React'] = React;
    window['ReactDOM'] = ReactDOM;
    requirejs(['test'], function () {
     });
});


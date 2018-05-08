requirejs.config({
    //urlArgs: "bust=5",
    shim: {
        ace: {
            deps: ['jquery', 'bootstrap']
        },
        bootstrap: {
            deps: ['jquery']
        },
        dilu: {
            exports: 'dilu'
        },
        application: {
            deps: ['chitu']
        },
        'jquery-ui': {
            exports: 'window["$"]',
            deps: [
                'jquery',
                'css!content/jquery-ui-1.10.0.custom'
            ]
        },
        mobileControls: {
            exports: 'controls',
            deps: ['hammer', 'bezier-easing']
        },
        ui: {
            exports: 'ui'
        },
        um: {
            deps: [
                'jquery',
                'css!../lib/umeditor/themes/default/css/umeditor.css',
                // '../lib/umeditor/third-party/template.min',
                'um_config',
            ]
        },
        um_zh: {
            deps: ['um']
        },
        qrcode: {
            exports: 'QRCode'
        },
        wuzhui: {
            deps: ['jquery']
        }
    },
    baseUrl: '../',
    paths: {
        css: 'lib/css',
        less: 'lib/require-less-0.1.5/less',
        lessc: 'lib/require-less-0.1.5/lessc',
        normalize: 'lib/require-less-0.1.5/normalize',
        text: 'lib/text',
        ace_editor: 'lib/ace-builds/src',
        'art-template': 'lib/template-web',
        bootstrap: 'lib/bootstrap',
        clipboard: 'lib/clipboard.min',
        dilu: 'lib/dilu',
        formValidator: 'lib/formValidator',
        hammer: 'lib/hammer',
        iscroll: 'lib/iscroll-lite',
        jquery: 'lib/jquery-2.1.3',
        react: 'https://cdn.bootcss.com/react/16.0.0/umd/react.development',
        mobileControls: 'lib/mobileControls',
        move: 'lib/move',
        polyfill: 'lib/polyfill',
        polished: 'lib/polished',
        ui: 'lib/ui',
        um: 'lib/umeditor/umeditor',
        um_config: 'lib/umeditor/umeditor.config',
        um_zh: 'lib/umeditor/lang/zh-cn/zh-cn',
        knockout: 'lib/knockout-3.2.0.debug',
        'knockout.validation': 'lib/knockout.validation',
        'bezier-easing': 'lib/bezier-easing',
        'jquery.fileupload': 'lib/jQuery.FileUpload/jquery.fileupload',
        'jquery.validate': 'lib/jquery.validate',
        'jquery-ui': 'https://cdn.bootcss.com/jqueryui/1.12.1/jquery-ui.min',
        'jquery.ui.widget': 'lib/jquery.ui.widget',
        'qrcode': 'lib/qrcode',
        'react-dom': 'https://cdn.bootcss.com/react-dom/16.0.0/umd/react-dom.development',
        'prop-types': 'lib/prop-types',
        'chitu': 'lib/chitu',
        'chitu.mobile': 'lib/chitu.mobile',
        'wuzhui': 'lib/wuzhui',
        ace: 'assets/js/uncompressed/ace',
        'ue': 'lib/ueditor',
        adminServices: 'admin/services',
        'masterPage': 'admin/masterPage',
        // 'application': 'admin/application',
        // site: 'admin/site',
        modules: 'admin/modules',
        content: 'admin/content',
        build: 'admin/build',
        weixin: 'admin/weixin',
        // 'tips': 'admin/tips',
        'ue.ext': 'admin/ue.ext',
        myWuZhui: 'admin/myWuZhui',
        'socket.io': 'http://shopws.bailunmei.com/socket.io/socket.io'
    }
});
requirejs(['less!content/admin_style_default']);
requirejs(['build'], function () {
    var references = ['react', 'react-dom', 'admin/application', 'art-template'];
    requirejs(references, function (React, ReactDOM, app, ui) {
        window['React'] = React;
        window['ReactDOM'] = ReactDOM;
        window['h'] = React.createElement;
        app.default.run();
    });
});

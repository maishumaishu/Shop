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
            exports: 'chitu'
        },
        'jquery.fileupload': {
            deps: ['scripts/jQuery.FileUpload/jquery.iframe-transport',
                'css!scripts/jQuery.FileUpload/css/jquery.fileupload-ui.css']
        },
        'site': {
            // deps: ['jquery.cookie', 'bootbox']
        },
        'application': {
            deps: ['chitu']
        },
        'mobileControls': {
            exports: 'controls',
            deps: ['hammer', 'bezier-easing']
        },
        ui: {
            exports: 'ui'
        },
        userServices: {
            exports: 'userServices'
        },
        um: {
            deps: [
                'jquery',
                'css!umeditor/themes/default/css/umeditor.css',
                'umeditor/third-party/template.min.js',
                'um_config',
                'um_zh'
            ]
        },
        um_config: {
            deps: [
                'umeditor/third-party/template.min.js'
            ]
        },
        um_zh: {
            deps: ['um']
        }
    },
    paths: {
        bootstrap: 'scripts/bootstrap',
        chitu: 'scripts/chitu',
        css: 'scripts/css',
        formValidator: 'scripts/formValidator',
        hammer: 'scripts/hammer',
        jquery: 'scripts/jquery-2.1.3',
        react: 'scripts/react',
        mobileControls: 'scripts/mobileControls',
        move: 'scripts/move',
        text: 'scripts/text',
        ui: 'scripts/ui',
        um: 'umeditor/umeditor',
        um_config: 'umeditor/umeditor.config.js',
        um_zh: 'umeditor/lang/zh-cn/zh-cn.js',

        'bezier-easing': 'scripts/bezier-easing',
        'jquery.fileupload': 'scripts/jQuery.FileUpload/jquery.fileupload',
        'jquery.validate': 'scripts/jquery.validate',
        'jquery-ui': 'scripts/jquery-ui',
        'jquery.ui.widget': 'scripts/jquery.ui.widget',
        'react-dom': 'scripts/react-dom',

        ace: 'assets/js/uncompressed/ace',

        sv: 'services',
        custom: 'Custom',
        mod: 'modules',
        modules: 'modules',
        content: 'content',
        com: 'common',
        //app: 'App',
        ueditor: 'ueditor',
        'ue': 'ueditor',
        'wuzhui': 'scripts/wuzhui',
        service: 'services/service',
        userServices: '../user/userServices',
        componentDesigner: 'modules/station/components/componentDesigner',
        mobileComponents: '../user/pageComponents',
        mobilePageDesigner: 'modules/station/components/mobilePageDesigner',
        mobilePage: 'modules/station/components/virtualMobile',
    }
});
var references = ['react', 'react-dom', 'application', 'site', 'errorHandle', 'wuzhui', 'jquery-ui', 'bootstrap'];
requirejs(references, function (ReactClass, ReactDOMClass, app, ui) {
    window['React'] = ReactClass;
    window['ReactDOM'] = ReactDOMClass;
    window['h'] = React.createElement;


    app.run()



    // requirejs(['ace'], function () { });




});





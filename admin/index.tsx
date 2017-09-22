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
        dilu: {
            exports: 'dilu'
        },
        site: {
            // deps: ['jquery.cookie', 'bootbox']
        },
        application: {
            deps: ['chitu']
        },
        mobileControls: {
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
                'css!scripts/umeditor/themes/default/css/umeditor.css',
                'scripts/umeditor/third-party/template.min',
                'um_config',
            ]
        },
        um_config: {
            deps: [
                'scripts/umeditor/third-party/template.min'
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
        dilu: 'scripts/dilu',
        formValidator: 'scripts/formValidator',
        hammer: 'scripts/hammer',
        jquery: 'scripts/jquery-2.1.3',
        react: 'scripts/react',
        mobileControls: 'scripts/mobileControls',
        move: 'scripts/move',
        text: 'scripts/text',
        ui: 'scripts/ui',
        um: 'scripts/umeditor/umeditor',
        um_config: 'scripts/umeditor/umeditor.config',
        um_zh: 'scripts/umeditor/lang/zh-cn/zh-cn',

        'bezier-easing': 'scripts/bezier-easing',
        'jquery.fileupload': 'scripts/jQuery.FileUpload/jquery.fileupload',
        'jquery.validate': 'scripts/jquery.validate',
        'jquery-ui': 'scripts/jquery-ui',
        'jquery.ui.widget': 'scripts/jquery.ui.widget',
        'react-dom': 'scripts/react-dom',

        ace: 'assets/js/uncompressed/ace',

        custom: 'Custom',
        mod: 'modules',
        modules: 'modules',
        content: 'content',
        com: 'common',
        //app: 'App',
        ueditor: 'ueditor',
        'ue': 'ueditor',
        'wuzhui': 'scripts/wuzhui',
        // service: 'services/service',
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





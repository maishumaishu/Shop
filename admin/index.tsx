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
            deps: ['jquery.cookie', 'bootbox']
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
        }
    },
    paths: {
        ace: 'assets/js/uncompressed/ace',
        'bezier-easing': 'scripts/bezier-easing',
        bootstrap: 'scripts/bootstrap',
        bootbox: 'scripts/bootbox',
        chitu: 'scripts/chitu',
        crossroads: 'scripts/crossroads',
        css: 'scripts/css',
        hammer: 'scripts/hammer',
        JData: 'scripts/JData',
        jquery: 'scripts/jquery-2.1.3',
        'jquery.cookie': 'scripts/jquery.cookie',
        'jquery.fileupload': 'scripts/jQuery.FileUpload/jquery.fileupload',
        'jquery.validate': 'scripts/jquery.validate',
        'jquery-ui': 'scripts/jquery-ui',
        'jquery.ui.widget': 'scripts/jquery.ui.widget',
        knockout: 'scripts/knockout-3.2.0',
        'ko.map': 'scripts/knockout.mapping.debug',
        'ko.val': 'scripts/knockout.validation.cn',
        'knockout.validation': 'scripts/knockout.validation',
        'knockout.mapping': 'scripts/knockout.mapping',
        react: 'scripts/react',
        'react-dom': 'scripts/react-dom',
        move: 'scripts/move',
        'MicrosoftAjax.debug': 'scripts/MicrosoftAjax.debug',
        text: 'scripts/text',
        sv: 'services',
        custom: 'Custom',
        mod: 'modules',
        modules: 'modules',
        content: 'content',
        com: 'common',
        //app: 'App',
        ueditor: 'scripts/ueditor',
        'ue': 'scripts/ueditor',
        'wuzhui': 'scripts/wuzhui',
        service: 'services/service',
        userServices: 'mobile/userServices',
        mobileComponents: '../user/pageComponents',
        componentDesigner: 'modules/station/components/componentDesigner',
        mobilePageDesigner: 'modules/station/components/mobilePageDesigner',
        mobilePage: 'modules/station/components/virtualMobile'
    }
});
var references = ['react', 'react-dom', 'application', 'site', 'errorHandle', 'wuzhui', 'jquery-ui'];
requirejs(references, function (ReactClass, ReactDOMClass, app, ui) {
    window['React'] = ReactClass;
    window['ReactDOM'] = ReactDOMClass;
    window['h'] = React.createElement;


    app.run()



    // requirejs(['ace'], function () { });




});





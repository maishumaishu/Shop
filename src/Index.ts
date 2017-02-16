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
            deps: ['jquery.cookie']
        },
        'Application': {
            deps: ['chitu']
        }
    },
    paths: {
        ace: 'assets/js/uncompressed/ace',
        bootstrap: 'assets/js/uncompressed/bootstrap',
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
        'ko.ext': 'common/knockout.extentions',
        'ko.map': 'scripts/knockout.mapping.debug',
        'ko.val': 'scripts/knockout.validation.cn',
        'knockout.validation': 'scripts/knockout.validation',
        'knockout.mapping': 'scripts/knockout.mapping',
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
        'ue': 'ueditor'
    }
});
var references = ['Application', 'Site', 'ErrorHandle', 'knockout', 'ko.map', 'custom'];
requirejs(references, function (app) {
    /// <param name="app" type="chitu.Application"/>
    if (arguments.length > 0) {
        window['ko'] = arguments[3];
        window['ko'].mapping = arguments[4];
    }
    app.run()

    var model = {
        menus: ko.observableArray()

    };

    requirejs(['text!data/Menu.json'], function (text) {
        let data = JSON.parse(text);
        var stack = [];
        for (var i = 0; i < data.length; i++)
            stack.push(data[i]);

        while (stack.length > 0) {
            var item = stack.pop();
            item.Url = item.Url || '';
            item.Children = item.Children || [];
            item.Icon = item.Icon || '';
            item.Visible = (item.Visible === undefined) ? true : item.Visible;
            item.VisibleChildren = [];

            for (var i = 0; i < item.Children.length; i++) {
                if (item.Children[i].Visible === undefined || item.Children[i].Visible !== false)
                    item.VisibleChildren.push(item.Children[i]);

                stack.push(item.Children[i]);
            }
        }
        model.menus(data);
    });


    ko.applyBindings(model, document.getElementById('sidebar'));
    ko.applyBindings(model, document.getElementById('navbar'));

    requirejs(['ace'], function () { });
});


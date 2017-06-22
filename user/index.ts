
/** 是否为 APP */
var isCordovaApp = location.protocol === 'file:';
/** 判断是否经 babel 转换为 es5 */
let isBabelES5 = false;
class testClass {
}
isBabelES5 = window['_classCallCheck'] != null;
/** 判断是否使用 uglify 压缩 */
let isUglify = testClass.name != 'testClass';

var browser = function () {
    var browser = {
        msie: false, firefox: false, opera: false, safari: false,
        chrome: false, netscape: false, appname: 'unknown',
        version: 0
    };
    var userAgent = window.navigator.userAgent.toLowerCase();
    if (/(msie|firefox|opera|chrome|netscape)\D+(\d[\d.]*)/.test(userAgent)) {
        browser[RegExp.$1] = true;
        browser.appname = RegExp.$1;
        browser.version = new Number(RegExp.$2.split('.')[0]).valueOf();
    } else if (/version\D+(\d[\d.]*).*safari/.test(userAgent)) { // safari 
        browser.safari = true;
        browser.appname = 'safari';
        browser.version = new Number(RegExp.$1.split('.')[0]).valueOf();
    }

    return browser;
}();


var modulesPath = 'modules';
var services_deps = [];

if (!window['fetch']) {
    services_deps.push('fetch');
}

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
        services: {
            deps: services_deps
        },
        controls: {
            deps: ['react-dom', 'react']
        },
        application: {
            deps: ['chitu']
        },
        mobileControls: {
            exports: 'controls',
            deps: ['hammer', 'bezier-easing']
        },
        userServices: {
            exports: 'userServices'
        }
    },
    paths: {
        'bezier-easing': 'scripts/bezier-easing',
        chitu: 'scripts/chitu',
        css: 'scripts/css',
        fetch: 'scripts/fetch',
        hammer: 'scripts/hammer',
        react: 'scripts/react',
        'react-dom': 'scripts/react-dom',
        text: 'scripts/text',
        // controls: 'controls',
        'chitu.mobile': 'scripts/chitu.mobile',
        carousel: 'scripts/carousel',
        modules: modulesPath,
        services: 'userServices',
        mobileComponents: 'pageComponents'
        // ui: 'ui'
    }
});

requirejs(['react', 'react-dom', 'application'], function (React, ReactDOM, app) {
    window['React'] = React;
    window['ReactDOM'] = ReactDOM;
    app.run();
    window['h'] = React.createElement;

    requirejs(['css!mobileComponents/style/style_default.css']);

})




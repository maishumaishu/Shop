requirejs.config({
    //urlArgs: "bust=5",
    shim: {
        'application': {
            deps: ['chitu']
        }
    },
    paths: {
        //================================
        // requirejs 插件
        css: 'scripts/css',
        text: 'scripts/text',
        //================================
        chitu: 'scripts/chitu',
        mobile: 'controls',
        react: 'scripts/react',
        'react-dom': 'scripts/react-dom'
    }
});
var references = ['react', 'react-dom', 'application'];
requirejs(references, function (React, ReactDOM, app) {
    window['React'] = React;
    window['ReactDOM'] = ReactDOM;


    app.run();
});


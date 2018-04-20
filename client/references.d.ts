declare module 'chitu.mobile' {
    import * as cm from 'lib/es6/chitu.mobile';
    export = cm;
}
declare module 'ui' {
    import 'lib/es6/ui';
    export = ui;
}
declare module 'dilu' {
    import 'lib/es6/dilu';
    export = dilu;
}
declare function h(type, props, ...children);
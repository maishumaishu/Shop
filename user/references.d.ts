declare module 'mobileControls' {
    export = controls;
}
declare module 'userServices'{
    export = userServices;
}
declare module "chitu.mobile"{
    import * as cm from 'lib/mobile/chitu.mobile';
    export = cm;
}
declare module 'controls'{
    export = controls;
}
declare module 'ui'{
    export = ui;
}
declare function h(type, props, ...children);
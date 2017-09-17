declare module 'mobileControls' {
    export = controls;
}
declare module 'userServices' {
    export = userServices;
}
declare module 'ui' {
    export = ui;
}
declare module 'mobilePage' {
    import * as c from "modules/station/components/virtualMobile";
    export = c;
}
declare module 'mobilePageDesigner' {
    import * as c from "modules/station/components/mobilePageDesigner";
    export = c;
}
declare module 'componentDesigner' {
    import * as c from 'modules/station/components/componentDesigner';
    export = c;
}
declare module 'service' {
    import * as c from 'services/service';
    export = c;
}
declare module 'dilu' {
    export = dilu;
}
declare function h(type, props, ...children);



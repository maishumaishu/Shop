declare module 'mobileControls' {
    export = controls;
}
declare module 'services'{
    import * as userServices from 'userServices';
    export = userServices;
}
declare module "chitu.mobile"{
    import * as cm from 'lib/mobile/chitu.mobile';
    export = cm;
}
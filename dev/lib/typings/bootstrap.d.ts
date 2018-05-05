interface Bootstrap extends JQuery {
    modal(): Bootstrap
}
interface BootstrapStatic extends JQueryStatic {
    (selector: string, context?: Element | JQuery): Bootstrap;
    (element: Element): Bootstrap;
    (elementArray: Element[]): Bootstrap;
}
declare module "bootstrap" {
    export = bs;
}
declare var bs: BootstrapStatic
type Size = 'large' | 'small'
interface Bootbox {
    alert(message: string, callback?: () => void);
    alert(options: {
        callback?: () => void
        message: string,
        size?: Size,
        title?: string
    });
    confirm(message: string, callback?: (result: boolean) => void);
    confirm(options: {
        size?: Size,
        message: string,
        callback?: (result: boolean) => void
    });
}

declare var bootbox: Bootbox;
declare module "bootbox" {

    export =  bootbox;
}
//declare var $: BootstrapStatic
declare namespace ui {
    type Callback = (event: MouseEvent) => Promise<any>;
    type Arguments = {
        confirm?: string | (() => string);
        toast?: string | HTMLElement;
    };
    let dialogContainer: HTMLElement;
    function setDialogContainer(value: HTMLElement): void;
    function buttonOnClick(callback: Callback, args?: Arguments): (event: Event) => void;
}
declare namespace ui {
    /** 弹窗
     * @param element bootstrap 的 modal 元素
     */
    function showDialog(element: HTMLElement): void;
    function hideDialog(element: HTMLElement): Promise<{}>;
    function alert(args: string | {
        title: string;
        message: string;
    }): void;
    function confirm(args: {
        title?: string;
        message: string;
        cancle?: () => void;
        confirm: (event: Event) => Promise<any>;
    }): void;
}
declare namespace ui {
    let errors: {
        argumentNull(paramName: string): Error;
    };
}
declare namespace ui {
    let loadImageConfig: {
        imageBaseUrl: string;
        imageDisaplyText: string;
    };
    type LoadImageOptions = {
        imageSize?: {
            width: number;
            height: number;
        };
        loadImage?: () => Promise<string>;
        imageText?: string;
    };
    /**
     * 在 IMG 元素上渲染图片
     * @param element 要渲染的 IMG 元素
     * @param options 渲染选项，默认将 IMG 元素的 SRC 属性渲染出来
     */
    function renderImage(element: HTMLImageElement, options?: LoadImageOptions): Promise<string>;
    type ImageFileToBase64Result = {
        base64: string;
        width: number;
        height: number;
    };
    function imageFileToBase64(imageFile: File, size?: {
        width: number;
        height: number;
    }): Promise<ImageFileToBase64Result>;
}

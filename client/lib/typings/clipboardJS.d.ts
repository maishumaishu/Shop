declare class ClipboardJS {
    constructor(selector: string | HTMLElement, options: {
        text: () => string
    });

    on(event: string, callback: (e: any) => void);
}

// declare module ClipboardJS {
// }

declare module 'clipboard' {
    export = ClipboardJS;
}

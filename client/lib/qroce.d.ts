declare enum QRErrorCorrectLevel {
    L,
    M,
    Q,
    H
}
declare class QRCode {
    constructor(element: HTMLElement, text: string);
    constructor(element: HTMLElement, options: {
        text: string,
        width: number,
        height: number,
        colorDark?: string,
        colorLight?: string,
        correctLevel?: QRErrorCorrectLevel
    });
    clear();
    makeCode(text: string);
}

declare module 'qrcode' {
    export = QRCode;
}
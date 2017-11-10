export declare class Error {
}
export declare class MyFormValidator {
    constructor();
    rule(method: elementValidate, element: HTMLElement, message: string): any;
    rule(method: elementValidate, element: HTMLElement, depends: HTMLElement[]): any;
    rule(method: elementValidate, element: HTMLElement, message: string, depends: HTMLElement[]): any;
    checkAll(): Array<Error>;
    checkElement(element: HTMLElement): Array<Error>;
}
export declare type elementValidate = (value: string) => boolean;
export declare class Rules {
    static email(): elementValidate;
}

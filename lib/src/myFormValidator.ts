export class Error {

}
export class MyFormValidator {
    constructor() {

    }

    rule(method: elementValidate, element: HTMLElement, message: string);
    rule(method: elementValidate, element: HTMLElement, depends: HTMLElement[]);
    rule(method: elementValidate, element: HTMLElement, message: string, depends: HTMLElement[]);
    rule(method: elementValidate, element: HTMLElement, messageOrDepends?: string | HTMLElement[], depends?: HTMLElement[]) {

    }
    checkAll(): Array<Error> {
        return [];
    }
    checkElement(element: HTMLElement): Array<Error> {
        return [];
    }
}

export type elementValidate = (value: string) => boolean;

export class Rules {
    static email(): elementValidate {
        return null;
    }
} 
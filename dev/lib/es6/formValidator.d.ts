export interface ValidatorError {
    id: string;
    display: string;
    element: HTMLInputElement;
    name: string;
    message: string;
    rule: (...params) => boolean;
}
export interface Rule {
    name: string;
    params: string[];
}
export interface ValidateField {
    id?: string;
    name?: string;
    depends?: () => Array<string | Rule>;
    display?: string;
    element?: HTMLInputElement;
    rules?: Array<string | Rule>;
    value?: string | boolean;
    messages?: {
        [name: string]: string;
    };
}
export declare type ErrorCallback = (errors: ValidatorError[], fields: ValidateField[], evt: Environment) => void;
export declare type Environment = {
    formElement: HTMLElement;
    validator: FormValidator;
};
export declare class FormValidator {
    private callback;
    private fields;
    private form;
    private handlers;
    private conditionals;
    hooks: {
        [name: string]: (...params) => boolean;
    };
    messages: {
        [name: string]: string;
    };
    static defaults: {
        messages: {
            [name: string]: string;
        };
        hooks: {
            [name: string]: (...params: any[]) => boolean;
        };
        errorClassName: string;
        callback: (errors: ValidatorError[], fields: ValidateField[], evt: Environment) => void;
    };
    constructor(form: HTMLElement, fields: {
        [propName: string]: ValidateField;
    }, callback?: ErrorCallback);
    clearErrors(...fieldNames: string[]): void;
    registerCallback(name: string, handler: (value: string) => void): this;
    registerConditional(name: any, conditional: any): this;
    validateForm(): boolean;
    validateFields(...fieldNames: string[]): boolean;
    private _validateFields(fields);
    private _validateField(field);
    /**
     * private function _getValidDate: helper function to convert a string date to a Date object
     * @param date (String) must be in format yyyy-mm-dd or use keyword: today
     * @returns {Date} returns false if invalid
     */
    private _getValidDate(date);
    private static attributeValue(elements, attributeName);
}
export default FormValidator;

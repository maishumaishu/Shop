declare namespace dilu {
    let errors: {
        argumentNull(parameterName: any): Error;
        ruleNotExists(name: string): Error;
        elementValidateRuleNotSet(element: HTMLInputElement): Error;
    };
}
declare namespace dilu {
    interface ValidateField {
        rule: Rule;
        display?: string;
        message?: string;
        depends?: (HTMLElement | (() => boolean))[];
        errorElement?: HTMLElement;
    }
    class FormValidator {
        private fields;
        constructor(...fields: ValidateField[]);
        clearErrors(): void;
        clearElementError(element: HTMLInputElement): void;
        check(): boolean;
        checkElement(inputElement: HTMLInputElement): boolean;
        private getElementValidators(element);
    }
}
declare namespace dilu {
    type InputElement = HTMLElement & {
        value: string;
        name?: string;
    };
    class Rule {
        private _validate;
        private _element;
        private _errorElement;
        private _errorMessage;
        constructor(element: InputElement, validate: (value: string) => boolean, errorMessage: string, errorELement?: HTMLElement);
        readonly element: HTMLElement & {
            value: string;
        };
        readonly errorElement: HTMLElement;
        readonly errorMessage: string;
        check(): boolean;
        showError(): void;
        hideError(): void;
    }
}
declare namespace dilu {
    type Options = {
        display?: string;
        message?: string;
    };
    let rules: {
        required: (element: InputElement, options?: Options) => Rule;
        matches: (element: InputElement, otherElement: InputElement, options?: Options) => Rule;
        email: (element: InputElement, options?: Options) => Rule;
        minLength: (element: InputElement, length: number, options?: Options) => Rule;
        maxLength: (element: InputElement, length: number, options?: Options) => Rule;
        greaterThan: (element: InputElement, value: number | Date, options: Options) => Rule;
        lessThan: (element: InputElement, value: string | number | Date, options: Options) => Rule;
        equal: (element: InputElement, value: string | number | Date, options?: Options) => Rule;
        ip: (element: InputElement, options: Options) => Rule;
        url: (element: InputElement, options?: Options) => Rule;
        mobile: (element: InputElement, options?: Options) => {
            name: string;
            element: InputElement;
            display: string;
            messages: {
                'mobile': string;
            };
            rules: string[];
        };
    };
}

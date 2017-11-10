define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Error {
    }
    exports.Error = Error;
    class MyFormValidator {
        constructor() {
        }
        rule(method, element, messageOrDepends, depends) {
        }
        checkAll() {
            return [];
        }
        checkElement(element) {
            return [];
        }
    }
    exports.MyFormValidator = MyFormValidator;
    class Rules {
        static email() {
            return null;
        }
    }
    exports.Rules = Rules;
});

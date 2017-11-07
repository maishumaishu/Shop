var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var dilu;
(function (dilu) {
    dilu.errors = {
        argumentNull(parameterName) {
            let msg = `Parameter ${parameterName} can not be null or empty.`;
            return new Error(msg);
        },
        elementValidateRuleNotSet(element) {
            let msg = `元素'${element.name}'没有设置验证规则`;
            return new Error(msg);
        },
        fieldElementCanntNull(fieldIndex) {
            let msg = `The element value in the field cannt be null, field index is ${fieldIndex}.`;
            return new Error(msg);
        }
    };
})(dilu || (dilu = {}));
var dilu;
(function (dilu) {
    class FormValidator {
        constructor(...fields) {
            this.fields = [];
            this.addFields(...fields);
        }
        addFields(...fields) {
            for (let i = 0; i < fields.length; i++) {
                let element = fields[i].element;
                if (element == null) {
                    throw dilu.errors.fieldElementCanntNull(i);
                }
                let errorElement = fields[i].errorElement;
                if (errorElement == null) {
                    errorElement = document.createElement("span");
                    errorElement.className = FormValidator.errorClassName;
                    if (element.nextSibling)
                        element.parentElement.insertBefore(errorElement, element.nextSibling);
                    else
                        element.parentElement.appendChild(errorElement);
                    fields[i].errorElement = errorElement;
                }
                errorElement.style.display = 'none';
                fields[i].depends = fields[i].depends || [];
            }
            fields.forEach(o => this.fields.push(o));
        }
        clearErrors() {
            this.fields.map(o => o.errorElement).forEach(o => o.style.display = 'none');
        }
        clearElementError(element) {
            if (element == null)
                throw dilu.errors.argumentNull('element');
            let field = this.fields.filter(o => o.element == element)[0];
            if (field)
                field.errorElement.style.display = 'none';
        }
        check() {
            return __awaiter(this, void 0, void 0, function* () {
                let ps = new Array();
                for (let i = 0; i < this.fields.length; i++) {
                    let field = this.fields[i];
                    if (field.condition && field.condition() == false)
                        continue;
                    let p = this.checkField(field);
                    ps.push(p);
                }
                let checkResults = yield Promise.all(ps);
                let result = checkResults.filter(o => o == false).length == 0;
                return result;
            });
        }
        ;
        checkField(field) {
            return __awaiter(this, void 0, void 0, function* () {
                let depends = field.depends;
                console.assert(depends != null, 'depends is null');
                for (let j = 0; j < depends.length; j++) {
                    let dependResult = depends[j]();
                    if (typeof dependResult == 'boolean') {
                        dependResult = Promise.resolve(dependResult);
                    }
                    let dependIsOK = yield dependResult;
                    if (!dependIsOK)
                        return false;
                }
                // let result = true;
                let ps = new Array();
                for (let j = 0; j < field.rules.length; j++) {
                    let rule = field.rules[j];
                    let p = rule.validate(field.element.value);
                    if (typeof p == 'boolean') {
                        p = Promise.resolve(p);
                    }
                    let isPass = yield p;
                    // result = isPass == false ? false : result;
                    let errorElement;
                    if (typeof rule.error == 'string') {
                        errorElement = field.errorElement;
                        errorElement.innerHTML = rule.error.replace('%s', field.element.name);
                    }
                    else {
                        errorElement = rule.error;
                    }
                    console.assert(errorElement != null, 'errorElement cannt be null.');
                    if (isPass == false) {
                        errorElement.style.removeProperty('display');
                    }
                    else {
                        errorElement.style.display = 'none';
                    }
                    if (!isPass)
                        return false;
                }
                return true;
            });
        }
        checkElement(inputElement) {
            if (!inputElement)
                throw dilu.errors.argumentNull('inputElement');
            let field = this.fields.filter(o => o.element == inputElement)[0];
            if (!field)
                throw dilu.errors.elementValidateRuleNotSet(inputElement);
            return this.checkField(field);
        }
    }
    FormValidator.errorClassName = 'validateMessage';
    dilu.FormValidator = FormValidator;
})(dilu || (dilu = {}));
var dilu;
(function (dilu) {
    var ruleRegex = /^(.+?)\[(.+)\]$/, numericRegex = /^[0-9]+$/, integerRegex = /^\-?[0-9]+$/, decimalRegex = /^\-?[0-9]*\.?[0-9]+$/, emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, alphaRegex = /^[a-z]+$/i, alphaNumericRegex = /^[a-z0-9]+$/i, alphaDashRegex = /^[a-z0-9_\-]+$/i, naturalRegex = /^[0-9]+$/i, naturalNoZeroRegex = /^[1-9][0-9]*$/i, ipRegex = /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i, base64Regex = /[^a-zA-Z0-9\/\+=]/i, numericDashRegex = /^[\d\-\s]+$/, urlRegex = /^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/, mobileRegex = /^1[34578]\d{9}$/, dateRegex = /\d{4}-\d{1,2}-\d{1,2}/;
    let msgs = {
        required: '%s不能为空',
        matches: '%s与%s不匹配',
        "default": 'The %s field is still set to default, please change.',
        equal: '%s和%s必须相同',
        email: '不是有效的邮箱地址',
        valid_emails: 'The %s field must contain all valid email addresses.',
        minLength: '%s至少包含%s个字符',
        maxLength: '%s不能超过%s字符',
        exact_length: 'The %s field must be exactly %s characters in length.',
        greater_than: 'The %s field must contain a number greater than %s.',
        less_than: 'The %s field must contain a number less than %s.',
        alpha: 'The %s field must only contain alphabetical characters.',
        alpha_numeric: 'The %s field must only contain alpha-numeric characters.',
        alpha_dash: 'The %s field must only contain alpha-numeric characters, underscores, and dashes.',
        numeric: '请数入数字',
        integer: 'The %s field must contain an integer.',
        decimal: 'The %s field must contain a decimal number.',
        is_natural: 'The %s field must contain only positive numbers.',
        is_natural_no_zero: 'The %s field must contain a number greater than zero.',
        ip: 'The %s field must contain a valid IP.',
        valid_base64: 'The %s field must contain a base64 string.',
        valid_credit_card: 'The %s field must contain a valid credit card number.',
        is_file_type: 'The %s field must contain only %s files.',
        valid_url: 'The %s field must contain a valid URL.',
        greater_than_date: 'The %s field must contain a more recent date than %s.',
        less_than_date: 'The %s field must contain an older date than %s.',
        greater_than_or_equal_date: 'The %s field must contain a date that\'s at least as recent as %s.',
        less_than_or_equal_date: 'The %s field must contain a date that\'s %s or older.',
        mobile: '请输入正确的手机号码'
    };
    function createValidation(validate, error) {
        return {
            validate: validate,
            error: error
        };
    }
    dilu.rules = {
        required(error) {
            let validate = (value) => value != '';
            return createValidation(validate, error || msgs.required);
        },
        matches: function (otherElement, error) {
            var validate = (value) => value == otherElement.value;
            return createValidation(validate, error || msgs.required);
        },
        email: function (error) {
            var validate = (value) => emailRegex.test(value);
            return createValidation(validate, error || msgs.required);
        },
        minLength: function (length, error) {
            var validate = (value) => (value || '').length >= length;
            return createValidation(validate, error || msgs.minLength);
        },
        maxLength: function (length, error) {
            var validate = (value) => (value || '').length <= length;
            return createValidation(validate, error || msgs.matches);
        },
        greaterThan: function (value, error) {
            var validate = (o) => elementValueCompare(o, value) == 'greaterThan';
            return createValidation(validate, error || msgs.greater_than);
        },
        lessThan: function (value, error) {
            var validate = (o) => elementValueCompare(o, value) == 'lessThan';
            return createValidation(validate, error || msgs.less_than);
        },
        equal: function (value, error) {
            var validate = (o) => elementValueCompare(o, value) == 'greaterThan';
            return createValidation(validate, error || msgs.equal);
        },
        ip: function (error) {
            var validate = (value) => ipRegex.test(value);
            return createValidation(validate, error || msgs.ip);
        },
        url: function (error) {
            var validate = (value) => urlRegex.test(value);
            return createValidation(validate, error || msgs.valid_url);
        },
        mobile: function (error) {
            var validate = (value) => mobileRegex.test(value);
            return createValidation(validate, error || msgs.mobile);
        },
        numeric: function (error) {
            var validate = (value) => numericRegex.test(value);
            return createValidation(validate, error || msgs.numeric);
        },
        custom: function (validate, error) {
            return createValidation(validate, error);
        }
    };
    function elementValueCompare(value, otherValue) {
        let elementValue;
        if (typeof otherValue == 'number') {
            elementValue = decimalRegex.test(value) ? parseFloat(value) : null;
        }
        else if (typeof otherValue == 'string') {
            elementValue = value;
        }
        else {
            elementValue = getValidDate(value);
        }
        if (elementValue < otherValue)
            return 'lessThan';
        else if (elementValue > otherValue)
            return 'greaterThan';
        else
            return 'equal';
    }
    /**
     * private function _getValidDate: helper function to convert a string date to a Date object
     * @param date (String) must be in format yyyy-mm-dd or use keyword: today
     * @returns {Date} returns false if invalid
     */
    function getValidDate(date) {
        if (!date.match('today') && !date.match(dateRegex)) {
            return null;
        }
        var validDate = new Date(), validDateArray;
        if (!date.match('today')) {
            validDateArray = date.split('-');
            validDate.setFullYear(validDateArray[0]);
            validDate.setMonth(validDateArray[1] - 1);
            validDate.setDate(validDateArray[2]);
        }
        return validDate;
    }
    ;
})(dilu || (dilu = {}));

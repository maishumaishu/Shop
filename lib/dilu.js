var dilu;
(function (dilu) {
    dilu.errors = {
        argumentNull(parameterName) {
            let msg = `Parameter ${parameterName} can not be null or empty.`;
            return new Error(msg);
        },
        ruleNotExists(name) {
            return new Error(`Rule named ${name} is not exists.`);
        },
        elementValidateRuleNotSet(element) {
            let msg = `元素'${element.name}'没有设置验证规则`;
            return new Error(msg);
        }
    };
})(dilu || (dilu = {}));
var dilu;
(function (dilu) {
    class FormValidator {
        constructor(...fields) {
            this.fields = fields;
        }
        clearErrors() {
            this.fields.map(o => o.rule).forEach(o => o.hideError());
        }
        clearElementError(element) {
            if (element == null)
                throw dilu.errors.argumentNull('element');
            this.fields
                .filter(o => o.rule.element == element)
                .forEach(o => o.rule.hideError());
        }
        check() {
            var result = true;
            for (let i = 0; i < this.fields.length; i++) {
                let field = this.fields[i];
                let depends = field.depends || [];
                let dependIsOK = true;
                for (let j = 0; j < depends.length; j++) {
                    if (typeof depends[j] == 'function') {
                        dependIsOK = depends[j]();
                    }
                    else {
                        dependIsOK = this.checkElement(depends[j]);
                    }
                }
                result = dependIsOK ? this.fields[i].rule.check() : false;
            }
            return result;
        }
        ;
        checkElement(inputElement) {
            let itemValidators = this.getElementValidators(inputElement);
            if (itemValidators.length == 0)
                throw dilu.errors.elementValidateRuleNotSet(inputElement);
            var checkFails = itemValidators.map(o => o.check()).filter(chechSuccess => !chechSuccess);
            return checkFails.length == 0;
        }
        getElementValidators(element) {
            return this.fields.map(o => o.rule).filter(o => o.element == element);
        }
    }
    dilu.FormValidator = FormValidator;
})(dilu || (dilu = {}));
var dilu;
(function (dilu) {
    const errorClassName = 'validationMessage';
    class Rule {
        // private _errorElement: HTMLElement;
        constructor(element, validate, errorMessage, errorELement) {
            this._element = element;
            this._validate = validate;
            this._errorMessage = errorMessage;
            this._errorElement = errorELement;
        }
        get element() {
            return this._element;
        }
        get errorElement() {
            if (this._errorElement == null) {
                this._errorElement = document.createElement("span");
                this._errorElement.className = errorClassName;
                this._errorElement.innerText = this._errorMessage;
                this._errorElement.style.display = 'none';
                if (this.element.nextSibling)
                    this.element.parentElement.insertBefore(this._errorElement, this.element.nextSibling);
                else
                    this.element.parentElement.appendChild(this._errorElement);
            }
            return this._errorElement;
        }
        get errorMessage() {
            return this._errorMessage;
        }
        check() {
            let value = this.element.value;
            if (!this._validate(value)) {
                this.showError();
                return false;
            }
            this.hideError();
            return true;
        }
        showError() {
            this.errorElement.style.removeProperty('display');
        }
        hideError() {
            this.errorElement.style.display = 'none';
        }
    }
    dilu.Rule = Rule;
})(dilu || (dilu = {}));
var dilu;
(function (dilu) {
    var ruleRegex = /^(.+?)\[(.+)\]$/, numericRegex = /^[0-9]+$/, integerRegex = /^\-?[0-9]+$/, decimalRegex = /^\-?[0-9]*\.?[0-9]+$/, emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, alphaRegex = /^[a-z]+$/i, alphaNumericRegex = /^[a-z0-9]+$/i, alphaDashRegex = /^[a-z0-9_\-]+$/i, naturalRegex = /^[0-9]+$/i, naturalNoZeroRegex = /^[1-9][0-9]*$/i, ipRegex = /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i, base64Regex = /[^a-zA-Z0-9\/\+=]/i, numericDashRegex = /^[\d\-\s]+$/, urlRegex = /^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/, dateRegex = /\d{4}-\d{1,2}-\d{1,2}/;
    let msgs = {
        required: '%s 不允许为空',
        matches: '%s 与 %s 不匹配',
        "default": 'The %s field is still set to default, please change.',
        equal: '%s 字段 和 %s 必须相同',
        email: '%s 不是有效的邮箱地址',
        valid_emails: 'The %s field must contain all valid email addresses.',
        minLength: '%s 至少包含 %s 个字符',
        maxLength: '%s 不能超过 %s 字符',
        exact_length: 'The %s field must be exactly %s characters in length.',
        greater_than: 'The %s field must contain a number greater than %s.',
        less_than: 'The %s field must contain a number less than %s.',
        alpha: 'The %s field must only contain alphabetical characters.',
        alpha_numeric: 'The %s field must only contain alpha-numeric characters.',
        alpha_dash: 'The %s field must only contain alpha-numeric characters, underscores, and dashes.',
        numeric: 'The %s field must contain only numbers.',
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
        mobile: '%s 不是有效的手机号码'
    };
    let errorMessage = (pattern, element, options) => {
        options = options || {};
        if (options.message)
            return options.message;
        let display = options.display || element.name || '';
        return pattern.replace('%s', display);
    };
    dilu.rules = {
        required: function (element, options) {
            if (!element)
                throw dilu.errors.argumentNull('element');
            let message = errorMessage(msgs.required, element, options);
            let validate = () => (element.value || '') != '';
            ;
            return new dilu.Rule(element, validate, message);
        },
        matches: function (element, otherElement, options) {
            if (!element)
                throw dilu.errors.argumentNull('element');
            if (!otherElement)
                throw dilu.errors.argumentNull('otherElement');
            let message = errorMessage(msgs.matches, element, options);
            var validate = () => element.value == otherElement.value;
            return new dilu.Rule(element, validate, message);
        },
        email: function (element, options) {
            if (!element)
                throw dilu.errors.argumentNull('element');
            let message = errorMessage(msgs.email, element, options);
            var validate = () => emailRegex.test(element.value);
            return new dilu.Rule(element, validate, message);
        },
        minLength: function (element, length, options) {
            if (!element)
                throw dilu.errors.argumentNull('element');
            let message = errorMessage(msgs.minLength, element, options);
            var validate = () => (element.value || '').length >= length;
            return new dilu.Rule(element, validate, message);
        },
        maxLength: function (element, length, options) {
            if (!element)
                throw dilu.errors.argumentNull('element');
            let message = errorMessage(msgs.maxLength, element, options);
            var validate = () => (element.value || '').length <= length;
            return new dilu.Rule(element, validate, message);
        },
        greaterThan: function (element, value, options) {
            if (!element)
                throw dilu.errors.argumentNull('element');
            if (value == null)
                throw dilu.errors.argumentNull('value');
            let message = errorMessage(msgs.greater_than, element, options);
            var validate = () => elementValueCompare(element, value) == 'greaterThan';
            return new dilu.Rule(element, validate, message);
        },
        lessThan: function (element, value, options) {
            if (!element)
                throw dilu.errors.argumentNull('element');
            let message = errorMessage(msgs.email, element, options);
            var validate = () => elementValueCompare(element, value) == 'lessThan';
            return new dilu.Rule(element, validate, message);
        },
        equal: function (element, value, options) {
            if (!element)
                throw dilu.errors.argumentNull('element');
            if (value == null)
                throw dilu.errors.argumentNull('value');
            let message = errorMessage(msgs.equal, element, options);
            var validate = () => elementValueCompare(element, value) == 'greaterThan';
            return new dilu.Rule(element, validate, message);
        },
        ip: function (element, options) {
            if (!element)
                throw dilu.errors.argumentNull('element');
            let message = errorMessage(msgs.ip, element, options);
            var validate = () => ipRegex.test(element.value);
            return new dilu.Rule(element, validate, message);
        },
        url: function (element, options) {
            if (!element)
                throw dilu.errors.argumentNull('element');
            let message = errorMessage(msgs.email, element, options);
            var validate = () => urlRegex.test(element.value);
            return new dilu.Rule(element, validate, message);
        },
        mobile: function (element, options) {
            options = options || {};
            return {
                name: element.name,
                element: element,
                display: options.display,
                messages: { 'mobile': options.message },
                rules: ['mobile']
            };
        },
    };
    function elementValueCompare(element, value) {
        let elementValue;
        if (typeof value == 'number') {
            elementValue = decimalRegex.test(element.value) ? parseFloat(element.value) : null;
        }
        else if (typeof value == 'string') {
            elementValue = element.value;
        }
        else {
            elementValue = getValidDate(element.value);
        }
        if (elementValue < value)
            return 'lessThan';
        else if (elementValue > value)
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

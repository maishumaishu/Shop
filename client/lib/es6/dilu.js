var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var dilu;
(function (dilu) {
    dilu.errors = {
        argumentNull: function (parameterName) {
            var msg = "Parameter " + parameterName + " can not be null or empty.";
            return new Error(msg);
        },
        elementValidateRuleNotSet: function (element) {
            var msg = "\u5143\u7D20'" + element.name + "'\u6CA1\u6709\u8BBE\u7F6E\u9A8C\u8BC1\u89C4\u5219";
            return new Error(msg);
        },
        fieldElementCanntNull: function (fieldIndex) {
            var msg = "The element value in the field cannt be null, field index is " + fieldIndex + ".";
            return new Error(msg);
        }
    };
})(dilu || (dilu = {}));
var dilu;
(function (dilu) {
    var FormValidator = (function () {
        function FormValidator() {
            var fields = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                fields[_i] = arguments[_i];
            }
            this.fields = [];
            this.addFields.apply(this, fields);
        }
        FormValidator.prototype.addFields = function () {
            var _this = this;
            var fields = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                fields[_i] = arguments[_i];
            }
            for (var i = 0; i < fields.length; i++) {
                var element = fields[i].element;
                if (element == null) {
                    throw dilu.errors.fieldElementCanntNull(i);
                }
                var errorElement = fields[i].errorElement;
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
            fields.forEach(function (o) { return _this.fields.push(o); });
        };
        FormValidator.prototype.clearErrors = function () {
            this.fields.map(function (o) { return o.errorElement; }).forEach(function (o) { return o.style.display = 'none'; });
        };
        FormValidator.prototype.clearElementError = function (element) {
            if (element == null)
                throw dilu.errors.argumentNull('element');
            var field = this.fields.filter(function (o) { return o.element == element; })[0];
            if (field)
                field.errorElement.style.display = 'none';
        };
        FormValidator.prototype.check = function () {
            return __awaiter(this, void 0, void 0, function () {
                var ps, i, field, p, checkResults, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            ps = new Array();
                            for (i = 0; i < this.fields.length; i++) {
                                field = this.fields[i];
                                if (field.condition && field.condition() == false)
                                    continue;
                                p = this.checkField(field);
                                ps.push(p);
                            }
                            return [4 /*yield*/, Promise.all(ps)];
                        case 1:
                            checkResults = _a.sent();
                            result = checkResults.filter(function (o) { return o == false; }).length == 0;
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        ;
        FormValidator.prototype.checkField = function (field) {
            return __awaiter(this, void 0, void 0, function () {
                var depends, j, dependResult, dependIsOK, ps, j, rule, p, isPass, errorElement;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            depends = field.depends;
                            console.assert(depends != null, 'depends is null');
                            j = 0;
                            _a.label = 1;
                        case 1:
                            if (!(j < depends.length)) return [3 /*break*/, 4];
                            dependResult = depends[j]();
                            if (typeof dependResult == 'boolean') {
                                dependResult = Promise.resolve(dependResult);
                            }
                            return [4 /*yield*/, dependResult];
                        case 2:
                            dependIsOK = _a.sent();
                            if (!dependIsOK)
                                return [2 /*return*/, false];
                            _a.label = 3;
                        case 3:
                            j++;
                            return [3 /*break*/, 1];
                        case 4:
                            ps = new Array();
                            j = 0;
                            _a.label = 5;
                        case 5:
                            if (!(j < field.rules.length)) return [3 /*break*/, 8];
                            rule = field.rules[j];
                            p = rule.validate(field.element.value);
                            if (typeof p == 'boolean') {
                                p = Promise.resolve(p);
                            }
                            return [4 /*yield*/, p];
                        case 6:
                            isPass = _a.sent();
                            errorElement = void 0;
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
                                return [2 /*return*/, false];
                            _a.label = 7;
                        case 7:
                            j++;
                            return [3 /*break*/, 5];
                        case 8: return [2 /*return*/, true];
                    }
                });
            });
        };
        FormValidator.prototype.checkElement = function (inputElement) {
            if (!inputElement)
                throw dilu.errors.argumentNull('inputElement');
            var field = this.fields.filter(function (o) { return o.element == inputElement; })[0];
            if (!field)
                throw dilu.errors.elementValidateRuleNotSet(inputElement);
            return this.checkField(field);
        };
        FormValidator.errorClassName = 'validationMessage';
        return FormValidator;
    }());
    dilu.FormValidator = FormValidator;
})(dilu || (dilu = {}));
var dilu;
(function (dilu) {
    var ruleRegex = /^(.+?)\[(.+)\]$/, numericRegex = /^[0-9]+$/, integerRegex = /^\-?[0-9]+$/, decimalRegex = /^\-?[0-9]*\.?[0-9]+$/, emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, alphaRegex = /^[a-z]+$/i, alphaNumericRegex = /^[a-z0-9]+$/i, alphaDashRegex = /^[a-z0-9_\-]+$/i, naturalRegex = /^[0-9]+$/i, naturalNoZeroRegex = /^[1-9][0-9]*$/i, ipRegex = /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i, base64Regex = /[^a-zA-Z0-9\/\+=]/i, numericDashRegex = /^[\d\-\s]+$/, urlRegex = /^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/, mobileRegex = /^1[34578]\d{9}$/, dateRegex = /\d{4}-\d{1,2}-\d{1,2}/;
    var msgs = {
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
        required: function (error) {
            var validate = function (value) { return value != ''; };
            return createValidation(validate, error || msgs.required);
        },
        matches: function (otherElement, error) {
            var validate = function (value) { return value == otherElement.value; };
            return createValidation(validate, error || msgs.required);
        },
        email: function (error) {
            var validate = function (value) { return emailRegex.test(value); };
            return createValidation(validate, error || msgs.required);
        },
        minLength: function (length, error) {
            var validate = function (value) { return (value || '').length >= length; };
            return createValidation(validate, error || msgs.minLength);
        },
        maxLength: function (length, error) {
            var validate = function (value) { return (value || '').length <= length; };
            return createValidation(validate, error || msgs.matches);
        },
        greaterThan: function (value, error) {
            var validate = function (o) { return elementValueCompare(o, value) == 'greaterThan'; };
            return createValidation(validate, error || msgs.greater_than);
        },
        lessThan: function (value, error) {
            var validate = function (o) { return elementValueCompare(o, value) == 'lessThan'; };
            return createValidation(validate, error || msgs.less_than);
        },
        equal: function (value, error) {
            var validate = function (o) { return elementValueCompare(o, value) == 'greaterThan'; };
            return createValidation(validate, error || msgs.equal);
        },
        ip: function (error) {
            var validate = function (value) { return ipRegex.test(value); };
            return createValidation(validate, error || msgs.ip);
        },
        url: function (error) {
            var validate = function (value) { return urlRegex.test(value); };
            return createValidation(validate, error || msgs.valid_url);
        },
        mobile: function (error) {
            var validate = function (value) { return mobileRegex.test(value); };
            return createValidation(validate, error || msgs.mobile);
        },
        numeric: function (error) {
            var validate = function (value) { return numericRegex.test(value); };
            return createValidation(validate, error || msgs.numeric);
        },
        custom: function (validate, error) {
            return createValidation(validate, error);
        }
    };
    function elementValueCompare(value, otherValue) {
        var elementValue;
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

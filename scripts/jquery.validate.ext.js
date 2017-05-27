/// <reference path="../Share/jquery-1.10.1.js"/>
/// <reference path="../Share/jquery.validate.js"/>
/// <reference path="../Share/JQueryUI/jquery-ui.js"/>

/*
* Inline Form Validation Engine 1.3.9.5, jQuery plugin
* 
* Copyright(c) 2009, Cedric Dugas
* http://www.position-relative.net
*	
* Form validation engine which allow custom regex rules to be added.
* Licenced under the MIT Licence
* Modified by Jeffrey Lee, http://blog.darkthread.net, to support ASP.NET MVC 3
* Modified by Shu Mai to support theses furthure.
* 1. Support none FORM tag
* 2. Support on show error on fouce.
* 3. Fix bugs on get errors.
*/
(function () {

    if ($.fn.makeValidationInline != null)
        return;

    var validationInline = {
        errorClass: 'formError'
    };

    $.fn.makeValidationInline = function (options) {
        settings = $.extend({ errorTargets: {} }, options);
        settings.errorTargets = settings.errorTargets || {};

        return this.each(function () {
            function custErrorPlacement(error, $inputElement) {
                var elementName = $inputElement.prop('name');
                var errorTarget = settings.errorTargets[elementName] || $inputElement;

                var data = $(errorTarget).data('ui-tooltip');

                if (data == null) {
                    $(errorTarget).attr('title', error.text()).tooltip({
                        position: { my: 'center bottom', at: 'center top' }
                    });
                } else {
                    $(errorTarget).attr('title', error.text()).tooltip('enable');
                }
            }

            function custSuccess(error, inputElement) { // 'this' is the form element
                var elementName = $(inputElement).prop('name');
                var errorTarget = settings.errorTargets[elementName] || inputElement;
                $(errorTarget).tooltip('disable');
            }

            function custHighlight(element, errorClass, validClass) {
                var elementName = $(element).prop('name');
                var errorTarget = settings.errorTargets[elementName];
                if (errorTarget != null) {
                    $(errorTarget).addClass(errorClass).removeClass(validClass);
                }
                else {
                    $.validator.defaults.highlight(element, errorClass, validClass);
                }
            }

            function custUnhighlight(element, errorClass, validClass) {
                var elementName = $(element).prop('name');
                var errorTarget = settings.errorTargets[elementName];
                if (errorTarget != null) {
                    $(errorTarget).removeClass(errorClass).addClass(validClass);
                }
                else {
                    $.validator.defaults.unhighlight(element, errorClass, validClass);
                }
            }

            //#region change errorPlacement
            var valdSettings = options;
            options.errorElement = "div";
            options.errorPlacement = $.proxy(custErrorPlacement, this);
            options.success = $.proxy(custSuccess, this);
            options.highlight = $.proxy(custHighlight, this);
            options.unhighlight = $.proxy(custUnhighlight, this);
            //#endregion
        });
    };

    var _validate = $.fn.validate;
    var makeValidationInline = false;
    $.extend($.fn, {
        _createDetailsViewValidate: function (detailsView, options) {
            detailsView.validate = function (success, fail) {
                var validator = $(detailsView.get_element()).data('validator');
                validator.settings.submitHandler = function () {
                    success();
                };
                validator.settings.invalidHandler = function () {
                    if (fail != null)
                        fail();
                };
                $(detailsView.get_element()).submit();
            };

            options.errorClass = 'validateError';
            this.makeValidationInline(options)
            _validate.apply($(detailsView.get_element()), [options]);
        },
        validate: function (options) {
            if (this.length == 0)
                return this;

            options = options || {};

            var T = this;

            var gridView = $.data(this[0], 'JData.GridView');
            var detailsView = $.data(this[0], 'JData.DetailsView') || $.data(this[0], 'JData.FormView');
            if (gridView != null) {
                gridView.add_rowEditing(function (sender, args) {
                    args.row.validate = function (success, fail) {
                        options.submitHandler = function () {
                            success();
                        };
                        options.invalidHandler = function () {
                            if (fail != null)
                                fail();
                        };
                        options.errorClass = 'validateError';
                        T.makeValidationInline(options);
                        _validate.apply($(args.row.get_element()), [options]);
                        $(args.row.get_element()).submit();
                    };
                });
                gridView.add_rowCancelingEdit(function (sender, args) {
                    var validator = $(args.row.get_element()).data('validator');
                    if (validator != null)
                        validator.resetForm();
                });

                var insertEditor = gridView.get_insertEditor();
                var updateEditor = gridView.get_updateEditor();

                if (insertEditor != null && updateEditor == null) {
                    this._createDetailsViewValidate(insertEditor, options);
                }
                else if (insertEditor == null && updateEditor != null) {
                    this._createDetailsViewValidate(updateEditor, options);
                }
                else if (insertEditor != null && updateEditor != null) {
                    this._createDetailsViewValidate(insertEditor, options);
                    if (insertEditor != updateEditor)
                        this._createDetailsViewValidate(updateEditor, options);
                }


            } else if (detailsView != null) {

                this._createDetailsViewValidate(detailsView, options);

            } else {
                options.errorClass = 'validateError';
                this.makeValidationInline(options);
                _validate.apply(this, [options]);
                var validator = $(this).data('validator');
                if (!validator._hideErrors)
                    validator._hideErrors = validator.hideErrors;
                //validator = $.extend(validator, {
                //_hideErrors: validator.hideErrors,
                validator.hideErrors = function () {
                    this._hideErrors();
                    for (var i = 0; i < this.elements().length; i++) {
                        var isErrorElement = false;
                        var element = this.elements()[i];
                        for (var j = 0; j < this.errorList.length; j++) {
                            if (element == this.errorList[j].element) {
                                isErrorElement = true;
                                break;
                            }
                        }

                        if (!isErrorElement) {
                            var data = $(element).data('ui-tooltip');
                            if (data != null) {
                                $(element).tooltip('disable');
                            }
                        }

                    }
                    this.elements().each(function () {
                        //    var data = $(this).data('ui-tooltip');
                        //    if (data != null) {
                        //        $(this).tooltip('disable');
                        //    }
                    });
                }
                //});

                return validator;
            }

            return this;
        }
    });

    $.extend($.fn, {
        isValid: function () {

            var validator = this.data('validator');
            if (validator == null) {
                var msg = 'Can not get a validator for the element.';
                throw Error.create(msg);
            }

            validator.resetForm();
            this.submit();
            return (validator.errorList.length == 0);
        }
    });

    //=================================================================================
    // 说明： jquery.validate 只能应用于 form 表单下，下面的重写使其不再局限于 form 表单
    $.extend($.validator, {
        findValidator: function (element) {
            var validator = null;
            var p = element.parentNode;
            while (p != document) {
                validator = $(p).data('validator');
                if (validator != null)
                    break;

                p = p.parentNode;
            }

            return validator;
        },
        staticRules: function (element) {
            var rules = {};
            var validator = this.findValidator(element);
            if (validator != null && validator.settings.rules) {
                rules = $.validator.normalizeRule(validator.settings.rules[element.name]) || {};
            }
            return rules;
        }
    });

    $.extend($.validator.prototype, {
        init: function () {
            this.labelContainer = $(this.settings.errorLabelContainer);
            this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm);
            this.containers = $(this.settings.errorContainer).add(this.settings.errorLabelContainer);
            this.submitted = {};
            this.valueCache = {};
            this.pendingRequest = 0;
            this.pending = {};
            this.invalid = {};
            this.reset();

            var groups = (this.groups = {});
            $.each(this.settings.groups, function (key, value) {
                if (typeof value === "string") {
                    value = value.split(/\s/);
                }
                $.each(value, function (index, name) {
                    groups[name] = key;
                });
            });
            var rules = this.settings.rules;
            $.each(rules, function (key, value) {
                rules[key] = $.validator.normalizeRule(value);
            });

            function delegate(event) {
                var validator = $.validator.findValidator(this[0]); //$.data(this[0].form, "validator"),
                eventType = "on" + event.type.replace(/^validate/, "");
                if (validator.settings[eventType]) {
                    validator.settings[eventType].call(validator, this[0], event);
                }
            }

            $(this.currentForm)
                .validateDelegate(":text, [type='password'], [type='file'], select, textarea, " +
                    "[type='number'], [type='search'] ,[type='tel'], [type='url'], " +
                    "[type='email'], [type='datetime'], [type='date'], [type='month'], " +
                    "[type='week'], [type='time'], [type='datetime-local'], " +
                    "[type='range'], [type='color'] ",
                    "focusin focusout keyup", delegate)
                .validateDelegate("[type='radio'], [type='checkbox'], select, option", "click", delegate);

            if (this.settings.invalidHandler) {
                $(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler);
            }
        },
        errors: function () {
            var errorClass = validationInline.errorClass;
            return $(this.settings.errorElement + "." + errorClass, this.errorContext);
        }
    });
    //=================================================================================
})();

(function () {
    jQuery.validator.addMethod("greaterThan", function (value, element, params) {
        if ($(params[0]).val() != '') {
            if (!/Invalid|NaN/.test(new Date(value))) {
                return new Date(value) > new Date($(params[0]).val());
            }
            return isNaN(value) && isNaN($(params[0]).val()) || (Number(value) > Number($(params[0]).val()));
        };
        return true;
    }, 'Must be greater than {1}.');
})();


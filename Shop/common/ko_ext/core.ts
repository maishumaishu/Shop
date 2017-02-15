import ko = require('knockout');
import $ = require('jquery');

let extentions = {
    image: {
        imageServer: '',
        storeName: ''
    }
}


Number.prototype['toFormattedString'] = function (format) {
    var reg = new RegExp('^C[0-9]+');
    if (reg.test(format)) {
        var num = format.substr(1);
        return this.toFixed(num);
    }
    return this;
};

Date.prototype['toFormattedString'] = function (format) {
    switch (format) {
        case 'd':
            return chitu.Utility.format("{0}-{1}-{2}", this.getFullYear(), this.getMonth() + 1, this.getDate());
        case 'g':
            return chitu.Utility.format("{0}-{1}-{2} {3}:{4}", this.getFullYear(), this.getMonth() + 1, this.getDate(), this.getHours(), this.getMinutes());
        case 'G':
            return chitu.Utility.format("{0}-{1}-{2} {3}:{4}:{5}", this.getFullYear(), this.getMonth() + 1, this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds());
        case 't':
            return chitu.Utility.format("{0}:{1}", this.getHours(), this.getMinutes());
        case 'T':
            return chitu.Utility.format("{0}:{1}:{2}", this.getHours(), this.getMinutes(), this.getSeconds());
    }

    if (format != null && (<any>$).datepicker != null)
        return (<any>$).datepicker.formatDate(format, this)

    return this.toString();
};

var formatString = function (useLocale, args) {
    //TODO: 验证数组
    for (var i = 1; i < args.length; i++) {
        args[i] = ko.unwrap(args[i]);
    }
    var result = '';
    var format = args[0];

    for (var i = 0; ;) {
        var open = format.indexOf('{', i);
        var close = format.indexOf('}', i);
        if ((open < 0) && (close < 0)) {
            result += format.slice(i);
            break;
        }
        if ((close > 0) && ((close < open) || (open < 0))) {
            if (format.charAt(close + 1) !== '}') {
                throw 'Sys.Res.stringFormatBraceMismatch';
            }
            result += format.slice(i, close + 1);
            i = close + 2;
            continue;
        }

        result += format.slice(i, open);
        i = open + 1;

        if (format.charAt(i) === '{') {
            result += '{';
            i++;
            continue;
        }

        if (close < 0)
            throw 'Sys.Res.stringFormatBraceMismatch';


        var brace = format.substring(i, close);
        var colonIndex = brace.indexOf(':');
        var argNumber = parseInt((colonIndex < 0) ? brace : brace.substring(0, colonIndex), 10) + 1;
        if (isNaN(argNumber)) 'Sys.Res.stringFormatInvalid';
        var argFormat = (colonIndex < 0) ? '' : brace.substring(colonIndex + 1);
        var arg = args[argNumber];
        if (typeof (arg) === "undefined" || arg === null) {
            arg = '';
        }

        if (arg.toFormattedString) {
            result += arg.toFormattedString(argFormat);
        }
        else if (useLocale && arg.localeFormat) {
            result += arg.localeFormat(argFormat);
        }
        else if (arg.format) {
            result += arg.format(argFormat);
        }
        else
            result += arg.toString();

        i = close + 1;
    }

    return result;
}

var money = function (element, valueAccessor) {
    var str = formatString(true, ['￥{0:C2}', valueAccessor()]);
    element.innerHTML = str;
};
ko.bindingHandlers['money'] = {
    init: function (element, valueAccessor) {
        money(element, valueAccessor);
    },
    update: function (element, valueAccessor) {
        money(element, valueAccessor);
    }
};

var href = function (element, valueAccessor) {
    var value = valueAccessor();
    if ($.isArray(value)) {
        var str = formatString(true, value);
        $(element).attr('href', str);
    }
    else {
        $(element).attr('href', value);
    }
};
ko.bindingHandlers['href'] = {
    init: function (element, valueAccessor) {
        href(element, valueAccessor);
    },
    update: function (element, valueAccessor) {
        href(element, valueAccessor);
    }
};

var text = function (element, valueAccessor) {
    var value = valueAccessor();
    var str = $.isArray(value) ? formatString(true, value) : value;
    ko.utils['setTextContent'](element, str);
}
ko.bindingHandlers.text = {
    init: function (element, valueAccessor) {
        return text(element, valueAccessor);
    },
    update: function (element, valueAccessor) {
        return text(element, valueAccessor);
    }
};

function getConfig(element, name) {
    var dlg = $(element).attr(name);

    var config;
    if (dlg) {
        config = eval('(function(){return {' + dlg + '};})()');
    }
    else {
        config = {};
    }

    return config;

}

function translateClickAccessor(element, valueAccessor, allBindings, viewModel, bindingContext) {
    var value = ko.unwrap(valueAccessor());
    if (value == null) {
        return valueAccessor;
    }

    return $.proxy(function () {
        var element = this._element;
        var valueAccessor = this._valueAccessor;
        var allBindings = this._allBindings;
        var viewModel = this._viewModel;
        var bindingContext = this._bindingContext;
        var value = this._value;

        return function (viewModel) {

            var deferred: JQueryPromise<any> = $.Deferred();
            (<JQueryDeferred<any>>deferred).resolve();



            //if (dlg_config) {
            var config = getConfig(element, 'data-dialog');
            var content = config.content;
            if (config.type == 'confirm') {
                deferred = deferred.pipe(function () {
                    var result = $.Deferred();

                    requirejs(['text!ko.ext/ComfirmDialog.html'], function (html) {
                        var node = (<any>$(html).appendTo(document.body)).modal()[0];

                        var model = {
                            text: content,
                            ok: function () {
                                (<any>$(node)).modal('hide');
                                result.resolve();
                            },
                            cancel: function () {
                                result.reject();
                            }
                        }

                        ko.applyBindings(model, node);
                    });

                    return result;
                });
            }
            //}

            deferred = deferred.pipe(function () {
                var result = $.isFunction(value) ? value(viewModel, event) : value;

                if (result && $.isFunction(result.always)) {
                    $(element).attr('disabled', 'disabled');
                    $(element).addClass('disabled');

                    result.always(function () {
                        $(element).removeAttr('disabled');
                        $(element).removeClass('disabled');
                    });

                    result.done(function () {
                        if (config && config.type == 'flash') {
                            requirejs(['text!ko.ext/FlashDialog.html'], function (html) {
                                var node = (<any>$(html).appendTo(document.body)).modal()[0];

                                var model = {
                                    text: content
                                }

                                window.setTimeout(function () {
                                    (<any>$(node)).modal('hide');
                                    //===================================================
                                    //HACK:解决关闭窗口时，无法点击其它元素
                                    $(node).next('.modal-backdrop').remove();
                                    //===================================================
                                    $(node).remove();
                                }, 1000);

                                ko.applyBindings(model, node);
                            });
                        }

                    });
                }
                return result;
            });

            return deferred;
        };
    },
        { _element: element, _valueAccessor: valueAccessor, _allBindings: allBindings, _viewModel: viewModel, _bindingContext: bindingContext, _value: value });
}

var _click = ko.bindingHandlers.click;
ko.bindingHandlers.click = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        //var value = ko.unwrap(valueAccessor());
        //if (value != null) {
        valueAccessor = translateClickAccessor(element, valueAccessor, allBindings, viewModel, bindingContext);
        //}
        return _click.init(element, valueAccessor, allBindings, viewModel, bindingContext);
    }
};


//===============================================================================
// 说明：处理图片的懒加载。
function getImageUrl(src) {
    /// <param name="src" type="String"/>
    // 说明：替换图片路径
    var org_site = 'http://weixinmanage.lanfans.com';
    if (src.substr(0, 1) == '/') {
        src = extentions.image.imageServer + src;
    }
    else if (src.length > org_site.length && src.substr(0, org_site.length) == org_site) {
        src = extentions.image.imageServer + src.substr(org_site.length);
    }

    return src;
}

var ImageLoader = (function () {
    var MAX_THREAD = 200;
    var thread_count = 0;
    var items = [];
    var imageLoaded = $.Callbacks();

    window.setInterval(function () {
        if (items.length <= 0)
            return;

        if (thread_count >= MAX_THREAD)
            return;


        var item = items.shift();
        var element = item.element;
        var src = item.src;

        element.image = new Image();
        element.image.element = element;

        element.image.src = getImageUrl(src);
        thread_count = thread_count + 1;

        element.image.onload = function () {
            this.element.src = this.src;
            thread_count = thread_count - 1;
            imageLoaded.fire(this.element);
        };
        element.image.onerror = function () {
            thread_count = thread_count - 1;
            //TODO:显示图片加载失败
        };

    }, 100);

    return {
        load: function (element, src) {
            items.push({ element: element, src: src });
        },
        imageLoaded: imageLoaded
    };
})();

function getLogoImage(img_width, img_height) {

    var scale = (img_height / img_width).toFixed(2);
    var img_name = 'img_log' + scale;
    var img_src = localStorage.getItem(img_name);
    if (img_src)
        return img_src;

    var MAX_WIDTH = 320;
    var width = MAX_WIDTH;
    var height = width * new Number(scale).valueOf();

    var canvas = document.createElement('canvas');
    canvas.width = width; //img_width;
    canvas.height = height; //img_height;

    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'whitesmoke';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 设置字体
    ctx.font = "Bold 40px Arial";
    // 设置对齐方式
    ctx.textAlign = "left";
    // 设置填充颜色
    ctx.fillStyle = "#999";
    // 设置字体内容，以及在画布上的位置
    ctx.fillText(extentions.image.storeName, canvas.width / 2 - 75, canvas.height / 2);

    img_src = canvas.toDataURL('image/png');
    localStorage.setItem(img_name, img_src);
    return img_src;
}

var _attr = ko.bindingHandlers.attr;
ko.bindingHandlers.attr = (function () {
    return {
        'update': function (element, valueAccessor, allBindings) {
            if (element.tagName == 'IMG') {

                var config = getConfig(element, 'data-image');

                var value = ko.utils.unwrapObservable(valueAccessor()) || {};
                ko.utils['objectForEach'](value, function (attrName, attrValue) {
                    var src = ko.unwrap(attrValue);
                    if (attrName != 'src' || !src)
                        return true;

                    //==========================================================
                    // 说明：替换图片路径
                    var match = src.match(/_\d+_\d+/);
                    if (match && match.length > 0) {
                        var arr = match[0].split('_');
                        var img_width = new Number(arr[1]).valueOf();
                        var img_height = new Number(arr[2]).valueOf();

                        $(element).attr('width', img_width + 'px');
                        $(element).attr('height', img_height + 'px');

                        var src_replace
                        if (config.showLogo == null || config.showLogo == true)
                            src_replace = getLogoImage(img_width, img_height);

                        valueAccessor = $.proxy(function () {
                            var obj = ko.utils.unwrapObservable(this._source());
                            var src = ko.unwrap(obj.src);
                            obj.src = this._src;

                            var img_node: HTMLImageElement = this._element;
                            var image = new Image();
                            image.onload = function () {
                                img_node.src = (this as HTMLImageElement).src;
                            }
                            image.src = getImageUrl(src);

                            return obj;

                        }, { _source: valueAccessor, _src: src_replace, _element: element });
                    }
                    else {
                        value.src = src;
                        valueAccessor = $.proxy(function () {
                            return this._value;
                        }, { _value: value });
                    }
                });
            }
            return _attr.update(element, valueAccessor, allBindings);
        }
    }
})();

var _html = ko.bindingHandlers.html;
ko.bindingHandlers.html = {
    'update': function (element, valueAccessor, allBindings) {

        var result = _html.update(element, valueAccessor, allBindings);

        var $img = $(element).find('img');
        $img.each(function () {
            var org_site = 'http://weixinmanage.lanfans.com';
            var src = $(this).attr('src');

            $(this).addClass('img-full');

            var match = src.match(/_\d+_\d+/);
            if (match && match.length > 0) {
                var arr = match[0].split('_');
                var img_width = new Number(arr[1]).valueOf();
                var img_height = new Number(arr[2]).valueOf();

                $(this).attr('width', img_width + 'px');
                $(this).attr('height', img_height + 'px');

                var src_replace = getLogoImage(img_width, img_height);
                $(this).attr('src', src_replace);

                var image = new Image();
                image['element'] = this;
                image.onload = function () {
                    $(this['element']).attr('src', (this as HTMLImageElement).src);
                };
                image.src = getImageUrl(src);
            }
            else {
                $(this).attr('src', getImageUrl(src));
            }


        });

        return result;
    }
}


ko.bindingHandlers['tap'] = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        valueAccessor = translateClickAccessor(element, valueAccessor, allBindings, viewModel, bindingContext);
        $(element).on("tap", $.proxy(function (event) {

            this._valueAccessor()(viewModel, event);

        }, { _valueAccessor: valueAccessor }));
    }
}

export = extentions;
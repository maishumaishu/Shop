var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "maishu-chitu"], function (require, exports, chitu) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 说明：页面中元素的获取，都是实时 DOM 查询，而不是保存在一个变量中，是因为
     * 某些MVVM框架，可能会用到虚拟 DOM，把页面中的元素改写了。
     */
    // export const viewTagName = 'SECTION';
    exports.isCordovaApp = location.protocol === 'file:';
    var Page = (function (_super) {
        __extends(Page, _super);
        function Page(params) {
            var _this = _super.call(this, params) || this;
            _this.displayStatic = false;
            _this.allowSwipeBackGestrue = false;
            return _this;
        }
        return Page;
    }(chitu.Page));
    exports.Page = Page;
    var Application = (function (_super) {
        __extends(Application, _super);
        function Application(args) {
            var _this = _super.call(this, args) || this;
            _this.pageShown = chitu.Callbacks();
            _this.pageType = Page;
            if (isiOS)
                _this.pageDisplayType = PageDisplayImplement;
            else
                _this.pageDisplayType = LowMachinePageDisplayImplement;
            return _this;
        }
        Application.prototype.createPage = function (routeData) {
            var page = _super.prototype.createPage.call(this, routeData);
            //(page as Page).app = this;
            this.pageShown.fire(this, { page: page });
            return page;
        };
        return Application;
    }(chitu.Application));
    exports.Application = Application;
    var touch_move_time = 0;
    window.addEventListener('touchmove', function (e) {
        touch_move_time = Date.now();
    });
    var isiOS = (navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) || []).filter(function (o) { return o; }).length > 0; //ios终端
    function calculateAngle(x, y) {
        var d = Math.atan(Math.abs(y / x)) / 3.14159265 * 180;
        return d;
    }
    var PageDisplayImplement = (function () {
        function PageDisplayImplement(app) {
            this.animationTime = 400;
            this.app = app;
            this.windowWidth = window.innerWidth;
            this.previousPageStartX = 0 - this.windowWidth / 3;
        }
        PageDisplayImplement.prototype.enableGesture = function (page) {
            var _this = this;
            var startY, currentY;
            var startX, currentX;
            var moved = false;
            var SIDE_WIDTH = 20;
            var enable = false;
            var horizontal_swipe_angle = 35;
            var vertical_pull_angle = 65;
            var colse_position = window.innerWidth / 2;
            var previousPageStartX = 0 - window.innerWidth / 3;
            page.element.addEventListener('touchstart', function (event) {
                startY = event.touches[0].pageY;
                startX = event.touches[0].pageX;
                enable = startX <= SIDE_WIDTH;
            });
            page.element.addEventListener('touchmove', function (event) {
                currentX = event.targetTouches[0].pageX;
                currentY = event.targetTouches[0].pageY;
                //========================================
                // currentX < 0 表示 IOS 侧划
                if (isiOS && currentX < 0 || !enable) {
                    return;
                }
                //========================================
                var deltaX = currentX - startX;
                var angle = calculateAngle(deltaX, currentY - startY);
                if (angle < horizontal_swipe_angle && deltaX > 0) {
                    page.element.style.transform = "translate(" + deltaX + "px, 0px)";
                    page.element.style.transition = '0s';
                    if (page.previous != null) {
                        page.previous.element.style.transform = "translate(" + (previousPageStartX + deltaX / 3) + "px, 0px)";
                        page.previous.element.style.transition = '0s';
                        page.previous.element.style.display = 'block';
                    }
                    disableNativeScroll(page.element);
                    moved = true;
                    event.preventDefault();
                    console.log('preventDefault gestured');
                }
            });
            var end = function (event) {
                if (!moved)
                    return;
                var deltaX = currentX - startX;
                if (deltaX > colse_position) {
                    console.assert(_this.app != null);
                    _this.app.back();
                }
                else {
                    page.element.style.transform = "translate(0px, 0px)";
                    page.element.style.transition = '0.4s';
                    if (page.previous) {
                        page.previous.element.style.transform = "translate(" + previousPageStartX + "px,0px)";
                        page.previous.element.style.transition = "0.4s";
                        window.setTimeout(function () {
                            page.previous.element.style.display = 'none';
                            page.previous.element.style.removeProperty('transform');
                            page.previous.element.style.removeProperty('transition');
                            page.element.style.removeProperty('transform');
                            page.element.style.removeProperty('transition');
                        }, 400);
                    }
                }
                moved = false;
            };
            page.element.addEventListener('touchcancel', function (event) { return end(event); });
            page.element.addEventListener('touchend', function (event) { return end(event); });
            /** 禁用原生的滚动 */
            function disableNativeScroll(element) {
                element.style.overflowY = 'hidden';
            }
            /** 启用原生的滚动 */
            function enableNativeScroll(element) {
                element.style.overflowY = 'scroll';
            }
        };
        PageDisplayImplement.prototype.show = function (page) {
            var _this = this;
            if (!page.gestured) {
                page.gestured = true;
                if (page.allowSwipeBackGestrue)
                    this.enableGesture(page);
            }
            var maxZIndex = 1;
            var pageElements = document.getElementsByClassName('mobile-page');
            for (var i = 0; i < pageElements.length; i++) {
                var zIndex = new Number(pageElements.item(i).style.zIndex || '0').valueOf();
                if (zIndex > maxZIndex) {
                    maxZIndex = zIndex;
                }
            }
            page.element.style.zIndex = "" + (maxZIndex + 1);
            page.element.style.display = 'block';
            if (page.displayStatic) {
                if (page.previous) {
                    page.previous.element.style.display = 'none';
                }
                return Promise.resolve();
            }
            page.element.style.transform = "translate(100%,0px)";
            if (page.previous) {
                page.previous.element.style.transform = "translate(0px,0px)";
                page.previous.element.style.transition = this.animationTime / 1000 + "s";
            }
            return new Promise(function (reslove) {
                var delay = 100;
                window.setTimeout(function () {
                    page.element.style.transform = "translate(0px,0px)";
                    page.element.style.transition = _this.animationTime / 1000 + "s";
                    if (page.previous) {
                        page.previous.element.style.transform = "translate(" + _this.previousPageStartX + "px,0px)";
                        //==================================================================
                        // 由于距离短，时间可以延迟
                        page.previous.element.style.transition = (_this.animationTime + 200) / 1000 + "s";
                    }
                }, delay);
                window.setTimeout(reslove, delay + _this.animationTime);
            }).then(function () {
                page.element.style.removeProperty('transform');
                page.element.style.removeProperty('transition');
                if (page.previous) {
                    page.previous.element.style.display = 'none';
                    page.previous.element.style.removeProperty('transform');
                    page.previous.element.style.removeProperty('transition');
                }
            });
        };
        PageDisplayImplement.prototype.hide = function (page) {
            var _this = this;
            return new Promise(function (reslove) {
                //============================================
                // 如果 touchmove 时间与方法调用的时间在 500ms 以内，则认为是通过系统浏览器滑屏返回，
                // 通过系统浏览器滑屏返回，是不需要有返回效果的。
                var now = Date.now();
                if (!exports.isCordovaApp && isiOS && now - touch_move_time < 500 || page.displayStatic) {
                    page.element.style.display = 'none';
                    if (page.previous) {
                        page.previous.element.style.display = 'block';
                        page.previous.element.style.transition = "0s";
                        page.previous.element.style.transform = 'translate(0,0)';
                    }
                    reslove();
                    return;
                }
                //============================================
                page.element.style.transition = _this.animationTime / 1000 + "s";
                page.element.style.transform = "translate(100%,0px)";
                if (page.previous) {
                    page.previous.element.style.display = 'block';
                    var delay_1 = 0;
                    if (!page.previous.element.style.transform) {
                        page.previous.element.style.transform = "translate(" + _this.previousPageStartX + "px, 0px)";
                        delay_1 = 50;
                    }
                    window.setTimeout(function () {
                        page.previous.element.style.transform = "translate(0px, 0px)";
                        page.previous.element.style.transition = (_this.animationTime - delay_1) / 1000 + "s";
                    }, delay_1);
                }
                window.setTimeout(function () {
                    page.element.style.display = 'none';
                    page.element.style.removeProperty('transform');
                    page.element.style.removeProperty('transition');
                    if (page.previous) {
                        page.previous.element.style.removeProperty('transform');
                        page.previous.element.style.removeProperty('transition');
                    }
                    reslove();
                }, 500);
            });
        };
        return PageDisplayImplement;
    }());
    var LowMachinePageDisplayImplement = (function () {
        function LowMachinePageDisplayImplement(app) {
            this.app = app;
            this.windowWidth = window.innerWidth;
        }
        LowMachinePageDisplayImplement.prototype.enableGesture = function (page) {
            var _this = this;
            var startY, currentY;
            var startX, currentX;
            var moved = false;
            var SIDE_WIDTH = 20;
            var enable = false;
            var horizontal_swipe_angle = 35;
            var vertical_pull_angle = 65;
            var colse_position = window.innerWidth / 2;
            var previousPageStartX = 0 - window.innerWidth / 3;
            page.element.addEventListener('touchstart', function (event) {
                startY = event.touches[0].pageY;
                startX = event.touches[0].pageX;
                enable = startX <= SIDE_WIDTH;
                if (page.previous) {
                    page.previous.element.style.display = 'block';
                }
            });
            page.element.addEventListener('touchmove', function (event) {
                currentX = event.targetTouches[0].pageX;
                currentY = event.targetTouches[0].pageY;
                //========================================
                // currentX < 0 表示 IOS 侧划
                if (isiOS && currentX < 0 || !enable) {
                    return;
                }
                //========================================
                var deltaX = currentX - startX;
                var angle = calculateAngle(deltaX, currentY - startY);
                if (angle < horizontal_swipe_angle && deltaX > 0) {
                    page.element.style.transform = "translate(" + deltaX + "px, 0px)";
                    page.element.style.transition = '0s';
                    disableNativeScroll(page.element);
                    moved = true;
                    event.preventDefault();
                    console.log('preventDefault gestured');
                }
            });
            var end = function (event) {
                if (!moved)
                    return;
                var deltaX = currentX - startX;
                if (deltaX > colse_position) {
                    console.assert(_this.app != null);
                    _this.app.back();
                }
                else {
                    page.element.style.transform = "translate(0px, 0px)";
                    page.element.style.transition = '0.4s';
                    setTimeout(function () {
                        if (page.previous) {
                            page.previous.element.style.display = 'none';
                        }
                    }, 500);
                }
                setTimeout(function () {
                    page.element.style.removeProperty('transform');
                    page.element.style.removeProperty('transition');
                }, 500);
                moved = false;
            };
            page.element.addEventListener('touchcancel', function (event) { return end(event); });
            page.element.addEventListener('touchend', function (event) { return end(event); });
            /** 禁用原生的滚动 */
            function disableNativeScroll(element) {
                element.style.overflowY = 'hidden';
            }
            /** 启用原生的滚动 */
            function enableNativeScroll(element) {
                element.style.overflowY = 'scroll';
            }
        };
        LowMachinePageDisplayImplement.prototype.show = function (page) {
            if (!page.gestured) {
                page.gestured = true;
                if (page.allowSwipeBackGestrue)
                    this.enableGesture(page);
            }
            var maxZIndex = 1;
            var pageElements = document.getElementsByClassName('page');
            for (var i = 0; i < pageElements.length; i++) {
                var zIndex = new Number(pageElements.item(i).style.zIndex || '0').valueOf();
                if (zIndex > maxZIndex) {
                    maxZIndex = zIndex;
                }
            }
            page.element.style.zIndex = "" + (maxZIndex + 1);
            page.element.style.display = 'block';
            if (page.displayStatic) {
                if (page.previous) {
                    page.previous.element.style.display = 'none';
                }
                return Promise.resolve();
            }
            page.element.style.transform = "translate(100%,0px)";
            return new Promise(function (reslove) {
                var playTime = 500;
                var delay = 50;
                window.setTimeout(function () {
                    page.element.style.transform = "translate(0px,0px)";
                    page.element.style.transition = playTime / 1000 + "s";
                }, delay);
                window.setTimeout(reslove, delay + playTime);
            }).then(function () {
                page.element.style.removeProperty('transform');
                page.element.style.removeProperty('transition');
                if (page.previous) {
                    page.previous.element.style.display = 'none';
                }
            });
        };
        LowMachinePageDisplayImplement.prototype.hide = function (page) {
            //============================================
            // 如果 touchmove 时间与方法调用的时间在 500ms 以内，则认为是通过滑屏返回，
            // 通过滑屏返回，是不需要有返回效果的。
            if (isiOS && Date.now() - touch_move_time < 500 || page.displayStatic) {
                page.element.style.display = 'none';
                if (page.previous) {
                    page.previous.element.style.display = 'block';
                    page.previous.element.style.removeProperty('transform');
                    page.previous.element.style.removeProperty('transition');
                }
                return Promise.resolve();
            }
            //============================================
            page.element.style.transform = "translate(100%,0px)";
            page.element.style.transition = '0.4s';
            if (page.previous) {
                page.previous.element.style.display = 'block';
            }
            return new Promise(function (reslove) {
                window.setTimeout(function () {
                    page.element.style.display = 'none';
                    page.element.style.removeProperty('transform');
                    page.element.style.removeProperty('transition');
                    reslove();
                }, 500);
            });
        };
        return LowMachinePageDisplayImplement;
    }());
});

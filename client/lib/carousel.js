//TODO: 如果 items 为0,或者为 1 的情况。
//import cm = require('chitu.mobile');
define(["require", "exports"], function (require, exports) {
    "use strict";
    var Errors = (function () {
        function Errors() {
        }
        Errors.argumentNull = function (parameterName) {
            var msg = "Argument '" + parameterName + "' cannt be null.";
            return new Error(msg);
        };
        return Errors;
    }());
    var animateTime = 400; //ms，这个数值，要和样式中的设定一致。
    var MOVE_PERSEND = 20;
    var Carousel = (function () {
        function Carousel(element, options) {
            this.playTimeId = 0; // 0 为停止中，－1 为已停止，非 0 为播放中。
            this.playing = false;
            this.paned = false;
            this.is_pause = false;
            if (element == null)
                throw Errors.argumentNull('element');
            this.window_width = document.body.clientWidth;
            this.items = new Array();
            var q = element.querySelectorAll('.item');
            for (var i = 0; i < q.length; i++) {
                this.items[i] = q.item(i);
            }
            this.indicators = new Array();
            q = element.querySelectorAll('.carousel-indicators li');
            for (var i = 0; i < q.length; i++)
                this.indicators[i] = q.item(i);
            console.assert(this.indicators.length == this.items.length);
            this.active_index = this.active_index >= 0 ? this.active_index : 0;
            addClassName(this.activeItem(), 'active');
            addClassName(this.indicators[this.active_index], 'active');
            this.listenTouch(element);
            options = Object.assign({ autoplay: true }, options);
            this.autoplay = options.autoplay;
            if (this.autoplay) {
                this.play();
                // let pageView = this.findPageView(element);
                // console.assert(pageView != null);
                // pageView.addEventListener('touchstart', () => {
                //     this.stop();
                // });
                // pageView.addEventListener('touchend', () => {
                //     this.play();
                // })
            }
        }
        Carousel.prototype.listenTouch = function (element) {
            var _this = this;
            var startY, currentY;
            var startX, currentX;
            var moving;
            var horizontal_swipe_angle = 35;
            var vertical_pull_angle = 65;
            element.addEventListener('touchstart', function (event) {
                startY = event.touches[0].pageY;
                startX = event.touches[0].pageX;
                _this.panstart(event);
            });
            element.addEventListener('touchmove', function (event) {
                currentX = event.targetTouches[0].pageX;
                currentY = event.targetTouches[0].pageY;
                var angle = calculateAngle(currentX - startX, currentY - startY);
                if (angle < horizontal_swipe_angle) {
                    moving = 'horizontal';
                    _this.panmove(event, currentX - startX);
                }
                if (moving != null) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            });
            var calculateAngle = function (x, y) {
                var d = Math.atan(Math.abs(y / x)) / 3.14159265 * 180;
                return d;
            };
            var readyElement;
            var initElement;
            var endHorizontal = function (event, deltaX) {
                moving = null;
                _this.panend(event, deltaX);
            };
            element.addEventListener('touchcancel', function (event) { return endHorizontal(event, currentX - startX); });
            element.addEventListener('touchend', function (event) { return endHorizontal(event, currentX - startX); });
        };
        Carousel.prototype.panstart = function (e) {
            if (this.is_pause)
                return false;
            this.stop();
        };
        Carousel.prototype.panmove = function (e, deltaX) {
            var percent_position = Math.floor(deltaX / document.body.clientWidth * 100);
            if (this.active_position == percent_position || this.playing == true) {
                return;
            }
            this.paned = true;
            this.move(this.activeItem(), deltaX, 0);
            this.active_position = percent_position;
            if (percent_position < 0) {
                this.nextItem().className = 'item next';
                this.move(this.nextItem(), this.window_width + deltaX, 0);
            }
            else if (percent_position > 0) {
                this.prevItem().className = 'item prev';
                this.move(this.prevItem(), deltaX - this.window_width, 0);
            }
        };
        Carousel.prototype.move = function (element, deltaX, time) {
            element.style.transform = "translate(" + deltaX + "px, 0px)";
            element.style.transition = time / 1000 + "s";
        };
        Carousel.prototype.panend = function (e, deltaX) {
            var _this = this;
            if (this.paned == false)
                return;
            this.paned = false;
            var duration_time = 200;
            var p = MOVE_PERSEND;
            if (this.active_position > 0 && this.active_position >= p) {
                this.move(this.activeItem(), this.window_width, duration_time);
                this.move(this.prevItem(), 0, duration_time);
                window.setTimeout(function () {
                    removeClassName(_this.prevItem(), 'prev', 'next');
                    addClassName(_this.prevItem(), 'active');
                    removeClassName(_this.activeItem(), 'active');
                    _this.decreaseActiveIndex();
                }, duration_time);
            }
            else if (this.active_position > 0 && this.active_position < p) {
                this.move(this.activeItem(), 0, duration_time); //
                this.move(this.prevItem(), 0 - this.window_width, duration_time);
            }
            else if (this.active_position <= 0 - p) {
                this.move(this.activeItem(), 0 - this.window_width, duration_time);
                this.move(this.nextItem(), 0, duration_time);
                window.setTimeout(function () {
                    removeClassName(_this.nextItem(), 'prev', 'next');
                    addClassName(_this.nextItem(), 'active');
                    removeClassName(_this.activeItem(), 'active');
                    _this.increaseActiveIndex();
                }, duration_time);
            }
            else {
                // 取消滑动到下一页，还原回原来的位置。
                this.move(this.activeItem(), 0, duration_time);
                this.move(this.nextItem(), this.window_width, duration_time);
            }
            window.setTimeout(function () {
                if (_this.autoplay) {
                    _this.play();
                }
            }, duration_time + 200);
        };
        Carousel.prototype.increaseActiveIndex = function () {
            this.setIndicatorClassName(this.active_index, '');
            this.active_index = this.active_index + 1;
            if (this.active_index > this.items.length - 1)
                this.active_index = 0;
            this.setIndicatorClassName(this.active_index, 'active');
            return this.active_index;
        };
        Carousel.prototype.decreaseActiveIndex = function () {
            this.setIndicatorClassName(this.active_index, '');
            this.active_index = this.active_index - 1;
            if (this.active_index < 0)
                this.active_index = this.items.length - 1;
            this.setIndicatorClassName(this.active_index, 'active');
        };
        Carousel.prototype.nextItemIndex = function () {
            var next = this.active_index + 1;
            if (next > this.items.length - 1)
                next = 0;
            return next;
        };
        Carousel.prototype.prevItemIndex = function () {
            var prev = this.active_index - 1;
            if (prev < 0)
                prev = this.items.length - 1;
            return prev;
        };
        Carousel.prototype.nextItem = function () {
            var nextIndex = this.active_index + 1;
            if (nextIndex > this.items.length - 1)
                nextIndex = 0;
            return this.items[nextIndex];
        };
        Carousel.prototype.prevItem = function () {
            var prevIndex = this.active_index - 1;
            if (prevIndex < 0)
                prevIndex = this.items.length - 1;
            return this.items[prevIndex];
        };
        Carousel.prototype.activeItem = function () {
            return this.items[this.active_index];
        };
        Carousel.prototype.moveNext = function () {
            var _this = this;
            if (this.playTimeId == 0)
                return;
            if (this.playing == true)
                return;
            this.playing = true;
            this.nextItem().style.transform = this.nextItem().style.webkitTransform = '';
            this.nextItem().style.transitionDuration = this.nextItem().style.webkitTransitionDuration = '';
            this.activeItem().style.transform = this.activeItem().style.webkitTransform = '';
            this.activeItem().style.transitionDuration = this.activeItem().style.webkitTransitionDuration = '';
            //==================================================
            // 加入 next 样式式，使得该 item 在 active item 右边。
            this.activeItem().className = 'item active';
            this.nextItem().className = 'item next';
            //==================================================
            // 需要延时，否则第二个动画不生效。
            window.setTimeout(function () {
                addClassName(_this.activeItem(), 'left');
                addClassName(_this.nextItem(), 'active');
                //==================================================
                // 动画完成后，清除样式。
                setTimeout(function () {
                    _this.nextItem().className = 'item active';
                    _this.activeItem().className = 'item';
                    _this.increaseActiveIndex();
                    _this.playing = false;
                }, animateTime);
                //==================================================
            }, 50);
        };
        Carousel.prototype.movePrev = function () {
            var _this = this;
            if (this.playTimeId == 0)
                return;
            if (this.playing == true)
                return;
            this.playing = true;
            //==================================================
            // 加入 next 样式式，使得该 item 在 active item 右边。
            addClassName(this.prevItem(), 'prev');
            this.prevItem().style.transform = this.prevItem().style.webkitTransform = '';
            this.activeItem().style.transform = this.activeItem().style.webkitTransform = '';
            //==================================================
            // 需要延时，否则第二个动画不生效。
            window.setTimeout(function () {
                addClassName(_this.activeItem(), 'right');
                addClassName(_this.prevItem(), 'active');
                //==================================================
                // 动画完成后，清除样式。
                setTimeout(function () {
                    removeClassName(_this.prevItem(), 'prev', 'next');
                    removeClassName(_this.activeItem(), 'right', 'active');
                    _this.decreaseActiveIndex();
                    _this.playing = false;
                }, animateTime);
                //==================================================
            }, 10);
        };
        Carousel.prototype.setIndicatorClassName = function (index, className) {
            var indicator = this.indicators[index];
            if (indicator == null) {
                return;
            }
            indicator.className = className;
        };
        Carousel.prototype.stop = function () {
            if (this.playTimeId == 0) {
                return;
            }
            window.clearInterval(this.playTimeId);
            this.playTimeId = 0;
        };
        Object.defineProperty(Carousel.prototype, "pause", {
            get: function () {
                return this.is_pause;
            },
            set: function (value) {
                this.is_pause = value;
                if (this.is_pause == true)
                    this.stop();
            },
            enumerable: true,
            configurable: true
        });
        // private findPageView(element: HTMLElement) {
        //     console.assert(element != null);
        //     let p = element;
        //     while (p) {
        //         if (p.tagName == cm.viewTagName) {
        //             return p;
        //         }
        //         p = p.parentElement;
        //     }
        // }
        Carousel.prototype.play = function () {
            var _this = this;
            if (this.playTimeId != 0)
                return;
            this.playTimeId = window.setInterval(function () {
                _this.moveNext();
            }, 2000);
        };
        return Carousel;
    }());
    function addClassName(element) {
        var classNames = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            classNames[_i - 1] = arguments[_i];
        }
        console.assert(element.className != null);
        for (var _a = 0, classNames_1 = classNames; _a < classNames_1.length; _a++) {
            var className = classNames_1[_a];
            if (element.className.indexOf(className) >= 0)
                continue;
            element.className = element.className + ' ' + className;
        }
    }
    function removeClassName(element) {
        var classNames = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            classNames[_i - 1] = arguments[_i];
        }
        console.assert(element.className != null);
        for (var i = 0; i < classNames.length; i++)
            element.className = element.className.replace(classNames[i], '');
    }
    return Carousel;
});

import { componentsDir, Control, ControlProps } from 'components/common'
import { imageUrl } from '../../share/common';

requirejs([`css!${componentsDir}/carousel/control`]);

// let Carousel = (function () {

class Errors {
    static argumentNull(parameterName) {
        let msg = `Argument '${parameterName}' cannt be null.`;
        return new Error(msg);
    }
}

//=========================================================
// 这个数值，要大于样式中的设定一致。加一段时间确定动画完全停止
let animateTime = 400 + 600;//ms，
//=========================================================
const MOVE_PERSEND = 20;
const MIN_PLAY_INTERVAL = 3000;
type CarouselOptions = {
    autoplay?: boolean,
    playInterval?: number,
}
class Carousel {

    private playTimeId: number = 0;// 0 为停止中，－1 为已停止，非 0 为播放中。
    private playing = false;
    private paned = false;
    private window_width;// = window.outerWidth; //$(window).width();
    private active_position: number; // 记录活动页的位置（按页面的百份比）
    private active_index: number;
    private items: HTMLElement[];
    private indicators: HTMLElement[];
    private is_pause: boolean = false;
    private autoplay: boolean;
    private playInterval: number;
    constructor(element: HTMLElement, options?: CarouselOptions) {
        if (element == null)
            throw Errors.argumentNull('element');

        this.window_width = document.body.clientWidth;
        this.items = new Array<HTMLElement>();
        let q = element.querySelectorAll('.item');
        for (let i = 0; i < q.length; i++) {
            this.items[i] = q.item(i) as HTMLElement;
        }

        this.indicators = new Array<HTMLElement>();
        q = element.querySelectorAll('.carousel-indicators li');
        for (let i = 0; i < q.length; i++)
            this.indicators[i] = q.item(i) as HTMLElement;

        console.assert(this.indicators.length == this.items.length);

        this.active_index = this.active_index >= 0 ? this.active_index : 0;

        addClassName(this.activeItem(), 'active');
        addClassName(this.indicators[this.active_index], 'active');

        this.listenTouch(element);

        let defaultOptions: CarouselOptions = {
            autoplay: true,
            playInterval: MIN_PLAY_INTERVAL,
        }
        options = Object.assign(defaultOptions, options);
        this.autoplay = options.autoplay;
        this.playInterval = options.playInterval;

        if (this.autoplay) {
            this.play();
        }

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState == 'visible' && this.autoplay) {
                this.play();
            }
            else {
                this.stop();
            }
        })
    }

    private listenTouch(element: HTMLElement) {
        let startY, currentY;
        let startX, currentX;
        let moving: 'horizontal' | 'vertical';

        let horizontal_swipe_angle = 35;
        let vertical_pull_angle = 65;

        element.addEventListener('touchstart', (event: TouchEvent) => {
            startY = event.touches[0].pageY;
            startX = event.touches[0].pageX;
            this.panstart(event);
        })

        element.addEventListener('touchmove', (event: TouchEvent) => {
            currentX = event.targetTouches[0].pageX;
            currentY = event.targetTouches[0].pageY;
            let angle = calculateAngle(currentX - startX, currentY - startY);
            if (angle < horizontal_swipe_angle) {
                moving = 'horizontal';
                this.panmove(event, currentX - startX);
            }

            if (moving != null) {
                event.preventDefault();
                event.stopPropagation();
            }
        })

        var calculateAngle = (x, y) => {
            let d = Math.atan(Math.abs(y / x)) / 3.14159265 * 180;
            return d;
        }


        let readyElement: HTMLElement;
        let initElement: HTMLElement;

        var endHorizontal = (event: TouchEvent, deltaX: number) => {
            moving = null;
            this.panend(event, deltaX);
        }

        element.addEventListener('touchcancel', (event: TouchEvent) => endHorizontal(event, currentX - startX));
        element.addEventListener('touchend', (event: TouchEvent) => endHorizontal(event, currentX - startX));
    }

    private panstart(e: TouchEvent) {
        if (this.is_pause)
            return false;

        this.stop();
    }
    private panmove(e: TouchEvent, deltaX: number) {
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
    }

    private move(element: HTMLElement, deltaX: number, time: number) {
        element.style.transform = `translate(${deltaX}px, 0px)`;
        element.style.transition = `${time / 1000}s`;
    }

    private panend(e: TouchEvent, deltaX: number) {
        if (this.paned == false)
            return;

        this.paned = false;
        var duration_time = 0;
        let p = MOVE_PERSEND;
        if (this.active_position > 0 && this.active_position >= p) {
            this.move(this.activeItem(), this.window_width, duration_time);
            this.move(this.prevItem(), 0, duration_time);

            window.setTimeout(() => {
                removeClassName(this.prevItem(), 'prev', 'next');
                addClassName(this.prevItem(), 'active');
                removeClassName(this.activeItem(), 'active');
                this.decreaseActiveIndex();

            }, duration_time);
        }
        else if (this.active_position > 0 && this.active_position < p) {
            this.move(this.activeItem(), 0, duration_time);//
            this.move(this.prevItem(), 0 - this.window_width, duration_time);
        }
        else if (this.active_position <= 0 - p) {
            this.move(this.activeItem(), 0 - this.window_width, duration_time);
            this.move(this.nextItem(), 0, duration_time);

            window.setTimeout(() => {
                removeClassName(this.nextItem(), 'prev', 'next');
                addClassName(this.nextItem(), 'active');
                removeClassName(this.activeItem(), 'active');
                this.increaseActiveIndex();

            }, duration_time);
        }
        else {
            // 取消滑动到下一页，还原回原来的位置。
            this.move(this.activeItem(), 0, duration_time);
            this.move(this.nextItem(), this.window_width, duration_time);
        }

        window.setTimeout(() => {
            if (this.autoplay) {
                this.play();
            }

        }, duration_time + 200);
    }
    private increaseActiveIndex() {
        this.setIndicatorClassName(this.active_index, '');
        this.active_index = this.active_index + 1;
        if (this.active_index > this.items.length - 1)
            this.active_index = 0;

        this.setIndicatorClassName(this.active_index, 'active');
        return this.active_index;
    }
    private decreaseActiveIndex() {
        this.setIndicatorClassName(this.active_index, '');
        this.active_index = this.active_index - 1;
        if (this.active_index < 0)
            this.active_index = this.items.length - 1;

        this.setIndicatorClassName(this.active_index, 'active');
    }
    private nextItemIndex(): number {
        var next = this.active_index + 1;
        if (next > this.items.length - 1)
            next = 0;

        return next;
    }
    private prevItemIndex() {
        var prev = this.active_index - 1;
        if (prev < 0)
            prev = this.items.length - 1;

        return prev;
    }
    private nextItem() {
        var nextIndex = this.active_index + 1;
        if (nextIndex > this.items.length - 1)
            nextIndex = 0;

        return this.items[nextIndex];
    }
    private prevItem() {
        var prevIndex = this.active_index - 1;
        if (prevIndex < 0)
            prevIndex = this.items.length - 1;

        return this.items[prevIndex];
    }
    private activeItem() {
        return this.items[this.active_index];
    }
    private async moveNext(): Promise<any> {
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


        return new Promise((resolve, reject) => {
            //==================================================
            // 需要延时，否则第二个动画不生效。
            window.setTimeout(() => {
                addClassName(this.activeItem(), 'left');
                addClassName(this.nextItem(), 'active');

                //==================================================
                // 动画完成后，清除样式。
                setTimeout(() => {
                    this.nextItem().className = 'item active';
                    this.activeItem().className = 'item';
                    this.increaseActiveIndex();

                    this.playing = false;
                    resolve();
                }, animateTime);
                //==================================================
            }, 50);

        })
    }

    private movePrev() {
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
        window.setTimeout(() => {
            addClassName(this.activeItem(), 'right');
            addClassName(this.prevItem(), 'active');

            //==================================================
            // 动画完成后，清除样式。
            setTimeout(() => {
                removeClassName(this.prevItem(), 'prev', 'next')
                removeClassName(this.activeItem(), 'right', 'active');
                this.decreaseActiveIndex();
                this.playing = false;
            }, animateTime);
            //==================================================

        }, 10);

    }

    private setIndicatorClassName(index: number, className: string) {
        let indicator = this.indicators[index];
        if (indicator == null) {
            return;
        }

        indicator.className = className;
    }

    public stop() {
        if (this.playTimeId == 0) {
            return;
        }
        window.clearInterval(this.playTimeId);
        this.playTimeId = 0;
    }

    private get pause(): boolean {
        return this.is_pause;
    }
    private set pause(value: boolean) {
        this.is_pause = value;
        if (this.is_pause == true)
            this.stop();
    }

    public play() {
        if (this.playTimeId != 0)
            return;

        this.playTimeId = window.setInterval(() => {
            this.moveNext();
        }, this.playInterval);
    }

    public setActiveIndex(index: number) {
        if (index < 0) index = 0;
        if (index > this.items.length - 1) index = this.items.length - 1;

        this.active_index = index;
        for (let i = 0; i < this.items.length; i++) {
            if (i == index) {
                addClassName(this.items[i], 'active');
                addClassName(this.indicators[i], 'active');
                continue;
            }

            removeClassName(this.items[i], 'active');
            removeClassName(this.indicators[i], 'active');
        }

    }
}

function addClassName(element: HTMLElement, ...classNames: string[]) {
    console.assert(element.className != null);

    for (let className of classNames) {
        if (element.className.indexOf(className) >= 0)
            continue;

        element.className = element.className + ' ' + className;
    }
}

function removeClassName(element: HTMLElement, ...classNames: string[]) {
    console.assert(element.className != null);
    for (let i = 0; i < classNames.length; i++)
        element.className = element.className.replace(classNames[i], '');
}

export interface CarouselItem {
    image: string, url: string, title: string
}
export interface Props extends ControlProps<CarouselControl> {

}
export interface State {
    // imagePaths: string[],
    items: CarouselItem[],
    autoplay: boolean,

    // 图片的长宽比
    itemScale?: number,

    // 点图片执行的动作，showImage 显示大图，openPage 打开页面
    clickType: 'showImage' | 'openPage'
}

export class CarouselControl extends Control<Props, State> {
    carousel: Carousel;
    element: HTMLElement;
    constructor(props) {
        super(props);
        this.loadControlCSS();
        this.state = { items: [], autoplay: true, clickType: 'openPage' };
    }
    get persistentMembers(): (keyof State)[] {
        return ["items", "autoplay", "itemScale", "clickType"]
    }
    componentDidMount() {
        //=======================================================
        // 如果没有设置轮播图片，element 为空
        if (this.element) {
            let { autoplay } = this.state;
            this.carousel = new Carousel(this.element, { autoplay });
        }
        //=======================================================
    }
    componentDidUpdate() {
        let { autoplay } = this.state;

        if (this.element == null && this.carousel == null)
            return;

        if (this.element != null && this.carousel == null) {
            this.carousel = new Carousel(this.element, { autoplay });
            return;
        }

        if (this.element == null) {
            return;
        }

        console.assert(this.element != null);
        console.assert(this.carousel != null);
        this.carousel.stop();
        this.carousel = new Carousel(this.element, { autoplay });
        this.carousel.setActiveIndex(0);
        // if (autoplay == false) {
        //     this.carousel.stop();
        //     this.carousel.setActiveIndex(0);
        // }
        // else {
        //     this.carousel.play();
        // }
    }
    _render(h) {
        let { items, autoplay } = this.state;
        items = items || [];
        return (
            items.length > 1 ?
                <div style={{ minHeight: '80px' }} name="ad-swiper" className="carousel slide"
                    ref={(e: HTMLElement) => {
                        this.element = e || this.element;
                    }}>
                    <ol className="carousel-indicators">
                        {items.map((o, i) =>
                            <li key={i}></li>
                        )}
                    </ol>
                    <div className="carousel-inner">
                        {items.map((o, i) =>
                            <div key={i} className={i == 0 ? "item active" : "item"}>
                                <img src={imageUrl(o.image)} className="img-responsive"
                                    ref={(e: HTMLImageElement) => e ? ui.renderImage(e) : null}>
                                </img>
                                <div className="carousel-caption">
                                </div>
                            </div>
                        )}
                    </div>
                </div> :
                items.length > 0 ?
                    <div ref={() => this.element = null}>
                        <img style={{ width: '100%' }} src={imageUrl(items[0].image)} />
                    </div>
                    :
                    <div ref={() => this.element = null}>
                        <img style={{ width: '100%' }} className="img-responsive" ref={(e: HTMLImageElement) => {
                            if (!e) return;
                            ui.renderImage(e, { imageText: '暂无轮播图片', imageSize: { width: 800, height: 400 } })
                        }} />
                    </div>
        );
    }
}


export default CarouselControl;

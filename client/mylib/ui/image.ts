namespace ui {
    export let loadImageConfig = {
        /** 图片的基本路径，图片地址如果不以 http 开头，则加上该路径 */
        imageBaseUrl: '',

        /** 图片显示的文字 */
        imageDisaplyText: '',
    }

    let config = loadImageConfig;

    export type CanvasDraw = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => void
    export type DrawOption = { fontSize?: number, bgColor?: string, textColor?: string };
    let draws = {
        text: (imageText: string, options?: DrawOption): CanvasDraw => {

            return (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {

                // let fontSize1 = Math.floor(canvasHeight / 3 * 0.8);
                let fontSize = Math.floor((canvasWidth / imageText.length) * 0.6);
                let bgColor = 'whitesmoke';
                let textColor = '#999';
                // let fontSize = Math.min(fontSize1, fontSize2);

                options = Object.assign({
                    fontSize,
                    bgColor,
                    textColor
                }, options);

                ctx.fillStyle = options.bgColor; //'whitesmoke';
                ctx.fillRect(0, 0, canvasWidth, canvasHeight);

                // 设置字体
                ctx.font = `Bold ${options.fontSize}px Arial`;
                // 设置对齐方式
                ctx.textAlign = "left";
                // 设置填充颜色
                ctx.fillStyle = options.textColor; //"#999";

                let textWidth = fontSize * imageText.length;
                let startX = Math.floor((canvasWidth - textWidth) * 0.5);
                let startY = Math.floor((canvasHeight - options.fontSize) * 0.3);
                // 设置字体内容，以及在画布上的位置
                ctx.fillText(imageText, startX, Math.floor(canvasHeight * 0.6));
            }
        }
    };

    export function generateImageBase64(width: number, height: number, text: string, options?: DrawOption): string
    export function generateImageBase64(width: number, height: number, draw: CanvasDraw): string
    export function generateImageBase64(width: number, height: number, obj: CanvasDraw | string, options?: DrawOption): string {
        var canvas = document.createElement('canvas');
        canvas.width = width; //img_width;
        canvas.height = height; //img_height;
        var ctx = canvas.getContext('2d');
        let draw = typeof obj == 'string' ? draws.text(obj, options) : obj;
        draw(ctx, width, height)

        return canvas.toDataURL();
    }

    function loadImageByUrl(url: string) {

    }

    const PREVIEW_IMAGE_DEFAULT_WIDTH = 200;
    const PREVIEW_IMAGE_DEFAULT_HEIGHT = 200;

    export type LoadImageOptions = {
        imageSize?: { width: number, height: number },
        loadImage?: () => Promise<string>,
        imageText?: string
    };

    /**
     * 在 IMG 元素上渲染图片 
     * @param element 要渲染的 IMG 元素 
     * @param options 渲染选项，默认将 IMG 元素的 SRC 属性渲染出来 
     */
    export function renderImage(element: HTMLImageElement, options?: LoadImageOptions): Promise<string> {

        options = options || {};
        if (!element) throw errors.argumentNull('element');

        let imageUrl = element.src || '';
        if (imageUrl.indexOf('data:image/png;base64') == 0 || element['rendered']) {
            return;
        }

        //====================================================
        // 通过 URL 设置图片大小
        if (imageUrl && !options.imageSize) {
            var match = imageUrl.match(/_\d+_\d+/);
            if (match && match.length > 0) {
                var arr = match[0].split('_');
                if (arr.length >= 2) {
                    var width = new Number(arr[1]).valueOf();
                    var height = new Number(arr[2]).valueOf();
                    options.imageSize = { width, height };
                }
            }
        }
        //====================================================
        options.imageSize = options.imageSize || { width: PREVIEW_IMAGE_DEFAULT_WIDTH, height: PREVIEW_IMAGE_DEFAULT_HEIGHT };
        //====================================================
        if (!options.imageText) {
            options.imageText = element.title || '';;
        }


        let s = options.imageSize;

        //设置默认的图片
        var src_replace = generateImageBase64(s.width, s.height, draws.text(options.imageText || config.imageDisaplyText)); //getPreviewImage(imageText || config.imageDisaplyText, img_width, img_height);
        element.setAttribute('src', src_replace);

        return new Promise((resolve, reject) => {
            if (options.loadImage) {
                options.loadImage()
                    .then(base64 => base64 ? Promise.resolve(base64) : Promise.reject({}))
                    .catch(() => {
                        let base64 = generateImageBase64(s.width, s.height, draws.text('加载图片失败', { fontSize: 24 }));
                        return Promise.resolve(base64);
                    })
                    .then((base64) => {
                        element.src = base64;
                        element['rendered'] = true;
                    })
            }
            else {
                var image: HTMLImageElement = new Image();
                image.onload = function () {
                    element.src = (this as HTMLImageElement).src;
                    element['rendered'] = true;
                    resolve(element.src);
                };
                image.src = imageUrl;
            }
        })
    }

    export type ImageFileToBase64Result = { base64: string, width: number, height: number };
    export function imageFileToBase64(imageFile: File, size?: { width?: number, height?: number }): Promise<ImageFileToBase64Result> {
        if (!imageFile) throw errors.argumentNull('imageFile');

        return new Promise<ImageFileToBase64Result>((resolve, reject) => {
            var reader = new FileReader();
            reader.readAsArrayBuffer(imageFile);
            reader.onload = (ev: Event) => {
                var blob = new Blob([event.target['result']]);
                window['URL'] = window['URL'] || window['webkitURL'];
                var blobURL = window['URL'].createObjectURL(blob);
                var image = new Image();
                image.src = blobURL;
                image.onload = () => {
                    var canvas = document.createElement('canvas');

                    size = size || {};
                    let width = size.width != null && size.width < image.width ? size.width : image.width;
                    let height = size.height != null && size.height < image.height ? size.height : image.height;
                    if (width != null && height == null) {
                        height = width / image.width * image.height;
                    }
                    else if (width == null && height != null) {
                        width = height / image.height * image.width;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(image, 0, 0, width, height, );

                    let data = canvas.toDataURL("image/jpeg", 0.5);
                    resolve({ base64: data, width, height });
                }
            }
        })

    }

    export function fileToBase64(file: File): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = function () {
                resolve(reader.result);
            }
            reader.onerror = function () {
                reject(reader.error)
            }
            reader.readAsDataURL(file);
        })
    }
}


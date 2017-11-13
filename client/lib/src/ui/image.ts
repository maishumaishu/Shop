namespace ui {
    export let loadImageConfig = {
        /** 图片的基本路径，图片地址如果不以 http 开头，则加上该路径 */
        imageBaseUrl: '',

        /** 图片显示的文字 */
        imageDisaplyText: '',
    }

    let config = loadImageConfig;

    type CanvasDraw = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => void

    let draws = {
        text: (imageText: string, options?: { fontSize: number }): CanvasDraw => {

            return (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {

                // let fontSize1 = Math.floor(canvasHeight / 3 * 0.8);
                let fontSize = Math.floor((canvasWidth / imageText.length) * 0.6);
                // let fontSize = Math.min(fontSize1, fontSize2);

                options = Object.assign({
                    fontSize
                }, options);

                ctx.fillStyle = 'whitesmoke';
                ctx.fillRect(0, 0, canvasWidth, canvasHeight);

                // 设置字体
                ctx.font = `Bold ${options.fontSize}px Arial`;
                // 设置对齐方式
                ctx.textAlign = "left";
                // 设置填充颜色
                ctx.fillStyle = "#999";

                let textWidth = fontSize * imageText.length;
                let startX = Math.floor((canvasWidth - textWidth) * 0.5);
                let startY = Math.floor((canvasHeight - options.fontSize) * 0.3);
                // 设置字体内容，以及在画布上的位置
                ctx.fillText(imageText, startX, Math.floor(canvasHeight * 0.6));
            }
        }
    };

    function generateImageBase64(width: number, height: number, draw: CanvasDraw): string {
        var canvas = document.createElement('canvas');
        canvas.width = width; //img_width;
        canvas.height = height; //img_height;
        var ctx = canvas.getContext('2d');
        draw(ctx, width, height);

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
        if (imageUrl.indexOf('data:image/png;base64') == 0 ||  element['rendered']) {
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
    export function imageFileToBase64(imageFile: File, size?: { width: number, height: number }): Promise<ImageFileToBase64Result> {
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

                    let width = image.width;
                    let height = image.height;
                    if (size) {
                        width = size.width;
                        height = size.height;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(image, 0, 0, width, height);

                    let data = canvas.toDataURL("/jpeg", 0.7);
                    resolve({ base64: data, width, height });
                }
            }
        })

    }
}
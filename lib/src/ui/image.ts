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
            options = Object.assign({
                fontSize: 40
            }, options);
            return (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
                ctx.fillStyle = 'whitesmoke';
                ctx.fillRect(0, 0, canvasWidth, canvasHeight);

                // 设置字体
                ctx.font = `Bold ${options.fontSize}px Arial`;
                // 设置对齐方式
                ctx.textAlign = "left";
                // 设置填充颜色
                ctx.fillStyle = "#999";
                // 设置字体内容，以及在画布上的位置
                ctx.fillText(imageText, canvasWidth / 2 - 75, canvasHeight / 2);
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

    export function loadImage(element: HTMLImageElement, options?: LoadImageOptions): Promise<string> {
        // imageText = imageText || config.imageDisaplyText;
        //, imageUrl: string, imageText?: string

        options = options || {};


        if (!element) throw errors.argumentNull('element');

        let imageUrl = element.src || '';
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
                    })
            }
            else {
                var image: HTMLImageElement = new Image();
                image.onload = function () {
                    element.src = (this as HTMLImageElement).src;
                    resolve(element.src);
                };
                image.src = imageUrl;
            }
        })
    }

    export type ImageFileToBase64Result = { base64: string, width: number, height: number };
    export function imageFileToBase64(imageFile: File, options?: { maxWidth: number }): Promise<ImageFileToBase64Result> {
        if (!imageFile) throw errors.argumentNull('imageFile');

        options = options || {} as any;

        return new Promise<ImageFileToBase64Result>((resolve, reject) => {
            if (!(/image/i).test(imageFile.type)) {
                console.log("File " + imageFile.name + " is not an image.");
                reject();
            }

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

                    let width: number;
                    let height: number;
                    if (options.maxWidth) {
                        width = options.maxWidth ? options.maxWidth : image.width;
                        height = (width / image.width) * image.height;
                    }
                    else {
                        width = image.width;
                        height = image.height;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(image, 0, 0);

                    let data = canvas.toDataURL("/jpeg", 0.7);
                    resolve({ base64: data, width, height });
                }
            }
        })

    }
}
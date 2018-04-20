interface ImageUploadProps extends React.Props<ImageUpload> {
    style?: React.CSSProperties,
    saveImage: (data: ui.ImageFileToBase64Result) => Promise<any>,
    title?: string,
    className?: string
}

requirejs(['css!controls/imageUpload']);
class ImageUpload extends React.Component<ImageUploadProps, any> {
    itemElement: HTMLElement;
    file: HTMLInputElement;
    image: HTMLImageElement;
    updloadImage(imageFile: File) {
        ui.imageFileToBase64(imageFile, { width: 200, height: 200 })
            .then(data => {
                this.props.saveImage(data);
            });
    }
    setFileInput(e: HTMLInputElement) {
        if (!e || e.onchange) return;
        this.file = e;
        e.onchange = () => {
            if (e.files.length > 0)
                this.updloadImage(e.files[0]);
        }
    }
    componentDidMount() {
        this.setSizes();
    }

    setSizes() {
        let width = this.itemElement.offsetWidth;
        //==========================================
        // 获取元素的宽带，作为高度，如果小于一个很小的数值，
        // 比如 10，则认为元素没有渲染完成，稍后再获取
        if (width < 10) {
            setTimeout(() => {
                this.setSizes()
            }, 100)
        }
        //==========================================

        let height = width;
        this.itemElement.style.height = `${height}px`;
        if (height > 80) {
            this.itemElement.style.paddingTop = `${(height - 80) / 2}px`;
        }

        this.file.style.marginTop = `-${height}px`;
        this.file.style.width = `${width}px`;
        this.file.style.height = `${height}px`;

    }

    render() {
        let { title, className } = this.props;
        title = title || '图片上传'
        className = className || '';

        return (
            <div className={`image-upload ${className}`} style={this.props.style}  >
                <div className="item" ref={(e: HTMLElement) => this.itemElement = e || this.itemElement}>
                    <i className="icon-plus icon-4x"></i>
                    <div>{title}</div>
                    <input type="file" style={{ width: 0, height: 0 }}
                        ref={(e: HTMLInputElement) => this.setFileInput(e)} />
                </div>
            </div>
        );
    }
}

export default ImageUpload;

{/* <i className="icon-plus icon-4x"></i>
<div>{title}</div>*/}
{/* <div className="bottom">
<button className="btn-link"
ref={(e: HTMLButtonElement) => this.setDeleteButton(e, imagePath)}>
删除
</button>
</div> */}
// text-center pull-left

// style = "width: 112px; height: 112px; padding: 16px 0px 0px; border: 1px solid rgb(204, 204, 204);"

// style = "position: relative; top: -100%; width: 100%; height: 100%; opacity: 0;"
interface ImageUploadProps extends React.Props<ImageUpload> {
    style?: React.CSSProperties,
    saveImage: (data: ui.ImageFileToBase64Result) => Promise<any>,
    title?: string
}

requirejs(['css!components/imageUpload']);
class ImageUpload extends React.Component<ImageUploadProps, any> {
    updloadImage(imageFile: File) {
        ui.imageFileToBase64(imageFile)
            .then(data => {
                this.props.saveImage(data);
            });
    }
    setFileInput(e: HTMLInputElement) {
        if (!e || e.onchange) return;
        e.onchange = () => {
            if (e.files.length > 0)
                this.updloadImage(e.files[0]);
        }
    }
    render() {
        let title = this.props.title || '图片上传'
        return (
            <div className="image-upload" style={this.props.style}  >
                <i className="icon-plus icon-4x"></i>
                <div>{title}</div>
                <input type="file"
                    ref={(e: HTMLInputElement) => this.setFileInput(e)} />
            </div>
        );
    }
}

export default ImageUpload;

// text-center pull-left

// style = "width: 112px; height: 112px; padding: 16px 0px 0px; border: 1px solid rgb(204, 204, 204);"

// style = "position: relative; top: -100%; width: 100%; height: 100%; opacity: 0;"
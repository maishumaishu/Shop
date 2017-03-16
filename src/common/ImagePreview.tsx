export class ImagePreview extends React.Component<
    { size: { width: number, height: number } } & React.Props<ImagePreview>,
    { imageData: string }>{
    constructor(props) {
        super(props);
        this.state = { imageData: null };
    }

    private inputFile_onchange(event: React.FormEvent) {
        this.processfile((event.target as HTMLInputElement).files[0], this.props.size)
            .then(data => {
                this.state.imageData = data;
                this.setState(this.state);
                // return this.props.upload(data).then(o => {
                //     this.imageData = data;
                //     this.state.status = 'finish';
                //     this.setState(this.state);
                // });
            });
    }

    private processfile(file: File, size?: { width: number, height: number }): Promise<string> {

        return new Promise<string>((resolve, reject) => {
            if (!(/image/i).test(file.type)) {
                console.log("File " + file.name + " is not an image.");
                reject();
            }

            var reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = (ev: Event) => {
                var blob = new Blob([event.target['result']]);
                window['URL'] = window['URL'] || window['webkitURL'];
                var blobURL = window['URL'].createObjectURL(blob);
                var image = new Image();

                image.src = blobURL;
                image.onload = () => {
                    var canvas = document.createElement('canvas');
                    if (size) {
                        canvas.width = size.width;
                        canvas.height = size.height;
                    }
                    else {
                        canvas.width = image.width;
                        canvas.height = image.height;
                    }

                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

                    let data = canvas.toDataURL("/jpeg", 0.4);
                    resolve(data);
                }
            }
        })
    }

    clear() {
        this.state.imageData = null;
        this.setState(this.state);
    }

    render() {
        return <div className="item">
            <input type="file" accept="images/*" multiple={false}
                onChange={(ev) => this.inputFile_onchange(ev)} />
            {this.state.imageData ?
                <img src={this.state.imageData} style={{ width: '100%' }} /> :
                <i className="icon-camera"></i>
            }
        </div>
    }
}
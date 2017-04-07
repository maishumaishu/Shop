(function () {

    var form = document.getElementById('form');
    var callback = function (file, imageData) {

    };

    function processfile(file, max_width, max_height, callback) {

        if (!(/image/i).test(file.type)) {
            alert("File " + file.name + " is not an image.");
            return false;
        }



        var reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = $.proxy(function (event) {
            // blob stuff
            var blob = new Blob([event.target.result]); // create blob...
            window.URL = window.URL || window['webkitURL'];
            var blobURL = window.URL.createObjectURL(blob); // and get it's URL

            // helper Image object
            var image = new Image();
            image.src = blobURL;
            //preview.appendChild(image); // preview commented out, I am using the canvas instead
            image.onload = $.proxy(function () {
                // have to wait till it's loaded
                var resized = resizeMe(this._image, max_width, max_height); // send it to canvas
                this._callback(this._file, resized);

            }, { _image: image, _file: this._file, _callback: this._callback })

        }, { _file: file, _callback: callback });
    }

    function readfiles(files, max_width, max_height, callback) {


        for (var i = 0; i < files.length; i++) {
            processfile(files[i], max_width, max_height, callback); // process each file at once
        }
        // TODO remove the previous hidden inputs if user selects other files
    }


    // === RESIZE ====

    function resizeMe(img, max_width, max_height) {

        var canvas = document.createElement('canvas');

        var width = img.width;
        var height = img.height;

        // calculate the width and height, constraining the proportions
        if (width > height) {
            if (width > max_width) {
                //height *= max_width / width;
                height = Math.round(height *= max_width / width);
                width = max_width;
            }
        } else {
            if (height > max_height) {
                //width *= max_height / height;
                width = Math.round(width *= max_height / height);
                height = max_height;
            }
        }

        // resize the canvas and draw the image data into it
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        return canvas.toDataURL("image/jpeg", 0.7); // get the data from canvas as 70% JPG (can be also PNG, etc.)

    }

    var default_max_width = 10000;
    var default_max_height = 10000;
    $.fn.imageFileResize = function (options) {
        $(this).each(function () {
            this.max_width = options.max_width || default_max_width;
            this.max_height = options.max_height || default_max_height;
            this.callback = options.callback || callback;

            this.onchange = function () {
                if (!((<any>window).File && (<any>window).FileReader && (<any>window).FileList && (<any>window).Blob)) {
                    alert('The File APIs are not fully supported in this browser.');
                    return false;
                }
                readfiles(this.files, this.max_width, this.max_height, this.callback);
            }
        });
    };

})();
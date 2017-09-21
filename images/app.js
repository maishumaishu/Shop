"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const url = require("url");
const querystring = require("querystring");
const mongodb = require("mongodb");
const fs = require("fs");
const settings = require("./settings");
const sharp = require("sharp");
const hostname = 'localhost';
const port = 3218;
const imageCollectionName = 'AppImage';
const errors = {
    searchCanntNull: () => new Error('Search can not be null.'),
    parameterRequired: (name) => new Error(`Parameter '${name}' is required.`),
    objectNotExists: (typeName, name) => new Error(`Object ${typeName} '${name}' is not exists.`),
    dataFormatError: () => new Error('Data format error.'),
    pathNotSupport: (path) => new Error(`Path '${path}' is not supported.`),
    actionResultIsNull: () => new Error("Action result can not be null."),
};
const contentTypes = {
    application_json: 'application/json',
    text_plain: 'text/plain',
};
const imageContextTypes = {
    gif: 'image/gif',
    png: 'image/png',
    jpeg: 'image/jpeg',
    webp: 'image/webp'
};
const defaultImageType = 'webp';
const server = http.createServer(async (req, res) => {
    let db;
    try {
        let query = {};
        let urlInfo = url.parse(req.url);
        let { search } = urlInfo;
        if (search) {
            query = querystring.parse(search.substr(1));
        }
        let path = urlInfo.pathname;
        console.assert(path && path.length > 0);
        if (path.endsWith('/')) {
            path = path.substr(0, path.length - 1);
        }
        db = await mongodb.MongoClient.connect(settings.mongodb_conn);
        let action;
        let context;
        if (path.startsWith('/Images') || path.startsWith('/ueditor/net/upload/image') ||
            path.startsWith('/umeditor.net/upload')) {
            action = imageFile;
        }
        else if (/^\/[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}_\d+_\d+$/i.test(path)) {
            action = imageByName;
        }
        else if (/^\/[a-f\d]{24}_\d+_\d+$/i.test(path)) {
            var arr = path.substr(1).split('_');
            context = new mongodb.ObjectID(arr[0]);
            action = imageById;
        }
        else {
            throw errors.pathNotSupport(path);
        }
        let result = await action(req, res, db, context);
        if (!result)
            throw errors.actionResultIsNull();
        if (result.contentType.startsWith('image') && query.width) {
            let width = Number.parseInt(query.width);
            let height = query.height ? Number.parseInt(query.height) : width;
            let type = query.type || defaultImageType;
            let contentType = imageContextTypes[type] || imageContextTypes[defaultImageType];
            result.data = await resizeImage(result.data, type, width, height);
            result.contentType = contentType;
        }
        res.setHeader("Content-Type", result.contentType || contentTypes.text_plain);
        res.statusCode = result.statusCode || 200;
        res.end(result.data);
    }
    catch (err) {
        res.setHeader('Content-Type', 'text/plain');
        res.statusCode = 600;
        res.end(err.message);
    }
    finally {
        if (db != null) {
            db.close();
        }
    }
});
async function imageFile(req, res, db) {
    let urlInfo = url.parse(req.url);
    let pathname = __dirname + urlInfo.pathname;
    if (!fs.existsSync(pathname)) {
        return { data: 'file not exists.', statusCode: 404 };
    }
    var buffers = new Array();
    return new Promise((resolve, reject) => {
        let stream = fs.createReadStream(pathname)
            .on('data', (d) => {
            buffers.push(d);
        })
            .on('end', () => {
            let buffer = Buffer.concat(buffers);
            resolve({ data: buffer, contentType: imageContextTypes.jpeg });
        })
            .on('error', (err) => {
            reject(err);
        });
    });
}
async function imageByName(req, res, db) {
    let urlInfo = url.parse(req.url);
    let collection = db.collection(imageCollectionName);
    var name = urlInfo.pathname.substr(1);
    let item = await collection.findOne({ name });
    if (!item) {
        throw errors.objectNotExists(imageCollectionName, name);
    }
    let arr = (item.data || '').split(',');
    if (arr.length != 2)
        throw errors.dataFormatError();
    let buffer = new Buffer(arr[1], 'base64');
    return { data: buffer, contentType: imageContextTypes.jpeg };
}
async function imageById(req, res, db, _id) {
    let collection = db.collection(imageCollectionName);
    let item = await collection.findOne({ _id });
    let arr = (item.data || '').split(',');
    if (arr.length != 2)
        throw errors.dataFormatError();
    let buffer = new Buffer(arr[1], 'base64');
    return { data: buffer, contentType: imageContextTypes.jpeg };
}
async function resizeImage(buffer, type, width, height) {
    height = height || width;
    return new Promise((resolve, reject) => {
        var sharpInstance = sharp(buffer).resize(width, height);
        var typeMethod = (sharpInstance[type] || sharpInstance.webp).bind(sharpInstance);
        typeMethod().toBuffer((err, data) => {
            if (err)
                reject(err);
            resolve(data);
        });
    });
}
server.listen(port, hostname, () => {
    console.log(`server running at http://${hostname}:${port}`);
});
//# sourceMappingURL=app.js.map
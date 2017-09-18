import * as http from 'http';
import * as url from 'url';
import * as querystring from 'querystring';
import * as mongodb from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';
import * as settings from './settings';
import sharp = require('sharp');

const hostname = 'localhost';
const port = 3218;
const imageCollectionName = 'AppImage';

const errors = {
    searchCanntNull: () => new Error('Search can not be null.'),
    parameterRequired: (name) => new Error(`Parameter '${name}' is required.`),
    objectNotExists: (typeName, name) => new Error(`Object ${typeName} '${name}' is not exists.`),
    dataFormatError: () => new Error('Data format error.'),
    pathNotSupport: (path: string) => new Error(`Path '${path}' is not supported.`),
    actionResultIsNull: () => new Error("Action result can not be null."),

}

type Action = (req: http.IncomingMessage, res: http.ServerResponse, db: mongodb.Db, context?: any) => Promise<ActionResult>;
type ActionResult = { data: any, contentType?: string, statusCode?: number }

const contentTypes = {
    application_json: 'application/json',
    text_plain: 'text/plain',
}

const imageContextTypes = {
    gif: 'image/gif',
    png: 'image/png',
    jpeg: 'image/jpeg',
    webp: 'image/webp'
}

const defaultImageType = 'webp';

const server = http.createServer(async (req: http.IncomingMessage, res: http.ServerResponse) => {


    let db: mongodb.Db;

    try {

        let query = {} as any;
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

        let action: Action;
        let context: any;

        if (path.startsWith('/Images') || path.startsWith('/ueditor/net/upload/image')) {
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

async function imageFile(req: http.IncomingMessage, res: http.ServerResponse, db: mongodb.Db)
    : Promise<ActionResult> {

    let urlInfo = url.parse(req.url);
    let pathname = __dirname + urlInfo.pathname;

    if (!fs.existsSync(pathname)) {
        return { data: 'file not exists.', statusCode: 404 };
    }

    var buffers = new Array<Buffer>();
    return new Promise<ActionResult>((resolve, reject) => {
        let stream = fs.createReadStream(pathname)
            .on('data', (d: Buffer) => {
                buffers.push(d);
            })
            .on('end', () => {
                let buffer = Buffer.concat(buffers);
                resolve({ data: buffer, contentType: imageContextTypes.jpeg });
            })
            .on('error', (err) => {
                reject(err);
            });
    })
}

async function imageByName(req: http.IncomingMessage, res: http.ServerResponse, db: mongodb.Db) {
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

async function imageById(req: http.IncomingMessage, res: http.ServerResponse, db: mongodb.Db, _id: mongodb.ObjectId) {
    let collection = db.collection(imageCollectionName);
    let item = await collection.findOne({ _id });

    let arr = (item.data || '').split(',');
    if (arr.length != 2)
        throw errors.dataFormatError();

    let buffer = new Buffer(arr[1], 'base64');
    return { data: buffer, contentType: imageContextTypes.jpeg };
}

async function resizeImage(buffer: Buffer, type: 'jpeg|png|webp', width: number, height?: number): Promise<Buffer> {
    height = height || width;
    return new Promise<Buffer>((resolve, reject) => {
        var sharpInstance = sharp(buffer).resize(width, height);
        var typeMethod = (sharpInstance[type] as Function || sharpInstance.webp).bind(sharpInstance);
        typeMethod().toBuffer((err, data) => {
            if (err) reject(err);

            resolve(data);
        });
    })

}


server.listen(port, hostname, () => {
    console.log(`server running at http://${hostname}:${port}`);

});


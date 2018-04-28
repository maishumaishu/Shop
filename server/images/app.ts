import * as http from 'http';
import * as url from 'url';
import * as querystring from 'querystring';
import * as mongodb from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';
import * as settings from './settings';
import * as mysql from 'mysql';
import * as cache from 'memory-cache';
import sharp = require('sharp');
import { resolve } from 'dns';
import { Parser, ExpressionTypes } from './expression';

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

type Action = (req: http.IncomingMessage, res: http.ServerResponse, context?: any) => Promise<ActionResult>;
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

        let action: Action;
        let context: any;

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
            action = imageFromMongo;
        }
        else if (/^\/[a-f\d]{24}$/i.test(path)) {
            let p = path.substr(1);
            context = new mongodb.ObjectID(p);
            action = imageFromMongo;
        }
        else if (/^\/[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(path)) {
            context = path.substr(1);//+ MYSQL_IMAGE_PREFIX.length
            action = imageFromMysql;
        }
        else if (/^\/delete\/[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(path)) {
            action = remove;
            let arr = path.split('/');
            if (arr.length < 2)
                throw errors.pathNotSupport(path);

            let guidRegular = /[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}/;
            context = guidRegular.exec(path)[0];
        }
        else if (path == '/upload') {
            action = upload;
        }
        else if (path.startsWith('/list')) {
            action = list;
        }
        else {
            throw errors.pathNotSupport(path);
        }

        let result = await action(req, res, context);
        if (!result)
            throw errors.actionResultIsNull();

        if (result.contentType != null && result.contentType.startsWith('image') && query.width) {
            let width = Number.parseInt(query.width);
            let height = query.height ? Number.parseInt(query.height) : width;
            let type = query.type || defaultImageType;
            let contentType = imageContextTypes[type] || imageContextTypes[defaultImageType];
            result.data = await resizeImage(result.data, type, width, height);
            result.contentType = contentType;
        }

        res.setHeader("content-type", result.contentType || contentTypes.text_plain);
        res.statusCode = result.statusCode || 200;

        res.end(result.data);
    }
    catch (e) {
        let err = e as Error;
        res.setHeader('content-type', contentTypes.application_json);
        res.statusCode = 600;

        let { name, stack } = err;
        var text = JSON.stringify({ name, stack });
        res.write(text);
        res.end();
    }
});


async function imageFile(req: http.IncomingMessage, res: http.ServerResponse)
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

async function imageByName(req: http.IncomingMessage, res: http.ServerResponse): Promise<ActionResult> {
    let db = await mongodb.MongoClient.connect(settings.mongodb_shopcloud);
    let urlInfo = url.parse(req.url);
    let collection = db.collection(imageCollectionName);
    var name = urlInfo.pathname.substr(1);
    let item = await collection.findOne({ name });
    db.close();
    if (!item) {
        let err = errors.objectNotExists(imageCollectionName, name);
        return { data: err.message, statusCode: 404 };
    }

    let arr = (item.data || '').split(',');
    if (arr.length != 2)
        throw errors.dataFormatError();

    let buffer = new Buffer(arr[1], 'base64');
    return { data: buffer, contentType: imageContextTypes.jpeg };
}

async function imageFromMongo(req: http.IncomingMessage, res: http.ServerResponse, _id: mongodb.ObjectId): Promise<ActionResult> {
    let db = await mongodb.MongoClient.connect(settings.mongodb_shopcloud);
    let collection = db.collection(imageCollectionName);
    let item = await collection.findOne({ _id });
    db.close();

    if (item == null) {
        let err = errors.objectNotExists(imageCollectionName, _id);
        return { data: err.message, statusCode: 404 }
    }

    let arr = (item.data || '').split(',');
    if (arr.length != 2)
        throw errors.dataFormatError();

    let buffer = new Buffer(arr[1], 'base64');
    return { data: buffer, contentType: imageContextTypes.jpeg };
}

async function imageFromMysql(req: http.IncomingMessage, res: http.ServerResponse, id: string): Promise<ActionResult> {

    return new Promise<ActionResult>((resolve, reject) => {

        let conn = mysql.createConnection(settings.mysql_image_setting);

        let sql = `select id, data from image where id = ?`;
        conn.query(sql, id, (err, rows, fields) => {
            if (err) {
                reject(err);
                return;
            }

            if (!rows[0]) {
                let err = errors.objectNotExists(imageCollectionName, id);
                reject(err);
                return;
            }

            let arr = (rows[0].data as string || '').split(',');
            if (arr.length != 2) {
                reject(errors.dataFormatError());
                return;
            }

            let buffer = new Buffer(arr[1], 'base64');
            resolve({ data: buffer, contentType: imageContextTypes.jpeg })
            return;
        });


        conn.end();
    })
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

async function upload(req: http.IncomingMessage, res: http.ServerResponse): Promise<ActionResult> {

    //image
    let obj = await parsePostData(req);
    let image = obj["image"];
    if (image == null) {
        throw errors.parameterRequired("image");
    }

    let application_id = req.headers['application-id'] || parseQueryString(req)['application'];
    if (application_id == null)
        throw errors.parameterRequired('application-id');

    return new Promise<ActionResult>((resolve, reject) => {
        let value = new Date(Date.now());
        let create_date_time = `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()} ${value.getHours()}:${value.getMinutes()}:${value.getSeconds()}`

        let conn = mysql.createConnection(settings.mysql_image_setting);
        let sql = `insert into image set ?`;

        let item = { id: guid(), data: image, create_date_time, application_id };
        conn.query(sql, item, (err, rows, fields) => {
            if (err) {
                reject(err);
                return;
            }

            let result: ActionResult = {
                data: JSON.stringify({ id: item.id }),
                contentType: contentTypes.application_json
            };
            resolve(result);
        })

        conn.end();
    })
}

async function remove(req: http.IncomingMessage, res: http.ServerResponse, id: string): Promise<ActionResult> {
    let obj = parseQueryString(req);;
    let application_id = obj["application-id"] || req.headers['application-id'];
    if (application_id == null)
        throw errors.parameterRequired('appKey');

    return new Promise<ActionResult>((resolve, reject) => {
        let conn = mysql.createConnection(settings.mysql_image_setting);
        let sql = `delete from image where id = ? and application_id = ?`;
        conn.query(sql, [id, application_id], (err, rows, fields) => {
            if (err) {
                reject(err);
                return;
            }

            let result: ActionResult = {
                data: JSON.stringify({}),
                contentType: contentTypes.application_json
            };
            resolve(result);
        })
        conn.end();
    })
}

type SelectArguments = {
    startRowIndex?: number;
    maximumRows?: number;
    sortExpression?: string;
    filter?: string;
}

async function list(req: http.IncomingMessage, res: http.ServerResponse): Promise<ActionResult> {

    let postData = await parsePostData(req);
    let obj = parseQueryString(req);
    let args: SelectArguments = Object.assign({}, obj, postData);
    let application_id = obj['application-id'] || req.headers['application-id'];
    if (application_id == null)
        throw errors.parameterRequired('application-id');


    if (args.filter) {
        let expr = Parser.parseExpression(args.filter);
        if (expr.type != ExpressionTypes.Binary) {
            let result: ActionResult = {
                data: JSON.stringify(new Error(`Parser filter fail, filter is '${args.filter}'`)),
                contentType: contentTypes.application_json,
            }
            Promise.resolve(result);
            return;
        }
    }
    if (args.sortExpression) {
        let expr = Parser.parseOrderExpression(args.sortExpression);
        if (expr.type != ExpressionTypes.Order) {
            let result: ActionResult = {
                data: JSON.stringify(new Error(`Parser filter fail, filter is '${args.filter}'`)),
                contentType: contentTypes.application_json,
            }
            Promise.resolve(result);
            return;
        }
    }

    // return new Promise<any[]>((resolve, reject) => {

    let defaults: SelectArguments = {
        startRowIndex: 0,
        maximumRows: 10,
        sortExpression: 'create_date_time desc',
        filter: 'true'
    }

    args = Object.assign(defaults, args)


    let conn = mysql.createConnection(settings.mysql_image_setting);

    let p1 = new Promise((resolve, reject) => {
        let sql = `select id from image 
                   where ${args.filter} and application_id = '${application_id}'
                   limit ${args.startRowIndex} ${args.startRowIndex + args.maximumRows} 
                   order by create_date_time desc`;

        conn.query(sql, args, (err, rows, fields) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(rows);
        });
    })

    let p2 = new Promise<number>((resolve, reject) => {
        let sql = `select count(*) as count from image where ${args.filter} and application_id = '${application_id}' order by create_date_time desc`;
        conn.query(sql, args, (err, rows, fields) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(rows[0].count);
        });
    })

    conn.end();

    let r = await Promise.all([p1, p2]);
    let dataItems = r[0];
    let totalRowCount = r[1];


    let result: ActionResult = {
        data: JSON.stringify({ dataItems, totalRowCount }),
        contentType: contentTypes.application_json
    };

    return result;

    // }).then((rows) => {
    //     let result: ActionResult = {
    //         data: JSON.stringify(rows),
    //         contentType: contentTypes.application_json
    //     };
    //     return result;

    // });
}


function parseQueryString(req: http.IncomingMessage): object {
    let urlInfo = url.parse(req.url);
    let { search } = urlInfo;
    let contentType = req.headers['content-type'] || '' as string;
    if (!search)
        return {};

    search = search[0] == '?' ? search.substr(1) : search;
    let result: object;
    if (contentType.indexOf('application/json') >= 0) {
        result = JSON.parse(search);
    }
    else {
        result = querystring.parse(search);
    }
    return result;
}

function parsePostData(request: http.IncomingMessage): Promise<object> {
    let method = (request.method || '').toLowerCase();
    let length = request.headers['content-length'] || 0;
    let contentType = request.headers['content-type'] as string;
    if (length <= 0)
        return Promise.resolve({});

    return new Promise((reslove, reject) => {
        var text = "";
        request.on('data', (data: { toString: () => string }) => {
            text = text + data.toString();
        });

        request.on('end', () => {
            let obj;
            try {
                if (contentType.indexOf('application/json') >= 0) {
                    obj = JSON.parse(text)
                }
                else {
                    obj = querystring.parse(text);
                }
                reslove(obj);
            }
            catch (err) {
                reject(err);
            }
        })
    });
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}


server.listen(port, () => {//hostname, 
    console.log(`server running at http://${hostname}:${port}`);
});


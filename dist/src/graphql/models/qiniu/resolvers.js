"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const qiniu_1 = __importDefault(require("qiniu"));
const fs_1 = __importDefault(require("fs"));
const node_uuid_1 = __importDefault(require("node-uuid"));
const download_1 = __importDefault(require("../../../utils/download"));
const config_1 = __importDefault(require("../../../../config"));
//需要填写你的 Access Key 和 Secret Key
qiniu_1.default.conf.ACCESS_KEY = config_1.default.qiniu.accessKey;
qiniu_1.default.conf.SECRET_KEY = config_1.default.qiniu.secretKey;
//要上传的空间
const bucket = config_1.default.qiniu.bucket;
//构建上传策略函数
const uptoken = (bucket) => {
    var putPolicy = new qiniu_1.default.rs.PutPolicy(bucket);
    return putPolicy.token();
};
const errors_1 = __importDefault(require("../../common/errors"));
const qiniuToken = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role } = context;
    if (!user) {
        throw errors_1.default({
            message: '没有权限访问',
            data: {}
        });
    }
    const token = uptoken(bucket);
    if (!token) {
        throw errors_1.default({
            message: 'token 创建失败',
            data: {}
        });
    }
    return {
        token: token,
        url: config_1.default.qiniu.url
    };
});
/**
 * 下载互联网图片，并上传到七牛
 */
exports.downloadImgAndUploadToQiniu = function (imgUrl) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        // 图片临时储存的名称
        let temporaryName = node_uuid_1.default.v4();
        yield download_1.default({
            uri: imgUrl,
            dir: 'public/',
            filename: temporaryName + ".jpg"
        });
        // tools.download(imgUrl, 'public/', temporaryName+".jpg", function(){
        let token = uptoken(bucket);
        //构造上传函数
        function uploadFile(uptoken, key, localFile, callback) {
            let extra = new qiniu_1.default.io.PutExtra();
            qiniu_1.default.io.putFile(uptoken, key, localFile, extra, callback);
        }
        //调用uploadFile上传
        uploadFile(token, '', 'public/' + temporaryName + '.jpg', function (err, ret) {
            if (!err) {
                try { // 删除文件
                    fs_1.default.unlink('public/' + temporaryName + '.jpg', function () {
                        resolve(config_1.default.qiniu.url + '/' + ret.key);
                    });
                }
                catch (err) {
                    console.log(err);
                    // 上传失败， 处理返回代码
                    reject('delet image error');
                }
            }
            else {
                console.log(err);
                // 上传失败， 处理返回代码
                reject('upload error');
            }
        });
    }));
    // });
};
exports.query = { qiniuToken };
exports.mutation = {};

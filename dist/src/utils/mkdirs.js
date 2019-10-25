"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// 创建所有目录
const mkdirs = function (dirpath, mode, callback) {
    fs_1.default.exists(dirpath, function (exists) {
        if (exists) {
            callback();
        }
        else {
            //尝试创建父目录，然后再创建当前目录
            mkdirs(path_1.default.dirname(dirpath), mode, function () {
                fs_1.default.mkdir(dirpath, mode, function (err) {
                    if (err)
                        console.log(err);
                    callback();
                });
            });
        }
    });
};
exports.default = mkdirs;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
const fs_1 = __importDefault(require("fs"));
function default_1({ uri, dir, filename }) {
    return new Promise(resolve => {
        request_1.default.head(uri, function (err, res, body) {
            var stream = request_1.default(uri).pipe(fs_1.default.createWriteStream(dir + "/" + filename));
            stream.on('finish', resolve);
        });
    });
}
exports.default = default_1;

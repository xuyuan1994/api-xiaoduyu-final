"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Promise 异常处理
 * @param promise
 */
function to(promise) {
    if (!promise || !Promise.prototype.isPrototypeOf(promise)) {
        return new Promise((resolve, reject) => {
            reject(new Error("requires promises as the param"));
        }).catch((err) => {
            return [err, null];
        });
    }
    return promise.then(data => [null, data]).catch(err => [err]);
}
exports.default = to;

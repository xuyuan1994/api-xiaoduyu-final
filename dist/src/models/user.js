"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const schemas_1 = require("../schemas");
const base_method_1 = __importDefault(require("./base-method"));
class UserModel extends base_method_1.default {
    /**
     * 通过用户id和来源条件查询用户
     * @param  {String} userId  用户的id
     * @param  {Int} _source 来源id
     * @return {Object} Promise
     */
    verifyPassword({ password, currentPassword }) {
        return new Promise((resolve, reject) => {
            bcryptjs_1.default.compare(password, currentPassword, (err, res) => {
                err ? reject(err) : resolve(res);
            });
        });
    }
    /**
     * 生成hash密码
     * @param  {String} password
     * @return {String}
     */
    generateHashPassword({ password }) {
        return new Promise((resolve, reject) => {
            bcryptjs_1.default.genSalt(10, function (err, salt) {
                if (err)
                    return reject(err);
                bcryptjs_1.default.hash(password, salt, function (err, hash) {
                    if (err)
                        return reject(err);
                    err ? reject(err) : resolve(hash);
                });
            });
        });
    }
}
exports.default = new UserModel(schemas_1.User);

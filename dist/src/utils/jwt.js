"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const { jwtSecret } = config_1.default;
exports.encode = function (data) {
    return jsonwebtoken_1.default.sign(data, jwtSecret);
};
/**
 * 解码
 * @param token  JWT
 */
exports.decode = function (token) {
    try {
        return jsonwebtoken_1.default.verify(token, jwtSecret);
    }
    catch (e) {
        console.log(e);
        return null;
    }
};

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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../../models");
// tools
const to_1 = __importDefault(require("../../../utils/to"));
const errors_1 = __importDefault(require("../../common/errors"));
const Model = __importStar(require("./arguments"));
const tools_1 = require("../tools");
// 还缺少通知
const forgot = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { role } = context;
    const { method } = args;
    let select = {}, err, query, update, user, hash, res, fields;
    [err, query] = tools_1.getQuery({ args, model: Model.forgot, role });
    [err, fields] = tools_1.getSave({ args, model: Model.forgot, role });
    const { phone, email, captcha } = query;
    const { new_password } = fields;
    if (!phone && !email) {
        throw errors_1.default({ message: '手机或邮箱，两个必填一项' });
    }
    if (email) {
        [err, user] = yield to_1.default(models_1.Account.findOne({
            query: { email }
        }));
        if (err) {
            throw errors_1.default({
                message: '查询失败',
                data: { errorInfo: err.message }
            });
        }
        if (!user) {
            throw errors_1.default({ message: '邮箱不存在' });
        }
    }
    else if (phone) {
        [err, user] = yield to_1.default(models_1.Phone.findOne({
            query: { phone }
        }));
        if (err) {
            throw errors_1.default({
                message: '查询失败',
                data: { errorInfo: err.message }
            });
        }
        if (!user) {
            throw errors_1.default({ message: '手机号不存在' });
        }
    }
    [err, res] = yield to_1.default(models_1.Captcha.findOne({
        query: email ? { email, type: 'forgot', captcha } : { phone, type: 'forgot', captcha },
        options: { sort: { create_at: -1 } }
    }));
    if (err) {
        throw errors_1.default({
            message: '查询失败',
            data: { errorInfo: err.message }
        });
    }
    if (!res) {
        throw errors_1.default({ message: '验证码无效' });
    }
    [err, hash] = yield to_1.default(models_1.User.generateHashPassword({ password: new_password }));
    [err] = yield to_1.default(models_1.User.update({
        query: { _id: user.user_id },
        update: { password: hash }
    }));
    if (err) {
        throw errors_1.default({
            message: '密码修改失败',
            data: { errorInfo: err.message }
        });
    }
    // 返回
    return {
        success: true
    };
});
exports.query = {};
exports.mutation = { forgot };

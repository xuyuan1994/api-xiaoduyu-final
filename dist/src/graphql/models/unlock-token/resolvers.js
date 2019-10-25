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
const models_1 = require("../../../models");
// tools
const to_1 = __importDefault(require("../../../utils/to"));
const errors_1 = __importDefault(require("../../common/errors"));
// import JWT from '../../common/jwt';
// graphql
// import { getQuery, getOption, getUpdateQuery, getUpdateContent, getSaveFields } from '../../config';
// let [ query, mutation, resolvers ] = [{},{},{}];
// import * as Model from './arguments'
// import { getQuery, getSave, getOption } from '../tools'
// 获取解锁令牌
const getUnlockToken = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role, ip } = context;
    // 未登陆用户
    if (!user)
        throw errors_1.default({ message: '请求被拒绝' });
    let err, res, fields, result;
    // [ err, fields ] = getSaveFields({ args, model:'unlock-token', role });
    // if (err) throw CreateError({ message: err });
    const { type, captcha } = args;
    let query = {};
    if (type == 'phone') {
        query.type = 'phone-unlock-token';
        [err, result] = yield to_1.default(models_1.Phone.findOne({ query: { user_id: user._id } }));
        if (err)
            throw errors_1.default({ message: err });
        if (!result)
            throw errors_1.default({ message: '未绑定手机' });
        query.phone = result.phone;
        // query.area_code = result.area_code;
    }
    else if (type == 'email') {
        query.type = 'email-unlock-token';
        [err, result] = yield to_1.default(models_1.Account.findOne({ query: { user_id: user._id } }));
        if (err)
            throw errors_1.default({ message: err });
        if (!result)
            throw errors_1.default({ message: '未绑定邮箱' });
        query.email = result.email;
    }
    else {
        throw errors_1.default({ message: 'type 不匹配' });
    }
    // 验证验证码
    [err, res] = yield to_1.default(models_1.Captcha.findOne({
        query,
        options: { sort: { create_at: -1 } }
    }));
    if (err)
        throw errors_1.default({ message: '查询失败' });
    if (!res || res.captcha != captcha)
        throw errors_1.default({ message: '无效的验证码' });
    // 删除该用户所有的手机手机验证码
    [err, res] = yield to_1.default(models_1.Captcha.remove({
        query: { user_id: user._id }
    }));
    let jwt = yield models_1.Token.create({
        userId: user._id,
        ip,
        expires: 1000 * 60 * 60,
        options: { type: 'unlock-ticket' }
    });
    return {
        unlock_token: jwt.access_token
    };
});
exports.query = { getUnlockToken };
exports.mutation = {};
// export { query, mutation, resolvers }

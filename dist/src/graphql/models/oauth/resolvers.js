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
const to_1 = __importDefault(require("../../../utils/to"));
const errors_1 = __importDefault(require("../../common/errors"));
const QQ = __importStar(require("../../../router/oauth/qq"));
const Model = __importStar(require("./arguments"));
const tools_1 = require("../tools");
// 还缺少通知
const oAuthUnbinding = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = context;
    const { name } = args;
    // 未登陆用户
    if (!user)
        throw errors_1.default({ message: '请求被拒绝' });
    // 查询是否存在
    let [err, res] = yield to_1.default(models_1.Oauth.fetchByUserIdAndSource(user._id, name));
    if (err)
        throw errors_1.default({ message: '查询失败' });
    if (!res)
        throw errors_1.default({ message: '未绑定' });
    yield to_1.default(models_1.Oauth.update({
        query: { _id: res._id },
        update: { deleted: true }
    }));
    return {
        success: true
    };
});
// qq 注册&登陆、绑定
const QQOAuth = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role, ip } = context;
    let err, res, fields;
    if (!ip)
        throw errors_1.default({ message: '无效的ip地址' });
    [err, fields] = tools_1.getSave({ args, model: Model.QQOAuth, role });
    [err, res] = yield to_1.default(QQ.signInAPI({
        ip,
        user,
        token: {
            openid: fields.openid,
            access_token: fields.access_token,
            expires_in: fields.expires_in,
            refresh_token: fields.refresh_token,
            oauth_consumer_key: args.oauth_consumer_key
        }
        // binding: fields.binding || false
    }));
    if (err)
        throw errors_1.default({ message: err });
    if (user) {
        return {
            success: true
        };
    }
    else {
        return {
            success: true,
            access_token: res.access_token,
            expires: res.expires
        };
    }
});
exports.query = {};
exports.mutation = { oAuthUnbinding, QQOAuth };

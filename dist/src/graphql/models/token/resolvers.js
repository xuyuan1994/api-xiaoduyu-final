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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../../models");
const JWT = __importStar(require("../../../utils/jwt"));
const to_1 = __importDefault(require("../../../utils/to"));
const errors_1 = __importDefault(require("../../common/errors"));
const exchangeNewToken = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role, ip } = context;
    let err, result, query, token = args.token;
    let decoded = JWT.decode(token);
    // 解析错误
    if (!decoded || !decoded.user_id) {
        throw errors_1.default({ message: '无效的token，token无法解析' });
    }
    // 查询token是否存在
    [err, result] = yield to_1.default(models_1.Token.findOne({
        query: { user_id: decoded.user_id, token },
        options: { populate: [{ path: 'user_id' }] }
    }));
    // 一个token最多兑换3次
    if (result && result.exchange_count <= 2) {
        [err] = yield to_1.default(models_1.Token.update({
            query: { _id: result._id },
            update: { exchange_count: result.exchange_count + 1 }
        }));
        if (err)
            throw errors_1.default({ message: err });
        let newToken = yield models_1.Token.create({
            userId: result.user_id._id,
            ip
        });
        return {
            access_token: newToken.access_token,
            expires: newToken.expires
        };
    }
    else {
        // 如果是重复兑换token超过次数，清空该用户的所有token，强制重新登陆
        yield to_1.default(models_1.Token.remove({ query: { user_id: decoded.user_id } }));
        throw errors_1.default({ message: '无效的token，请重新登陆' });
    }
});
exports.query = {};
exports.mutation = { exchangeNewToken };

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
// tools
const JWT = __importStar(require("../../../utils/jwt"));
const to_1 = __importDefault(require("../../../utils/to"));
const errors_1 = __importDefault(require("../../common/errors"));
const validate_1 = __importDefault(require("../../../utils/validate"));
const Model = __importStar(require("./arguments"));
const tools_1 = require("../tools");
// 登录
const signIn = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    // 参数准备 ------------------------------------------------------------------
    const { role, ip } = context;
    let query = {}, err, result, account;
    // 判断ip是否存在
    if (!ip) {
        throw errors_1.default({ message: '获取不到您的IP' });
    }
    ;
    [err, query] = tools_1.getQuery({ args, model: Model.signIn, role });
    // 判断查询参数是否合法
    if (err) {
        yield to_1.default(models_1.Captcha.create({ ip, type: 'sign-in' }));
        throw errors_1.default({ message: err });
    }
    // 业务逻辑 ------------------------------------------------------------------
    let { email, phone, password, captcha, captcha_id } = query;
    if (!email && !phone) {
        yield to_1.default(models_1.Captcha.create({ ip, type: 'sign-in' }));
        throw errors_1.default({ message: '需要邮箱或手机号' });
    }
    // 判断是否存在验证码，如果有则需要验证验证码 -----------------------
    [err, result] = yield to_1.default(models_1.Captcha.findOne({
        query: { ip: ip },
        select: { _id: 1 },
        options: { sort: { create_at: -1 } }
    }));
    if (err) {
        yield to_1.default(models_1.Captcha.create({ ip, type: 'sign-in' }));
        throw errors_1.default({ message: '查询验证码失败' });
    }
    else if (result && !captcha) {
        yield to_1.default(models_1.Captcha.create({ ip, type: 'sign-in' }));
        throw errors_1.default({ message: '缺少验证码' });
    }
    else if (result && !captcha_id) {
        yield to_1.default(models_1.Captcha.create({ ip, type: 'sign-in' }));
        throw errors_1.default({ message: '缺少验证码ID' });
    }
    else if (result && captcha_id && captcha) {
        // 对比验证码是否有效
        [err, result] = yield to_1.default(models_1.Captcha.findOne({
            query: { _id: captcha_id }
        }));
        if (err || !result || result.captcha != captcha) {
            yield to_1.default(models_1.Captcha.create({ ip, type: 'sign-in' }));
            throw errors_1.default({ message: '验证码无效' });
        }
    }
    // 验证账号和密码 -----------------------
    if (phone) {
        [err, account] = yield to_1.default(models_1.Phone.findOne({
            query: { phone },
            options: { populate: { path: 'user_id', justOne: true } }
        }));
    }
    else if (email) {
        [err, account] = yield to_1.default(models_1.Account.findOne({
            query: { email },
            options: { populate: { path: 'user_id', justOne: true } }
        }));
    }
    if (err || !account) {
        yield to_1.default(models_1.Captcha.create({ ip, type: 'sign-in' }));
        throw errors_1.default({ message: '账号错误或不存在' });
    }
    // 判断密码是否正确
    [err, result] = yield to_1.default(models_1.User.verifyPassword({
        password,
        currentPassword: account.user_id.password
    }));
    if (err || !result) {
        yield to_1.default(models_1.Captcha.create({ ip, type: 'sign-in' }));
        throw errors_1.default({ message: '密码错误' });
    }
    // 判断是否被拉黑
    if (account.user_id.blocked) {
        throw errors_1.default({ message: '您的账号被禁止使用' });
    }
    // 生成 access token -----------------------
    result = yield models_1.Token.create({
        userId: account.user_id._id,
        ip
    });
    return {
        user_id: result.user_id,
        access_token: result.access_token,
        expires: result.expires
    };
});
const addEmail = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role, ip } = context;
    // 未登陆用户
    if (!user)
        throw errors_1.default({ message: '请求被拒绝' });
    let err, res, fields, account;
    [err, fields] = tools_1.getSave({ args, model: Model.addEmail, role });
    if (err)
        throw errors_1.default({ message: err });
    const { email, captcha, unlock_token } = fields;
    if (validate_1.default.email(email) != 'ok') {
        throw errors_1.default({ message: '邮箱格式错误' });
    }
    // =======================
    // 判断邮箱是否被注册
    [err, account] = yield to_1.default(models_1.Account.findOne({
        query: { email }
    }));
    if (err)
        throw errors_1.default({ message: '查询异常' });
    if (account && account.user_id + '' != user._id + '')
        throw errors_1.default({ message: '邮箱已被注册' });
    [err, account] = yield to_1.default(models_1.Account.findOne({
        query: { user_id: user._id }
    }));
    if (err)
        throw errors_1.default({ message: '查询异常' });
    // =======================
    // 解锁token，身份验证的用户，可以修改自己的邮箱
    if (unlock_token) {
        let obj = JWT.decode(unlock_token);
        if (obj.expires - new Date().getTime() <= 0 || !obj)
            throw errors_1.default({ message: '无效的解锁令牌' });
    }
    else {
        if (account)
            throw errors_1.default({ message: '您已绑定了邮箱' });
    }
    // =======================
    // 判断验证码是否有效
    [err, res] = yield to_1.default(models_1.Captcha.findOne({
        query: { user_id: user._id, email, captcha, type: account && unlock_token ? 'reset-email' : 'binding-email' },
        options: { sort: { create_at: -1 } }
    }));
    if (err)
        throw errors_1.default({ message: '查询异常' });
    if (!res)
        throw errors_1.default({ message: '无效的验证码' });
    if (account && unlock_token) {
        // =======================
        // 更新邮箱
        [err, res] = yield to_1.default(models_1.Account.update({
            query: { _id: account._id },
            update: { email }
        }));
        if (err) {
            throw errors_1.default({
                message: '修改邮箱账户失败',
                data: { errorInfo: err.message }
            });
        }
    }
    else {
        // =======================
        // 添加邮箱
        [err, res] = yield to_1.default(models_1.Account.save({
            data: { email, user_id: user._id + '' }
        }));
        if (err) {
            throw errors_1.default({
                message: '创建邮箱账户失败',
                data: { errorInfo: err.message }
            });
        }
    }
    // 清除该邮箱的验证码
    [err, res] = yield to_1.default(models_1.Captcha.remove({
        query: { email }
    }));
    return { success: true };
});
exports.query = { signIn };
exports.mutation = { addEmail };

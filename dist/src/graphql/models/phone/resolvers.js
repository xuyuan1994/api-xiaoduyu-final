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
const countries_1 = __importDefault(require("../../../../config/countries"));
const to_1 = __importDefault(require("../../../utils/to"));
const errors_1 = __importDefault(require("../../common/errors"));
const JWT = __importStar(require("../../../utils/jwt"));
const Model = __importStar(require("./arguments"));
const tools_1 = require("../tools");
// 绑定手机号
const addPhone = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role } = context;
    // 未登陆用户
    if (!user)
        throw errors_1.default({ message: '请求被拒绝' });
    let err, res, fields, phoneAccount;
    [err, fields] = tools_1.getSave({ args, model: Model.addPhone, role });
    if (err)
        throw errors_1.default({ message: err });
    const { phone, captcha, area_code, unlock_token } = fields;
    // =======================
    // 手机区域代码验证
    let existAreaCode = false;
    countries_1.default.map(item => {
        if (item.code == area_code)
            existAreaCode = true;
    });
    if (!existAreaCode)
        throw errors_1.default({ message: '区号不存在' });
    // =======================
    // 手机号是否被注册
    [err, res] = yield to_1.default(models_1.Phone.findOne({ query: { phone } }));
    if (err)
        throw errors_1.default({ message: '查询失败' });
    if (res && res.user_id + '' != user._id + '')
        throw errors_1.default({ message: '手机号已经被注册' });
    // =======================
    // 获取用户绑定的手机号
    [err, phoneAccount] = yield to_1.default(models_1.Phone.findOne({ query: { user_id: user._id } }));
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
        if (phoneAccount)
            throw errors_1.default({ message: '您已绑定了手机号' });
    }
    // =======================
    // 验证验证码
    [err, res] = yield to_1.default(models_1.Captcha.findOne({
        query: { user_id: user._id, phone, area_code, captcha, type: phoneAccount && unlock_token ? 'reset-phone' : 'binding-phone' },
        options: { sort: { create_at: -1 } }
    }));
    if (err)
        throw errors_1.default({ message: '查询异常' });
    if (!res)
        throw errors_1.default({ message: '无效的验证码' });
    if (phoneAccount && unlock_token) {
        // =======================
        // 更新邮箱
        [err, res] = yield to_1.default(models_1.Phone.update({
            query: { _id: phoneAccount._id },
            update: { phone, area_code }
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
        // 储存
        [err, res] = yield to_1.default(models_1.Phone.save({
            data: { user_id: user._id + '', phone, area_code }
        }));
        if (err) {
            throw errors_1.default({
                message: '添加失败',
                data: { errorInfo: err.message }
            });
        }
    }
    // 删除该用户所有的手机手机验证码
    yield to_1.default(models_1.Captcha.remove({
        query: { user_id: user._id, phone }
    }));
    return { success: true };
});
exports.query = {};
exports.mutation = { addPhone };

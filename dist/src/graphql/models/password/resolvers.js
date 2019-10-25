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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const node_uuid_1 = __importDefault(require("node-uuid"));
const models_1 = require("../../../models");
// tools
const to_1 = __importDefault(require("../../../utils/to"));
const errors_1 = __importDefault(require("../../common/errors"));
const validate_1 = __importDefault(require("../../../utils/validate"));
const JWT = __importStar(require("../../../utils/jwt"));
const Model = __importStar(require("./arguments"));
const tools_1 = require("../tools");
const getHashPassword = (new_password) => {
    return new Promise(resolve => {
        bcryptjs_1.default.genSalt(10, function (err, salt) {
            // if (err) return next(err);
            bcryptjs_1.default.hash(new_password, salt, function (err, hash) {
                // if (err) return next(err);
                resolve(hash);
            });
        });
    });
};
const updatePassword = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role } = context;
    if (!user)
        throw errors_1.default({ message: '请求被拒绝' });
    let err, query, save, result;
    [err, query] = tools_1.getQuery({ args, model: Model.updatePassword, role });
    [err, save] = tools_1.getSave({ args, model: Model.updatePassword, role });
    if (err)
        throw errors_1.default({ message: err });
    const { unlock_token } = query;
    const { new_password } = save;
    if (validate_1.default.password(new_password) != 'ok') {
        throw errors_1.default({ message: '密码格式错误' });
    }
    // =======================
    // 解锁token，身份验证的用户，可以修改自己的邮箱
    let obj = JWT.decode(unlock_token);
    if (obj.expires - new Date().getTime() <= 0 || !obj || !obj.user_id) {
        throw errors_1.default({ message: '无效的解锁令牌' });
    }
    if (obj.user_id != user._id + '') {
        throw errors_1.default({ message: '无权修改' });
    }
    ;
    let hashPassword = yield getHashPassword(new_password);
    [err, result] = yield to_1.default(models_1.User.update({
        query: { _id: user._id },
        update: {
            password: hashPassword,
            access_token: node_uuid_1.default.v4()
        }
    }));
    if (err) {
        throw errors_1.default({
            message: '修改失败',
            data: { errorInfo: err.message }
        });
    }
    return { success: true };
});
exports.query = {};
exports.mutation = { updatePassword };

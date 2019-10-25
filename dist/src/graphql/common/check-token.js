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
const JWT = __importStar(require("../../utils/jwt"));
const token_1 = __importDefault(require("../../models/token"));
const user_1 = __importDefault(require("../../models/user"));
const to_1 = __importDefault(require("../../utils/to"));
exports.default = ({ token = '', role = '' }) => {
    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
        let decoded = JWT.decode(token);
        // 解析错误
        if (!decoded)
            return resolve({});
        if (decoded && decoded.expires && decoded.expires < new Date().getTime()) {
            return resolve({});
        }
        let [err, result] = yield to_1.default(token_1.default.findOne({
            query: { user_id: decoded.user_id, token: token },
            select: {},
            options: {
                populate: {
                    path: 'user_id'
                }
            }
        }));
        if (err || !result || !result.user_id)
            return resolve({});
        let user = result.user_id;
        // 如果是管理员，并且是admin
        if (user.role == 100 && role == 'admin') {
            role = 'admin';
        }
        else {
            role = '';
        }
        // 最近登录时间，根据请求时间，每5分钟更新一次
        if (new Date().getTime() - new Date(user.last_sign_at).getTime() > 1000 * 60 * 5) {
            yield to_1.default(user_1.default.update({
                query: { _id: user._id },
                update: { last_sign_at: new Date() }
            }));
        }
        return resolve({ user, role });
    }));
};

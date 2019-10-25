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
const xss_1 = __importDefault(require("xss"));
const node_uuid_1 = __importDefault(require("node-uuid"));
const countries_1 = __importDefault(require("../../../../config/countries"));
const validate_1 = __importDefault(require("../../../utils/validate"));
const to_1 = __importDefault(require("../../../utils/to"));
const errors_1 = __importDefault(require("../../common/errors"));
// import { getQuery, getOption, getUpdateQuery, getUpdateContent, getSaveFields } from '../config';
// let [ query, mutation, resolvers ] = [{},{},{}];
const Model = __importStar(require("./arguments"));
const tools_1 = require("../tools");
function changeString(str) {
    var length = str.length;
    var s = '';
    if (length == 1) {
        return '*';
    }
    else if (length == 2) {
        return str.substring(0, 1) + '*';
    }
    else if (length <= 5) {
        var l = 1;
    }
    else {
        var l = 2;
    }
    var _str = str.substring(l, length - l);
    var _s = '';
    for (var i = 0, max = _str.length; i < max; i++) {
        _s += '*';
    }
    return str.replace(_str, _s);
}
// 获取用户自己的个人资料
const selfInfo = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    let { user } = context;
    if (!user) {
        throw errors_1.default({
            message: '没有权限访问',
            data: {}
        });
    }
    user = JSON.stringify(user);
    user = JSON.parse(user);
    if (!user) {
        throw errors_1.default({
            message: '无效获取',
            data: {}
        });
    }
    let err, result;
    [err, result] = yield to_1.default(models_1.Account.findOne({
        query: { user_id: user._id }
    }));
    if (result) {
        var arr = result.email.split("@");
        var email = changeString(arr[0]) + '@' + arr[1];
        user.email = email;
    }
    else {
        user.email = '';
    }
    [err, result] = yield to_1.default(models_1.Oauth.fetchByUserIdAndSource(user._id, 'weibo'));
    user.weibo = result && result.deleted == false ? true : false;
    [err, result] = yield to_1.default(models_1.Oauth.fetchByUserIdAndSource(user._id, 'qq'));
    user.qq = result && result.deleted == false ? true : false;
    [err, result] = yield to_1.default(models_1.Oauth.fetchByUserIdAndSource(user._id, 'github'));
    user.github = result && result.deleted == false ? true : false;
    [err, result] = yield to_1.default(models_1.Phone.findOne({ query: { user_id: user._id } }));
    user.phone = result ? changeString(result.phone + '') : '';
    user.area_code = result ? result.area_code : '';
    user.has_password = user.password ? true : false;
    return user;
});
const users = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role } = context;
    const { method } = args;
    let select = {}, err, query, options, list, ids, res;
    // [ err, query ] = getQuery({ args, model: 'user', role });
    // [ err, options ] = getOption({ args, model: 'user', role });
    [err, query] = tools_1.getQuery({ args, model: Model.users, role });
    [err, options] = tools_1.getOption({ args, model: Model.users, role });
    // select
    schema.fieldNodes[0].selectionSet.selections.map((item) => select[item.name.value] = 1);
    //===
    [err, list] = yield to_1.default(models_1.User.find({ query, select, options }));
    list = JSON.parse(JSON.stringify(list));
    if (user) {
        if (Reflect.has(select, 'follow')) {
            ids = [];
            list.map((item) => ids.push(item._id));
            [err, res] = yield to_1.default(models_1.Follow.find({
                query: {
                    user_id: user._id,
                    people_id: { "$in": ids },
                    deleted: false
                }
            }));
            ids = {};
            res.map((item) => ids[item.people_id] = 1);
            list.map((item) => {
                item.follow = ids[item._id] ? true : false;
                return item;
            });
        }
    }
    return list;
});
const countUsers = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role } = context;
    let err, query, count;
    [err, query] = tools_1.getQuery({ args, model: Model.users, role });
    //===
    [err, count] = yield to_1.default(models_1.User.count({ query }));
    return { count };
});
// 注册用户
const addUser = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role } = context;
    let err, res, fields;
    // [ err, fields ] = getSaveFields({ args, model: 'user', role });
    [err, fields] = tools_1.getSave({ args, model: Model.addUser, role });
    let { nickname, email, area_code, phone, password, source, captcha, gender } = fields;
    if (!email && !phone) {
        throw errors_1.default({ message: '手机或邮箱，两个必填一个' });
    }
    if (!captcha) {
        throw errors_1.default({ message: '验证码不能为空' });
    }
    if (typeof gender != 'undefined') {
        if (gender != 0 && gender != 1) {
            throw errors_1.default({ message: '无效的性别值' });
        }
    }
    if (phone) {
        let areaCodeStatus = false;
        countries_1.default.map(item => {
            if (item.code == area_code)
                areaCodeStatus = true;
        });
        if (!areaCodeStatus) {
            throw errors_1.default({ message: '手机区号不存在' });
        }
    }
    // xss过滤
    nickname = xss_1.default(nickname, {
        whiteList: {},
        stripIgnoreTag: true,
        onTagAttr: function (tag, name, value, isWhiteAttr) { return ''; }
    });
    if (validate_1.default.nickname(nickname) != 'ok') {
        throw errors_1.default({ message: '名字长度不能为空，或大于了20个字符' });
    }
    if (validate_1.default.password(password) != 'ok') {
        throw errors_1.default({ message: '密码长度需6-30个字符范围' });
    }
    if (email) {
        [err, res] = yield to_1.default(models_1.Account.findOne({
            query: { email }
        }));
        if (err) {
            throw errors_1.default({
                message: '添加失败',
                data: { errorInfo: err.message }
            });
        }
    }
    // 判断邮箱是否已经被注册
    if (email) {
        [err, res] = yield to_1.default(models_1.Account.findOne({
            query: { email }
        }));
        if (err) {
            throw errors_1.default({
                message: '查询失败',
                data: { errorInfo: err.message }
            });
        }
        if (res) {
            throw errors_1.default({ message: '邮箱已经被注册' });
        }
    }
    // 判断手机号是否已经被注册
    if (phone) {
        [err, res] = yield to_1.default(models_1.Phone.findOne({
            query: { phone }
        }));
        if (err) {
            throw errors_1.default({
                message: '查询失败',
                data: { errorInfo: err.message }
            });
        }
        if (res) {
            throw errors_1.default({ message: '手机已经被注册' });
        }
    }
    // 判断验证码是否有效
    [err, res] = yield to_1.default(models_1.Captcha.findOne({
        query: phone ? { phone } : { email },
        options: { sort: { create_at: -1 } }
    }));
    if (err) {
        throw errors_1.default({
            message: '查询失败',
            data: { errorInfo: err.message }
        });
    }
    if (!res) {
        throw errors_1.default({ message: '验证码不存在' });
    }
    if (res.captcha != captcha) {
        throw errors_1.default({ message: '验证码错误' });
    }
    // 获取加密的 hash 密码
    [err, password] = yield to_1.default(models_1.User.generateHashPassword({ password }));
    let data = {
        nickname,
        password,
        source: source || 0,
        access_token: node_uuid_1.default.v4()
    };
    if (typeof gender != 'undefined') {
        data.gender = gender;
    }
    [err, res] = yield to_1.default(models_1.User.save({ data }));
    if (err) {
        throw errors_1.default({
            message: '创建用户失败',
            data: { errorInfo: err.message }
        });
    }
    if (email) {
        [err, res] = yield to_1.default(models_1.Account.save({
            data: { email, user_id: res._id }
        }));
        if (err) {
            throw errors_1.default({
                message: '创建邮箱账户失败',
                data: { errorInfo: err.message }
            });
        }
    }
    if (phone) {
        [err, res] = yield to_1.default(models_1.Phone.save({
            data: { phone, user_id: res._id, area_code }
        }));
        if (err) {
            throw errors_1.default({
                message: '创建手机账户失败',
                data: { errorInfo: err.message }
            });
        }
    }
    yield to_1.default(models_1.Captcha.remove({
        query: phone ? { phone } : { email }
    }));
    return {
        success: true
    };
});
const updateUser = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role } = context;
    let options = {}, err, query, update, result;
    [err, query] = tools_1.getQuery({ args, model: Model.updateUser, role });
    [err, update] = tools_1.getSave({ args, model: Model.updateUser, role });
    if (err) {
        throw errors_1.default({
            message: err
        });
    }
    if (role != 'admin') {
        if (query._id != user._id + '') {
            throw errors_1.default({ message: '无权修改' });
        }
    }
    if (Reflect.has(update, 'nickname')) {
        if (!update.nickname) {
            throw errors_1.default({ message: '昵称不能为空' });
        }
        else if (update.nickname.length > 12) {
            throw errors_1.default({ message: '字符长度不能大于16个字符' });
        }
    }
    if (Reflect.has(update, 'brief') && update.brief.length > 70) {
        throw errors_1.default({ message: '字符长度不能大于120个字符' });
    }
    [err, result] = yield to_1.default(models_1.User.update({ query, update, options }));
    if (err) {
        throw errors_1.default({
            message: '更新失败',
            data: { errorInfo: err.message }
        });
    }
    if (Reflect.has(update, 'blocked')) {
        // 更新feed中相关posts的delete状态
        let err, feedList;
        [err, feedList] = yield to_1.default(models_1.Feed.find({
            query: { user_id: query._id }
        }));
        let ids = [];
        feedList.map((feed) => ids.push(feed._id));
        [err] = yield to_1.default(models_1.Feed.update({
            query: { _id: { '$in': ids } },
            update: { deleted: update.blocked },
            options: { multi: true }
        }));
        if (err) {
            throw errors_1.default({
                message: 'Feed 更新失败',
                data: { errorInfo: err.message }
            });
        }
    }
    return { success: true };
});
exports.query = { selfInfo, users, countUsers };
exports.mutation = { addUser, updateUser };
// export { query, mutation, resolvers }

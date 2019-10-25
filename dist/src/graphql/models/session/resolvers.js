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
const Model = __importStar(require("./arguments"));
const tools_1 = require("../tools");
const sessions = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role, ip } = context;
    let query, options, err, list = [];
    if (!user || !ip)
        throw errors_1.default({ message: '请求被拒绝' });
    [err, query] = tools_1.getQuery({ args, model: Model.sessions, role });
    [err, options] = tools_1.getOption({ args, model: Model.sessions, role });
    if (query._id) {
    }
    else {
        query.addressee_id = user._id;
        query.last_message = { '$exists': true };
    }
    options.populate = [
        {
            path: 'user_id',
            justOne: true
        },
        {
            path: 'addressee_id',
            justOne: true
        },
        {
            path: 'last_message',
            justOne: true
        }
    ];
    [err, list] = yield to_1.default(models_1.Session.find({ query, options }));
    if (query._id && list[0] && list[0].addressee_id._id + '' != user._id + '') {
        throw errors_1.default({ message: '请求被拒绝' });
    }
    return list;
});
const countSessions = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role, ip } = context;
    let query, options, err, count = 0;
    if (!user || !ip)
        throw errors_1.default({ message: '请求被拒绝' });
    [err, query] = tools_1.getQuery({ args, model: Model.sessions, role });
    [err, options] = tools_1.getOption({ args, model: Model.sessions, role });
    [err, count] = yield to_1.default(models_1.Session.count({ query, options }));
    return { count };
});
const getUnreadSessions = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role, ip } = context;
    if (!user || !ip)
        throw errors_1.default({ message: '请求被拒绝' });
    let [err, list] = yield to_1.default(models_1.Session.find({
        query: {
            addressee_id: user._id,
            unread_count: { '$gt': 0 }
        }
    }));
    let count = 0;
    list.map((item) => {
        count += item.unread_count;
    });
    return { count };
});
const createSession = (userId, addresseeId) => {
    return new Promise((resove, reject) => __awaiter(void 0, void 0, void 0, function* () {
        let err, session;
        // 查询是否存在会话，如果不存在则创建会话
        [err, session] = yield to_1.default(models_1.Session.findOne({
            query: {
                user_id: userId,
                addressee_id: addresseeId
            }
        }));
        if (!session) {
            [err, session] = yield to_1.default(models_1.Session.save({
                data: {
                    user_id: userId,
                    addressee_id: addresseeId
                }
            }));
        }
        if (err) {
            reject(err);
        }
        else {
            resove(session);
        }
    }));
};
const getSession = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role, ip } = context;
    let save, err, session;
    if (!user || !ip)
        throw errors_1.default({ message: '请求被拒绝' });
    [err, save] = tools_1.getSave({ args, model: Model.getSession, role });
    const { addressee_id } = save;
    yield to_1.default(createSession(user._id, addressee_id));
    [err, session] = yield to_1.default(createSession(addressee_id, user._id));
    return session;
});
// session 设置已读
const readSession = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role, ip } = context;
    let query, err, session;
    if (!user || !ip)
        throw errors_1.default({ message: '请求被拒绝' });
    [err, query] = tools_1.getQuery({ args, model: Model.readSession, role });
    // 查询是否存在会话，如果不存在则创建会话
    [err, session] = yield to_1.default(models_1.Session.findOne({
        query
    }));
    if (session.addressee_id + '' == user._id + '') {
        // 更新会话未读条数为0
        yield to_1.default(models_1.Session.updateOne({
            query,
            update: {
                unread_count: 0
            }
        }));
        // 查询这个会话中未读的消息，并更新为已读
        models_1.Message.find({
            query: {
                addressee_id: session.addressee_id,
                user_id: session.user_id,
                has_read: false,
                blocked: false,
                deleted: false
            }
        }).then((res) => {
            if (res) {
                res.map((item) => {
                    models_1.Message.update({
                        query: { _id: item._id },
                        update: { has_read: true }
                    });
                });
            }
            console.log(res);
        });
        return {
            success: true
        };
    }
    else {
        return {
            success: false
        };
    }
});
exports.query = { sessions, countSessions, getSession, getUnreadSessions };
exports.mutation = { readSession };

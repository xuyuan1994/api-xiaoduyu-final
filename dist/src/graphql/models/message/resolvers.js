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
const alicloud = __importStar(require("../../../common/alicloud"));
const xss_1 = __importDefault(require("../../../utils/xss"));
const socket_1 = require("../../../socket");
const Model = __importStar(require("./arguments"));
const tools_1 = require("../tools");
const messages = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role, ip } = context;
    let query, options, err, messageList = [];
    if (!user || !ip)
        throw errors_1.default({ message: '请求被拒绝' });
    [err, query] = tools_1.getQuery({ args, model: Model.messages, role });
    [err, options] = tools_1.getOption({ args, model: Model.messages, role });
    options.populate = [
        {
            path: 'user_id',
            justOne: true
        },
        {
            path: 'addressee_id',
            justOne: true
        }
    ];
    [err, messageList] = yield to_1.default(models_1.Message.find({ query, options }));
    return messageList;
});
const countMessages = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role, ip } = context;
    let query, err, count;
    if (!user || !ip)
        throw errors_1.default({ message: '请求被拒绝' });
    [err, query] = tools_1.getQuery({ args, model: Model.messages, role });
    [err, count] = yield to_1.default(models_1.Message.count({ query }));
    if (err) {
        throw errors_1.default({
            message: '查询失败',
            data: { errorInfo: err.message }
        });
    }
    if (Reflect.has(args, 'has_read') && args.has_read === false) {
        models_1.Message.findOne({
            query: {
                user_id: user._id,
                has_read: false
            },
            options: {
                sort: {
                    create_at: 1
                }
            }
        }).then((item) => {
            if (!item)
                return;
            models_1.User.updateOne({
                query: {
                    _id: user._id
                },
                update: {
                    unread_message_at: item.create_at
                }
            });
        });
    }
    return { count };
});
const addMessage = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role, ip } = context;
    let err, res, fields;
    if (!user)
        throw errors_1.default({ message: '请求被拒绝' });
    if (!ip)
        throw errors_1.default({ message: '无效的ip地址' });
    [err, fields] = tools_1.getSave({ args, model: Model.addMessage, role });
    if (err)
        throw errors_1.default({ message: err });
    // 开始逻辑
    let { addressee_id, type, content, content_html, device = 1 } = fields;
    if (user._id + '' == addressee_id) {
        throw errors_1.default({
            message: '不能给自己发送私信'
        });
    }
    // 判断是否禁言
    if (user && user.banned_to_post &&
        new Date(user.banned_to_post).getTime() > new Date().getTime()) {
        let countdown = Countdown(new Date() + '', user.banned_to_post);
        throw errors_1.default({
            message: '您被禁言，{days}天{hours}小时{mintues}分钟后解除禁言',
            data: { error_data: countdown }
        });
    }
    content_html = xss_1.default(content_html);
    let _content_html = content_html || '';
    _content_html = _content_html.replace(/<[^>]+>/g, "");
    _content_html = _content_html.replace(/(^\s*)|(\s*$)/g, "");
    if (!_content_html) {
        throw errors_1.default({
            message: '私信内容不能为空'
        });
    }
    [err, res] = yield to_1.default(models_1.User.findOne({
        query: {
            _id: addressee_id
        }
    }));
    if (err) {
        throw errors_1.default({
            message: '查询失败',
            data: { errorInfo: err.message }
        });
    }
    if (!res) {
        throw errors_1.default({
            message: '发件人不存在'
        });
    }
    [err, res] = yield to_1.default(models_1.Message.save({
        data: {
            user_id: user._id,
            addressee_id,
            type,
            content,
            content_html,
            device,
            ip
        }
    }));
    if (err) {
        throw errors_1.default({
            message: '查询失败',
            data: { errorInfo: err.message }
        });
    }
    // 阿里云推送
    let commentContent = content_html.replace(/<[^>]+>/g, "");
    let titleIOS = user.nickname + ': ' + commentContent;
    if (titleIOS.length > 40)
        titleIOS = titleIOS.slice(0, 40) + '...';
    let body = commentContent;
    if (body.length > 40)
        body = body.slice(0, 40) + '...';
    alicloud.pushToAccount({
        userId: addressee_id,
        title: user.nickname,
        body,
        summary: titleIOS,
        params: {
            routeName: 'Sessions', params: {}
        }
    });
    updateSession(user._id, addressee_id, res._id);
    updateSession(addressee_id, user._id, res._id);
    return {
        success: true,
        _id: res._id
    };
});
const updateSession = (userId, addresseeId, messageId) => __awaiter(void 0, void 0, void 0, function* () {
    let session, count, message, err;
    // 查询是否存在会话，如果不存在则创建会话
    [err, session] = yield to_1.default(models_1.Session.findOne({
        query: {
            user_id: userId,
            addressee_id: addresseeId
        }
    }));
    if (!session) {
        return;
    }
    [err, count] = yield to_1.default(models_1.Message.count({
        query: {
            user_id: session.user_id,
            addressee_id: session.addressee_id,
            has_read: false
            // create_at: {
            // '$gte': message.create_at
            // }
        }
    }));
    yield models_1.Session.updateOne({
        query: {
            _id: session._id
        },
        update: {
            last_message: messageId,
            unread_count: count
        }
    });
    socket_1.emit(addresseeId, {
        type: 'new-session',
        data: {
            sessionId: session._id,
            messageId
        }
    });
});
exports.query = { messages, countMessages };
exports.mutation = { addMessage };
function Countdown(nowDate, endDate) {
    var lastDate = Math.ceil(new Date(endDate).getTime() / 1000);
    var now = Math.ceil(new Date(nowDate).getTime() / 1000);
    var timeCount = lastDate - now;
    var days = parseInt((timeCount / (3600 * 24)) + '');
    var hours = parseInt(((timeCount - (3600 * 24 * days)) / 3600) + '');
    var mintues = parseInt(((timeCount - (3600 * 24 * days) - (hours * 3600)) / 60) + '');
    var seconds = timeCount - (3600 * 24 * days) - (3600 * hours) - (60 * mintues);
    return {
        days: days,
        hours: hours,
        mintues: mintues,
        seconds: seconds
    };
}

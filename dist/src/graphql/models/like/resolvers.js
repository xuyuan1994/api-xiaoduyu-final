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
const aModel = __importStar(require("./arguments"));
const tools_1 = require("../tools");
// 还缺少通知
const like = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role } = context;
    let err, // 错误
    result, // 结果
    fields, // 字段
    Model, // 目标操作的方法
    target; // 目标对象
    if (!user)
        throw errors_1.default({ message: '请求被拒绝' });
    [err, fields] = tools_1.getSave({ args, model: aModel.like, role });
    if (err)
        throw errors_1.default({ message: err });
    // ===================================
    // 业务主逻辑
    const { type, target_id, mood, status } = fields;
    if (type == 'comment' || type == 'reply') {
        Model = models_1.Comment;
    }
    else if (type == 'posts') {
        Model = models_1.Posts;
    }
    else {
        throw errors_1.default({ message: 'type 类型错误' });
    }
    [err, target] = yield to_1.default(Model.findOne({
        query: { _id: target_id }
    }));
    if (err) {
        throw errors_1.default({
            message: 'target_id 查询失败',
            data: { errorInfo: err.message }
        });
    }
    else if (!target) {
        throw errors_1.default({
            message: '查询不到 target_id 资源'
        });
    }
    if (target.user_id + '' == user._id + '') {
        throw errors_1.default({ message: '不能点赞自己的帖子或评论' });
    }
    [err, result] = yield to_1.default(models_1.Like.findOne({
        query: {
            user_id: user._id, type, target_id
        }
    }));
    if (!result && status) {
        // 添加赞
        [err, result] = yield to_1.default(models_1.Like.save({
            data: {
                user_id: user._id,
                type,
                target_id,
                mood
            }
        }));
    }
    else if (result && result.deleted == true && status) {
        // 恢复赞
        [err, result] = yield to_1.default(models_1.Like.update({
            query: { _id: result._id },
            update: { deleted: false }
        }));
    }
    else if (result && result.deleted == false && !status) {
        // 取消赞
        [err, result] = yield to_1.default(models_1.Like.update({
            query: { _id: result._id },
            update: { deleted: true }
        }));
    }
    // ===================================
    // 更新累计数
    [err, result] = yield to_1.default(models_1.Like.count({
        query: { target_id, deleted: false }
    }));
    yield to_1.default(Model.update({
        query: { _id: target_id },
        update: { like_count: result }
    }));
    // ===================================
    // 发送通知
    let data = {
        sender_id: user._id,
        addressee_id: target.user_id,
    };
    if (type == 'comment') {
        data.type = 'like-comment';
        data.comment_id = target_id;
    }
    else if (type == 'reply') {
        data.type = 'like-reply';
        data.comment_id = target_id;
    }
    else if (type == 'posts') {
        data.type = 'like-posts';
        data.posts_id = target_id;
    }
    [err, result] = yield to_1.default(models_1.UserNotification.findOne({ query: data }));
    if (result) {
        if (result.deleted && status ||
            !result.deleted && !status) {
            yield to_1.default(models_1.UserNotification.update({
                query: { _id: result._id },
                update: { deleted: status ? false : true }
            }));
        }
    }
    else if (!result && status) {
        // 添加通知
        yield to_1.default(models_1.UserNotification.addOneAndSendNotification({ data }));
    }
    // 返回
    return {
        success: true
    };
});
exports.query = {};
exports.mutation = { like };

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
const blocks = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role, ip } = context;
    // 未登陆用户
    if (!user)
        throw errors_1.default({ message: '请求被拒绝' });
    if (!ip)
        throw errors_1.default({ message: '获取不到您的ip' });
    let err, res, query = {}, select = {}, options = {};
    [err, query] = tools_1.getQuery({ args, model: Model.blocks, role });
    [err, options] = tools_1.getOption({ args, model: Model.blocks, role });
    // select
    schema.fieldNodes[0].selectionSet.selections.map((item) => select[item.name.value] = 1);
    if (err)
        throw errors_1.default({ message: err });
    query.user_id = user._id;
    if (!query.deleted)
        query.deleted = false;
    // 添加默认排序
    if (!Reflect.has(options, 'sort_by')) {
        options.sort = {
            create_at: -1
        };
    }
    if (Reflect.has(select, 'people_id')) {
        if (!options.populate)
            options.populate = [];
        options.populate.push({
            path: 'people_id',
            select: { _id: 1, nickname: 1, avatar: 1, create_at: 1 },
            justOne: true
        });
    }
    if (Reflect.has(select, 'posts_id')) {
        if (!options.populate)
            options.populate = [];
        options.populate.push({
            path: 'posts_id',
            select: { _id: 1, title: 1, content_html: 1, type: 1 },
            justOne: true
        });
    }
    if (Reflect.has(select, 'comment_id')) {
        if (!options.populate)
            options.populate = [];
        options.populate.push({
            path: 'comment_id',
            select: { _id: 1, content_html: 1, posts_id: 1, reply_id: 1, parent_id: 1 },
            justOne: true
        });
    }
    [err, res] = yield to_1.default(models_1.Block.find({ query, select, options }));
    return res;
});
// 获取累计数
const countBlocks = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role, ip } = context;
    if (!user)
        throw errors_1.default({ message: '请求被拒绝' });
    if (!ip)
        throw errors_1.default({ message: '获取不到您的ip' });
    let err, res, query, count;
    [err, query] = tools_1.getQuery({ args, model: Model.blocks, role });
    query.user_id = user._id;
    if (!query.deleted)
        query.deleted = true;
    if (err)
        throw errors_1.default({ message: err });
    [err, count] = yield to_1.default(models_1.Block.count({ query }));
    return {
        count
    };
});
const addBlock = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role, ip } = context;
    // 未登陆用户
    if (!user)
        throw errors_1.default({ message: '请求被拒绝' });
    if (!ip)
        throw errors_1.default({ message: '获取不到您的ip' });
    let err, res, fields;
    [err, fields] = tools_1.getSave({ args, model: Model.addBlock, role });
    if (err)
        throw errors_1.default({ message: err });
    //======= 开始逻辑
    let { posts_id, comment_id, people_id } = fields;
    if (posts_id) {
        [err, res] = yield to_1.default(models_1.Posts.findOne({
            query: { _id: posts_id }
        }));
        if (err) {
            throw errors_1.default({
                message: '帖子查询失败',
                data: { errorInfo: err.message }
            });
        }
        if (!res)
            throw errors_1.default({ message: '帖子不存在' });
        if (res.user_id + '' === user._id + '') {
            throw errors_1.default({
                message: '不能屏蔽自己的帖子'
            });
        }
    }
    else if (comment_id) {
        [err, res] = yield to_1.default(models_1.Comment.findOne({
            query: { _id: comment_id }
        }));
        if (err) {
            throw errors_1.default({
                message: '评论查询失败',
                data: { errorInfo: err.message }
            });
        }
        if (!res)
            throw errors_1.default({ message: '评论不存在' });
        if (res.user_id + '' === user._id + '') {
            throw errors_1.default({
                message: '不能屏蔽自己的评论'
            });
        }
    }
    else if (people_id) {
        [err, res] = yield to_1.default(models_1.User.findOne({
            query: { _id: people_id }
        }));
        if (err) {
            throw errors_1.default({
                message: '用户查询失败',
                data: { errorInfo: err.message }
            });
        }
        if (!res)
            throw errors_1.default({ message: '用户不存在' });
        if (res._id + '' === user._id + '') {
            throw errors_1.default({
                message: '不能屏蔽自己'
            });
        }
    }
    else {
        throw errors_1.default({
            message: '缺少目标id',
            data: { errorInfo: err.message }
        });
    }
    //======= 查询是否屏蔽该资源
    let query = { user_id: user._id };
    if (comment_id)
        query.comment_id = comment_id;
    else if (people_id)
        query.people_id = people_id;
    else if (posts_id)
        query.posts_id = posts_id;
    [err, res] = yield to_1.default(models_1.Block.findOne({ query }));
    if (err) {
        throw errors_1.default({
            message: '查询失败',
            data: { errorInfo: err.message }
        });
    }
    if (res && res.deleted == false) {
        throw errors_1.default({
            message: '你已屏蔽了'
        });
    }
    //======= 添加
    if (!res) {
        [err, res] = yield to_1.default(models_1.Block.save({ data: query }));
        if (err) {
            throw errors_1.default({
                message: '添加失败',
                data: { errorInfo: err.message }
            });
        }
    }
    else if (res && res.deleted) {
        yield to_1.default(models_1.Block.update({
            query: { _id: res._id },
            update: { deleted: false }
        }));
    }
    updateUserBlockData(user._id);
    return {
        success: true,
        _id: res._id
    };
});
const removeBlock = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role, ip } = context;
    // 未登陆用户
    if (!user)
        throw errors_1.default({ message: '请求被拒绝' });
    if (!ip)
        throw errors_1.default({ message: '获取不到你的ip' });
    let err, res, fields, query = {}, result;
    [err, query] = tools_1.getQuery({ args, model: Model.removeBlock, role });
    // 获取更新内容
    // [ err, query ] = getUpdateQuery({ args, model:'block', role });
    if (err)
        throw errors_1.default({ message: err });
    if (Reflect.ownKeys(query).length == 0) {
        throw errors_1.default({ message: '缺少目标参数' });
    }
    query.user_id = user._id + '';
    // 判断数据是否存在
    [err, result] = yield to_1.default(models_1.Block.findOne({ query }));
    if (err) {
        throw errors_1.default({
            message: '查询失败',
            data: { errorInfo: err.message }
        });
    }
    if (!result) {
        throw errors_1.default({ message: '不存该数据' });
    }
    // 表示未删除状态
    if (result && result.deleted == false) {
        yield models_1.Block.update({
            query: { _id: result._id },
            update: { deleted: true }
        });
    }
    updateUserBlockData(user._id);
    return {
        success: true
    };
});
function updateUserBlockData(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let [err, data] = yield to_1.default(models_1.Block.find({
            query: {
                user_id: userId,
                deleted: false
            },
            select: { posts_id: 1, people_id: 1, comment_id: 1, _id: 0 }
        }));
        var posts_ids = [], people_ids = [], comment_ids = [];
        data.map(function (item) {
            if (item.posts_id)
                posts_ids.push(item.posts_id);
            if (item.people_id)
                people_ids.push(item.people_id);
            if (item.comment_id)
                comment_ids.push(item.comment_id);
        });
        models_1.User.update({
            query: { _id: userId },
            update: {
                block_posts: posts_ids,
                block_posts_count: posts_ids.length,
                block_comment: comment_ids,
                block_comment_count: comment_ids.length,
                block_people: people_ids,
                block_people_count: people_ids.length
            }
        });
    });
}
exports.query = { blocks, countBlocks };
exports.mutation = { addBlock, removeBlock };

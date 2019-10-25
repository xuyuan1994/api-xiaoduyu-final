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
/*
Follow.aggregate([
  {
    $lookup: {
      from: "posts",
      localField: "posts_id",
      foreignField: "_id",
      as: "posts_id"
    }
  },
  {
    $match: {
      posts_id: { '$exists': true },
      'posts_id.type': 2
    }
  },
  {
    $project: {
      // 'posts_id': 1,
      'posts_id': { ip: 1 }
    }
  }
]).then((res: any)=>{
  console.log(res[0]);
});
*/
const findFollows = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role } = context;
    const { method } = args;
    let err, query, options, res, select = {}, list, ids;
    [err, query] = tools_1.getQuery({ args, model: Model.findFollows, role });
    [err, options] = tools_1.getOption({ args, model: Model.findFollows, role });
    // select
    schema.fieldNodes[0].selectionSet.selections.map((item) => select[item.name.value] = 1);
    if (Reflect.has(select, 'user_id')) {
        if (!options.populate)
            options.populate = [];
        options.populate.push({
            path: 'user_id',
            model: 'User',
            select: { _id: 1, nickname: 1, create_at: 1, avatar: 1, avatar_url: 1, fans_count: 1, comment_count: 1, follow_people_count: 1, brief: 1 }
        });
    }
    if (Reflect.has(select, 'people_id')) {
        if (!options.populate)
            options.populate = [];
        options.populate.push({
            path: 'people_id',
            model: 'User',
            select: { _id: 1, nickname: 1, create_at: 1, avatar: 1, avatar_url: 1, fans_count: 1, comment_count: 1, follow_people_count: 1, brief: 1 }
        });
    }
    if (Reflect.has(select, 'topic_id')) {
        if (!options.populate)
            options.populate = [];
        options.populate.push({
            path: 'topic_id',
            model: 'Topic',
            select: { '_id': 1, 'avatar': 1, 'name': 1, 'brief': 1 }
        });
    }
    if (Reflect.has(select, 'posts_id')) {
        if (!options.populate)
            options.populate = [];
        options.populate.push({
            path: 'posts_id',
            model: 'Posts',
            select: { '_id': 1, 'title': 1 }
        });
    }
    [err, list] = yield to_1.default(models_1.Follow.find({ query, options }));
    if (err) {
        throw errors_1.default({
            message: '查询失败',
            data: { errorInfo: err.message }
        });
    }
    list = JSON.parse(JSON.stringify(list));
    if (user) {
        if (Reflect.has(select, 'people_id')) {
            ids = [];
            list.map((item) => {
                if (item.people_id)
                    ids.push(item.people_id._id);
            });
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
                item.people_id.follow = ids[item.people_id._id] ? true : false;
                return item;
            });
        }
        if (Reflect.has(select, 'user_id')) {
            ids = [];
            list.map((item) => {
                if (item.user_id)
                    ids.push(item.user_id._id);
            });
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
                item.user_id.follow = ids[item.user_id._id] ? true : false;
                return item;
            });
        }
        if (Reflect.has(select, 'posts_id')) {
            ids = [];
            list.map((item) => {
                if (item.posts_id)
                    ids.push(item.posts_id._id);
            });
            [err, res] = yield to_1.default(models_1.Follow.find({
                query: {
                    user_id: user._id,
                    posts_id: { "$in": ids },
                    deleted: false
                }
            }));
            ids = {};
            res.map((item) => ids[item.posts_id] = 1);
            list.map((item) => {
                item.posts_id.follow = ids[item.posts_id._id] ? true : false;
                return item;
            });
        }
        if (Reflect.has(select, 'topic_id')) {
            ids = [];
            list.map((item) => {
                if (item.topic_id)
                    ids.push(item.topic_id._id);
            });
            [err, res] = yield to_1.default(models_1.Follow.find({
                query: {
                    user_id: user._id,
                    topic_id: { "$in": ids },
                    deleted: false
                }
            }));
            ids = {};
            res.map((item) => ids[item.topic_id] = 1);
            list.map((item) => {
                item.topic_id.follow = ids[item.topic_id._id] ? true : false;
                return item;
            });
        }
    }
    return list;
});
const countFindFollows = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role } = context;
    const { method } = args;
    let err, query, options, count;
    // [ err, query ] = getQuery({ args, model:'follow', role });
    [err, query] = tools_1.getQuery({ args, model: Model.findFollows, role });
    [err, options] = tools_1.getOption({ args, model: Model.findFollows, role });
    [err, count] = yield to_1.default(models_1.Follow.count({ query, options }));
    if (err) {
        throw errors_1.default({
            message: '查询失败',
            data: { errorInfo: err.message }
        });
    }
    return { count };
});
// 还缺少通知
const addFollow = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role } = context;
    let err, // 错误
    result, // 结果
    fields, // 字段
    posts_user_id; // 关注帖子的创建用户
    if (!user)
        throw errors_1.default({ message: '请求被拒绝' });
    [err, fields] = tools_1.getSave({ args, model: Model.addFollow, role });
    // [ err, fields ] = getSaveFields({ args, model:'follow', role });
    if (err)
        throw errors_1.default({ message: err });
    // 开始逻辑
    const { topic_id, posts_id, user_id, status } = fields;
    if (!Reflect.has(fields, 'status')) {
        throw errors_1.default({ message: 'status 不能为空' });
    }
    else if (topic_id && posts_id ||
        posts_id && user_id ||
        user_id && topic_id) {
        throw errors_1.default({ message: '不能同时传多个目标id' });
    }
    // 如果存在话题，判断话题是否存在
    if (topic_id) {
        [err, result] = yield to_1.default(models_1.Topic.findOne({
            query: { _id: topic_id },
            select: { _id: 1 }
        }));
        if (err || !result) {
            throw errors_1.default({
                message: err ? '查询失败' : '话题不存在',
                data: { errorInfo: err ? err.message : '' }
            });
        }
    }
    // 如果存在用户，判断话题是否存在
    if (user_id) {
        [err, result] = yield to_1.default(models_1.User.findOne({
            query: { _id: user_id },
            select: { _id: 1 }
        }));
        if (err || !result) {
            throw errors_1.default({
                message: err ? '查询失败' : '用户不存在',
                data: { errorInfo: err ? err.message : '' }
            });
        }
        if (result._id + '' == user._id + '') {
            throw errors_1.default({ message: '不能关注自己' });
        }
    }
    // 如果存在用户，判断话题是否存在
    if (posts_id) {
        [err, result] = yield to_1.default(models_1.Posts.findOne({
            query: { _id: posts_id },
            select: { _id: 1, user_id: 1 }
        }));
        if (err || !result) {
            throw errors_1.default({
                message: err ? '查询失败' : '帖子不存在',
                data: { errorInfo: err ? err.message : '' }
            });
        }
        if (result.user_id + '' == user._id) {
            throw errors_1.default({ message: '不能关注自己的帖子' });
        }
        posts_user_id = result.user_id;
    }
    // 查询关注
    let query = {
        user_id: user._id
    };
    if (topic_id)
        query.topic_id = topic_id;
    else if (posts_id)
        query.posts_id = posts_id;
    else if (user_id)
        query.people_id = user_id;
    [err, result] = yield to_1.default(models_1.Follow.findOne({
        query: query
    }));
    if (err) {
        throw errors_1.default({
            message: '查询失败',
            data: { errorInfo: err.message }
        });
    }
    // 关注
    if (status) {
        // 添加关注
        if (!result) {
            // 添加
            [err, result] = yield to_1.default(models_1.Follow.save({ data: query }));
            if (err) {
                throw errors_1.default({
                    message: '储存失败',
                    data: { errorInfo: err.message }
                });
            }
        }
        else {
            // 修改
            [err, result] = yield to_1.default(models_1.Follow.update({
                query: { _id: result._id },
                update: { deleted: false }
            }));
            if (err) {
                throw errors_1.default({
                    message: '更新失败',
                    data: { errorInfo: err.message }
                });
            }
        }
    }
    else {
        // 取消关注
        if (result) {
            // 修改
            [err, result] = yield to_1.default(models_1.Follow.update({
                query: { _id: result._id },
                update: { deleted: true }
            }));
            if (err) {
                throw errors_1.default({
                    message: '更新失败',
                    data: { errorInfo: err.message }
                });
            }
        }
    }
    // 更新相关count
    if (topic_id) {
        yield updateTopicFollowCount(topic_id);
        yield updateUserTopicCount(user._id);
    }
    else if (posts_id) {
        yield updateUserPostsCount(user._id);
        yield updatePostsFollowCount(posts_id);
    }
    else if (user_id) {
        yield updatePeopleFollowCount(user_id);
        yield updateUserFollowPeopleCount(user._id);
    }
    // 发送通知
    if (posts_id || user_id) {
        let data = {};
        if (posts_id) {
            data = {
                type: 'follow-posts',
                posts_id: posts_id,
                sender_id: user._id,
                addressee_id: posts_user_id
            };
        }
        else if (user_id) {
            data = {
                type: 'follow-you',
                sender_id: user._id,
                addressee_id: user_id
            };
        }
        [err, result] = yield to_1.default(models_1.UserNotification.findOne({ query: data }));
        if (!result && status) {
            // 不存在则创建一条通知
            yield to_1.default(models_1.UserNotification.addOneAndSendNotification({ data }));
        }
        else if (result && !status) {
            // 如果存在，并且是取消关注，则标记通知为删除
            yield to_1.default(models_1.UserNotification.update({
                query: { _id: result._id },
                update: { deleted: true }
            }));
        }
        else if (result && result.deleted && status) {
            // 如果存在，并且通知是删除状态，并且是关注操作，则取消删除标记
            yield to_1.default(models_1.UserNotification.update({
                query: { _id: result._id },
                update: { deleted: false }
            }));
        }
    }
    return {
        success: true
    };
});
function updateUserPostsCount(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let [err, result] = yield to_1.default(models_1.Follow.find({
            query: {
                user_id: userId,
                posts_id: { $exists: true },
                deleted: false
            },
            select: { posts_id: 1, _id: 0 }
        }));
        var ids = [];
        result.map((item) => { ids.push(item.posts_id); });
        [err, result] = yield to_1.default(models_1.User.update({
            query: { _id: userId },
            update: { follow_posts: ids, follow_posts_count: ids.length }
        }));
    });
}
;
function updateUserTopicCount(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let [err, result] = yield to_1.default(models_1.Follow.find({
            query: {
                user_id: userId,
                topic_id: { $exists: true },
                deleted: false
            },
            select: { topic_id: 1, _id: 0 }
        }));
        var ids = [];
        result.map((item) => { ids.push(item.topic_id); });
        [err, result] = yield to_1.default(models_1.User.update({
            query: { _id: userId },
            update: { follow_topic: ids, follow_topic_count: ids.length }
        }));
    });
}
;
function updateUserFollowPeopleCount(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let [err, result] = yield to_1.default(models_1.Follow.find({
            query: {
                user_id: userId,
                people_id: { $exists: true },
                deleted: false
            },
            select: { people_id: 1, _id: 0 }
        }));
        var ids = [];
        result.map((item) => { ids.push(item.people_id); });
        [err, result] = yield to_1.default(models_1.User.update({
            query: { _id: userId },
            update: { follow_people: ids, follow_people_count: ids.length }
        }));
    });
}
;
function updatePostsFollowCount(postsId) {
    return __awaiter(this, void 0, void 0, function* () {
        let [err, total] = yield to_1.default(models_1.Follow.count({
            query: { posts_id: postsId, deleted: false }
        }));
        yield to_1.default(models_1.Posts.update({
            query: { _id: postsId },
            update: { follow_count: total }
        }));
    });
}
;
// 更新节点被关注的数量
function updateTopicFollowCount(topicId) {
    return __awaiter(this, void 0, void 0, function* () {
        let [err, total] = yield to_1.default(models_1.Follow.count({
            query: { topic_id: topicId, deleted: false }
        }));
        yield to_1.default(models_1.Topic.update({
            query: { _id: topicId },
            update: { follow_count: total }
        }));
    });
}
;
function updatePeopleFollowCount(peopleId) {
    return __awaiter(this, void 0, void 0, function* () {
        let [err, total] = yield to_1.default(models_1.Follow.count({
            query: { people_id: peopleId, deleted: false }
        }));
        yield to_1.default(models_1.User.update({
            query: { _id: peopleId },
            update: { fans_count: total }
        }));
    });
}
;
exports.query = { findFollows, countFindFollows };
exports.mutation = { addFollow };

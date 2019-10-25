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
Posts.find({
  query: {}
}).then(result=>{
  // console.log(res);
  // console.log(res);

  result.map(item=>{
    Feed.save({
      data: {
        user_id: item.user_id,
        topic_id: item.topic_id,
        posts_id: item._id,
        create_at: item.create_at
      }
    })
  });

  console.log('posts 完成');

});



Comment.find({
  query: {}
}).then(result=>{
  // console.log(res);
  // console.log(res);

  result.map(item=>{
    Feed.save({
      data: {
        user_id: item.user_id,
        posts_id: item.posts_id,
        comment_id: item._id,
        create_at: item.create_at
      }
    })
  })

  console.log('comment 完成');

});
*/
const feed = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role } = context;
    let err, query, options, select = {}, list, followList;
    // 请求用户的角色
    let admin = role == 'admin' ? true : false;
    [err, query] = tools_1.getQuery({ args, model: Model.feed, role });
    [err, options] = tools_1.getOption({ args, model: Model.feed, role });
    // if (!options.limit || options.limit > 50) {
    //   options.limit = 50
    // }
    let limit = options.limit;
    // 偏好模式（用户关注），如果用户未登陆，则拒绝请求
    if (args.preference && !user) {
        throw errors_1.default({ message: '请求被拒绝，用户未登陆' });
    }
    if (args.preference && user) {
        let _query = { '$or': [] };
        // 获取与自己相关的帖子和评论
        /*
        _query['$or'].push(Object.assign({}, query, {
          user_id: user._id,
          posts_id: { '$nin': user.block_posts },
          deleted: false
        }));
        */
        // 关注的用户的评论与帖子
        if (user.follow_people.length > 0) {
            _query['$or'].push(Object.assign({}, query, {
                user_id: { '$in': user.follow_people, '$nin': user.block_people },
                posts_id: { '$nin': user.block_posts },
                deleted: false
            }, {}));
        }
        // 关注的话题的评论与帖子
        if (user.follow_topic.length > 0) {
            _query['$or'].push(Object.assign({}, query, {
                user_id: { '$nin': user.block_people },
                topic_id: { '$in': user.follow_topic },
                posts_id: { '$nin': user.block_posts },
                deleted: false
            }, {}));
        }
        query = _query;
    }
    options.populate = [
        { path: 'user_id', select: { '_id': 1, 'avatar': 1, 'nickname': 1, 'brief': 1 }, justOne: true },
        { path: 'comment_id', match: { weaken: false, deleted: false }, justOne: true },
        { path: 'posts_id', match: { weaken: false, deleted: false }, justOne: true }
    ];
    [err, list] = yield to_1.default(models_1.Feed.find({ query, select: {}, options }));
    if (!list || list.length == 0) {
        // 更新用户最后一次查询feed日期
        if (!query.user_id && user && limit != 1) {
            updateLastFindFeedDate(user._id);
        }
        return [];
    }
    options = [
        { path: 'comment_id.reply_id', model: 'Comment', match: { 'deleted': false }, justOne: true },
        { path: 'posts_id.user_id', model: 'User', justOne: true },
        { path: 'posts_id.topic_id', model: 'Topic', select: { '_id': 1, 'name': 1, 'avatar': 1 }, justOne: true }
    ];
    [err, list] = yield to_1.default(models_1.Feed.populate({ collections: list, options }));
    options = [
        {
            path: 'comment_id.reply_id.user_id',
            model: 'User',
            select: { '_id': 1, 'avatar': 1, 'nickname': 1, 'brief': 1 },
            match: { 'blocked': false }
        }
    ];
    [err, list] = yield to_1.default(models_1.Feed.populate({ collections: list, options }));
    if (err) {
        throw errors_1.default({ message: err });
    }
    // if (!list) return [];
    // 未登陆的用户，直接返回
    if (!user)
        return list;
    // 获取follow和like
    let postsIds = [], commentIds = [];
    list.map((item) => {
        if (item.posts_id && item.posts_id._id)
            postsIds.push(item.posts_id._id);
        if (item.comment_id && item.comment_id._id)
            commentIds.push(item.comment_id._id);
        // 如果reply的用户被blocked，那么则删除这条回复
        if (item.comment_id && item.comment_id.parent_id && item.comment_id.reply_id && !item.comment_id.reply_id.user_id) {
            item.comment_id.reply_id = null;
        }
    });
    return Promise.all([
        models_1.Follow.find({
            query: { user_id: user._id, posts_id: { "$in": postsIds }, deleted: false },
            select: { posts_id: 1 }
        }),
        models_1.Like.find({
            query: { user_id: user._id, type: 'posts', target_id: { "$in": postsIds }, deleted: false },
            select: { _id: 0, target_id: 1 }
        }),
        models_1.Like.find({
            query: { user_id: user._id, type: { "$in": ['reply', 'comment'] }, target_id: { "$in": commentIds }, deleted: false },
            select: { _id: 0, target_id: 1 }
        })
    ]).then((values) => __awaiter(void 0, void 0, void 0, function* () {
        let followPosts, likePosts, likeComment;
        [followPosts, likePosts, likeComment] = values;
        let ids = {};
        followPosts.map((item) => ids[item.posts_id] = 1);
        list.map((item) => {
            if (item.posts_id && item.posts_id._id && ids[item.posts_id._id]) {
                item.posts_id.follow = true;
            }
        });
        ids = {};
        likePosts.map((item) => ids[item.target_id] = 1);
        list.map((item) => {
            if (item.posts_id && item.posts_id._id && ids[item.posts_id._id]) {
                item.posts_id.like = true;
            }
        });
        ids = {};
        likeComment.map((item) => ids[item.target_id] = 1);
        list.map((item) => {
            if (item.comment_id && item.comment_id._id && ids[item.comment_id._id]) {
                item.comment_id.like = true;
            }
        });
        // 更新用户最后一次查询feed日期
        if (!query.user_id && user && limit != 1 && list && list.length > 0) {
            updateLastFindFeedDate(user._id);
        }
        return list;
    }));
});
const countFeed = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role } = context;
    let err, query, options, select = {}, count;
    [err, query] = tools_1.getQuery({ args, model: Model.feed, role });
    [err, options] = tools_1.getOption({ args, model: Model.feed, role });
    // 偏好模式（用户关注），如果用户未登陆，则拒绝请求
    if (args.preference && !user) {
        throw errors_1.default({ message: '请求被拒绝，用户未登陆' });
    }
    if (args.preference && user) {
        let _query = { '$or': [] };
        // 获取与自己相关的帖子和评论
        /*
        _query['$or'].push(Object.assign({}, query, {
          user_id: user._id,
          posts_id: { '$nin': user.block_posts },
          deleted: false
        }));
        */
        // 关注的用户的评论与帖子
        if (user.follow_people.length > 0) {
            _query['$or'].push(Object.assign({}, query, {
                user_id: { '$in': user.follow_people, '$nin': user.block_people },
                posts_id: { '$nin': user.block_posts },
                deleted: false
            }, {}));
        }
        // 关注的话题的评论与帖子
        if (user.follow_topic.length > 0) {
            _query['$or'].push(Object.assign({}, query, {
                user_id: { '$nin': user.block_people },
                topic_id: { '$in': user.follow_topic },
                posts_id: { '$nin': user.block_posts },
                deleted: false
            }, {}));
        }
        query = _query;
    }
    ;
    [err, count] = yield to_1.default(models_1.Feed.count({ query }));
    return {
        count
    };
});
// 更新用户最后一次查询feed的日期
const updateLastFindFeedDate = (userId) => {
    models_1.User.update({
        query: { _id: userId },
        update: { last_find_feed_at: new Date() }
    });
};
exports.query = { feed, countFeed };
exports.mutation = {};

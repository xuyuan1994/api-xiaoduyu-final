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
// import { getQuery, getOption, getUpdateQuery, getUpdateContent, getSaveFields } from '../../config';
// let [ query, mutation, resolvers ] = [{},{},{}];
const Model = __importStar(require("./arguments"));
const tools_1 = require("../tools");
const userNotifications = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    if (!context.user) {
        throw errors_1.default({ message: '请求被拒绝' });
    }
    // console.log(context.user);
    const { user, role } = context;
    const { method } = args;
    let select = {}, err, query, options, notificationList;
    // let { query, options } = Querys({ args, model:'user-notification', role })
    // [ err, query ] = getQuery({ args, model:'user-notification', role });
    // [ err, options ] = getOption({ args, model:'user-notification', role });
    [err, query] = tools_1.getQuery({ args, model: Model.userNotifications, role });
    [err, options] = tools_1.getOption({ args, model: Model.userNotifications, role });
    // select
    schema.fieldNodes[0].selectionSet.selections.map((item) => select[item.name.value] = 1);
    //===
    // 请求用户的角色
    let admin = role == 'admin' ? true : false;
    if (!admin) {
        query.addressee_id = context.user._id;
    }
    if (user.block_people_count > 0 && !admin) {
        query.sender_id = { '$nin': user.block_people };
    }
    options.populate = [];
    if (Reflect.has(select, 'addressee_id')) {
        options.populate.push({
            path: 'addressee_id',
            select: { _id: 1, nickname: 1, avatar: 1, create_at: 1 }
        });
    }
    if (Reflect.has(select, 'sender_id')) {
        options.populate.push({
            path: 'sender_id',
            select: { _id: 1, nickname: 1, avatar: 1, create_at: 1 }
        });
    }
    if (Reflect.has(select, 'posts_id')) {
        options.populate.push({
            path: 'posts_id',
            match: admin ? {} : { 'deleted': false },
            select: { _id: 1, title: 1, content_html: 1, type: 1 }
        });
    }
    if (Reflect.has(select, 'comment_id')) {
        options.populate.push({
            path: 'comment_id',
            match: admin ? {} : { 'deleted': false },
            select: { _id: 1, content_html: 1, posts_id: 1, reply_id: 1, parent_id: 1 }
        });
    }
    ;
    // console.log(query);
    // console.log(select);
    [err, notificationList] = yield to_1.default(models_1.UserNotification.find({ query, select, options }));
    // console.log(notificationList);
    options = [];
    if (Reflect.has(select, 'comment_id')) {
        options = [
            {
                path: 'comment_id.posts_id',
                model: 'Posts',
                match: admin ? {} : { 'deleted': false },
                select: { '_id': 1, 'title': 1, type: 1 }
            },
            {
                path: 'comment_id.parent_id',
                model: 'Comment',
                match: admin ? {} : { 'deleted': false },
                select: { '_id': 1, 'content_html': 1 }
            },
            {
                path: 'comment_id.reply_id',
                model: 'Comment',
                match: admin ? {} : { 'deleted': false },
                select: { '_id': 1, 'content_html': 1 }
            }
        ];
    }
    [err, notificationList] = yield to_1.default(models_1.UserNotification.populate({ collections: notificationList, options }));
    // 删除一些，通知
    let _notices = JSON.stringify(notificationList);
    _notices = JSON.parse(_notices);
    let new_notices = [];
    if (_notices && _notices.map) {
        _notices.map(function (item, key) {
            if (typeof item.comment_id != 'undefined' && item.comment_id == null ||
                typeof item.posts_id != 'undefined' && item.posts_id == null ||
                item.comment_id && typeof item.comment_id.posts_id != 'undefined' && item.comment_id.posts_id == null ||
                item.comment_id && typeof item.comment_id.parent_id != 'undefined' && item.comment_id.parent_id == null ||
                item.comment_id && typeof item.comment_id.reply_id != 'undefined' && item.comment_id.reply_id == null) {
                // delete _notices[key];
                // item.type = 'delete'
            }
            else {
                new_notices.push(item);
            }
        });
    }
    _notices = new_notices;
    if (notificationList && notificationList.length && role != 'admin') {
        // 未读的通知设置成已读
        for (var i = 0, max = notificationList.length; i < max; i++) {
            if (notificationList[i].has_read == false) {
                // notificationList[i].has_read = true;
                // notificationList[i].save();
                models_1.UserNotification.update({
                    query: { _id: notificationList[i]._id },
                    update: { has_read: true }
                });
            }
        }
    }
    /*
    _notices.map(function(item, key){
  
      if (item.comment_id) {
        var text = item.comment_id.content_html
        text = text.replace(/<[^>]+>/g,"");
        if (text.length > 100) text = text.substring(0,100) + '...'
        _notices[key].comment_id.content_trim = text
      }
  
      if (item.comment_id && item.comment_id.parent_id) {
        var text = item.comment_id.parent_id.content_html
        text = text.replace(/<[^>]+>/g,"");
        if (text.length > 100) text = text.substring(0,100) + '...'
        _notices[key].comment_id.parent_id.content_trim = text
      }
  
      if (item.comment_id && item.comment_id.reply_id) {
        var text = item.comment_id.reply_id.content_html
        text = text.replace(/<[^>]+>/g,"");
        if (text.length > 100) text = text.substring(0,100) + '...'
        _notices[key].comment_id.reply_id.content_trim = text
      }
  
      if (item.comment_id && item.comment_id.answer_id) {
        var text = item.comment_id.answer_id.content_html
        text = text.replace(/<[^>]+>/g,"");
        if (text.length > 100) text = text.substring(0,100) + '...'
        _notices[key].comment_id.answer_id.content_html = text
      }
    })
    */
    // let [ err, userList ] = await To(User.find({ query, select, options }))
    return _notices;
});
const countUserNotifications = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    if (!context.user) {
        throw errors_1.default({ message: '请求被拒绝' });
    }
    const { user, role } = context;
    let err, query, count;
    [err, query] = tools_1.getQuery({ args, model: Model.userNotifications, role });
    //===
    // 请求用户的角色
    let admin = role == 'admin' ? true : false;
    if (user.block_people_count > 0 && !admin) {
        query.sender_id = { '$nin': user.block_people };
    }
    ;
    [err, count] = yield to_1.default(models_1.UserNotification.count({ query }));
    return { count };
});
// 获取未读消息的[id]
const fetchUnreadUserNotification = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role } = context;
    if (!user)
        throw errors_1.default({ message: '请求被拒绝' });
    // 拉取通知
    let query = { addressee_id: user._id, deleted: false };
    if (user.find_notification_at)
        query.create_at = { '$gt': user.find_notification_at };
    let [err, res] = yield to_1.default(models_1.Notification.find({
        query,
        options: {
            sort: { 'create_at': -1 }
        }
    }));
    if (err) {
        throw errors_1.default({
            message: '查询失败',
            data: { errorInfo: err.message }
        });
    }
    // 如果有未读通知（广播），生成用户通知
    if (res && res.length > 0) {
        // 更新用户最近一次拉取通知的时间
        [err] = yield to_1.default(models_1.User.update({
            query: { _id: user._id },
            update: { find_notification_at: res[0].create_at }
        }));
        if (err) {
            throw errors_1.default({
                message: '更新失败',
                data: { errorInfo: err.message }
            });
        }
        // 添加用户通知
        let notificationArr = [];
        res.map((item) => {
            if (item.type == 'new-comment') {
                notificationArr.push({
                    sender_id: item.sender_id,
                    comment_id: item.target,
                    addressee_id: user._id,
                    create_at: item.create_at,
                    type: item.type
                });
            }
        });
        [err] = yield to_1.default(models_1.UserNotification.save({
            data: notificationArr
        }));
        if (err) {
            throw errors_1.default({
                message: '储存失败',
                data: { errorInfo: err.message }
            });
        }
    }
    query = {
        addressee_id: user._id, has_read: false, deleted: false
    };
    // 增加屏蔽条件
    if (user) {
        if (user.block_people_count > 0)
            query.sender_id = { '$nin': user.block_people };
    }
    [err, res] = yield to_1.default(models_1.UserNotification.find({ query, select: { _id: 1 } }));
    if (err) {
        throw errors_1.default({
            message: '查询失败',
            data: { errorInfo: err.message }
        });
    }
    let ids = [];
    if (res && res.length > 0)
        res.map((item) => ids.push(item._id));
    return { ids };
});
const updateUserNotifaction = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role } = context;
    const { method } = args;
    let options = {}, err, result, query, update;
    // let { error, query, update } = Updates({ args, model: 'user-notification', role });
    [err, query] = tools_1.getQuery({ args, model: Model.updateUserNotifaction, role });
    [err, update] = tools_1.getSave({ args, model: Model.updateUserNotifaction, role });
    // [ err, query ] = getUpdateQuery({ args, model: 'user-notification', role });
    // [ err, update ] = getUpdateContent({ args, model: 'user-notification', role });
    if (err) {
        throw errors_1.default({
            message: err,
            data: {}
        });
    }
    //===
    [err, result] = yield to_1.default(models_1.UserNotification.update({ query, update, options }));
    if (err) {
        throw errors_1.default({
            message: '更新失败',
            data: { errorInfo: err.message }
        });
    }
    return { success: true };
});
exports.query = { userNotifications, countUserNotifications, fetchUnreadUserNotification };
exports.mutation = { updateUserNotifaction };
// export { query, mutation, resolvers }
/*

// 删除数据中重复的通知
UserNotification.find({ query: {},  }).then(res=>{

  let exist = [];
  let noExsit = [];
  res.map(item=>{
    if (exist.indexOf(`${item.type}-${item.sender_id}-${item.addressee_id}-${item.posts_id || ''}-${item.comment_id || ''}`) != -1) {
      noExsit.push(item._id);
    } else {
      exist.push(`${item.type}-${item.sender_id}-${item.addressee_id}-${item.posts_id || ''}-${item.comment_id || ''}`)
    }
  });

  console.log(noExsit);

  if (noExsit.length > 0) {

    UserNotification.remove({
      query: { _id: { $in: noExsit } }
    }).then(res=>{
      console.log('删除完成');
    })

  }

});
*/

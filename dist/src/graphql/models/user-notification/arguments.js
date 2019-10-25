"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ParseParams = __importStar(require("../../common/parse-params"));
// 查询
exports.userNotifications = {
    _id: (data) => ({
        typename: 'query',
        name: '_id',
        value: ParseParams.id(data),
        type: 'ID',
        desc: 'ID'
    }),
    sender_id: (data) => ({
        typename: 'query',
        name: 'sender_id',
        value: ParseParams.id(data),
        type: 'ID',
        desc: '发送人用户ID'
    }),
    addressee_id: (data) => ({
        typename: 'query',
        name: 'addressee_id',
        value: ParseParams.id(data),
        type: 'ID',
        desc: '收件人用户ID'
    }),
    posts_id: (data) => ({
        typename: 'query',
        name: 'posts_id',
        value: ParseParams.id(data),
        type: 'ID',
        desc: '帖子ID'
    }),
    comment_id: (data) => ({
        typename: 'query',
        name: 'comment_id',
        value: ParseParams.id(data),
        type: 'ID',
        desc: '评论ID'
    }),
    deleted: (data) => ({
        typename: 'query',
        name: 'deleted',
        value: data, role: 'admin',
        type: 'Boolean',
        desc: '删除'
    }),
    type: (data) => ({
        typename: 'query',
        name: 'type',
        value: { '$in': (data + '').split(',') },
        type: 'String',
        desc: '类型'
    }),
    has_read: (data) => ({
        typename: 'query',
        name: 'has_read',
        value: data,
        type: 'Boolean',
        desc: '是否已读'
    }),
    end_create_at: (data) => ({
        typename: 'query',
        name: 'create_at',
        value: { '$lte': data },
        type: 'String',
        desc: '结束日期'
    }),
    start_create_at: (data) => ({
        typename: 'query',
        name: 'create_at',
        value: { '$gte': data },
        type: 'String',
        desc: '开始日期'
    }),
    page_number: (data) => ({
        typename: 'option',
        name: 'skip',
        value: data - 1 >= 0 ? data - 1 : 0,
        type: 'Int',
        desc: '第几页'
    }),
    page_size: (data) => ({
        typename: 'option',
        name: 'limit',
        value: data,
        type: 'Int',
        desc: '每页数量'
    }),
    sort_by: (data) => ({
        typename: 'option',
        name: 'sort',
        value: ParseParams.sortBy(data),
        type: 'String',
        desc: '排序方式: create_at:1,comment_count:-1,like_count:1'
    })
};
// 更新
exports.updateUserNotifaction = {
    _id: (data) => ({
        typename: 'query',
        name: '_id',
        value: data,
        type: 'ID!',
        desc: 'ID'
    }),
    deleted: (data) => ({
        typename: 'save',
        name: 'deleted',
        value: data, role: 'admin',
        type: 'Boolean',
        desc: '删除'
    })
};

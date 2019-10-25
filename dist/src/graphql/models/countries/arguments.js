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
exports.comments = {
    _id: (data) => ({
        typename: 'query',
        name: '_id',
        value: ParseParams.id(data),
        type: 'ID',
        desc: 'id、ids、exists、not-exists'
    }),
    weaken: (data) => ({
        typename: 'query',
        name: 'weaken',
        value: data,
        type: 'Boolean',
        desc: '削弱'
    }),
    deleted: (data) => ({
        typename: 'query',
        name: 'deleted',
        value: data,
        type: 'Boolean',
        desc: '删除'
    }),
    recommend: (data) => ({
        typename: 'query',
        name: 'recommend',
        value: data,
        type: 'Boolean',
        desc: '推荐'
    }),
    end_create_at: (data) => ({
        typename: 'query',
        name: 'create_at',
        value: { '$lt': data },
        type: 'String',
        desc: '结束日期'
    }),
    start_create_at: (data) => ({
        typename: 'query',
        name: 'create_at',
        value: { '$gt': data },
        type: 'String',
        desc: '开始日期'
    }),
    user_id: (data) => ({
        typename: 'query',
        name: 'user_id',
        value: ParseParams.id(data),
        type: 'ID',
        desc: '用户ID，id、ids、exists、not-exists'
    }),
    posts_id: (data) => ({
        typename: 'query',
        name: 'posts_id',
        value: ParseParams.id(data),
        type: 'ID',
        desc: '帖子ID，id、ids、exists、not-exists'
    }),
    parent_id: (data) => ({
        typename: 'query',
        name: 'parent_id',
        value: ParseParams.id(data),
        type: 'ID',
        desc: '父评论id，id、ids、exists、not-exists'
    }),
    method: (data) => ({
        typename: 'query',
        name: '',
        value: '',
        type: 'String',
        desc: '模式(user_follow)'
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
        desc: '排序方式例如: create_at:1,update_at:-1，排序字段: create_at、update_at、last_reply_at、reply_count、like_count'
    })
};
// 储存
exports.addComment = {
    posts_id: (data) => ({
        typename: 'save',
        name: 'posts_id',
        value: data,
        type: 'ID',
        desc: 'posts_id'
    }),
    reply_id: (data) => ({
        typename: 'save',
        name: 'reply_id',
        value: data,
        type: 'ID',
        desc: 'reply_id'
    }),
    parent_id: (data) => ({
        typename: 'save',
        name: 'parent_id',
        value: data,
        type: 'ID',
        desc: 'parent_id'
    }),
    content: (data) => ({
        typename: 'save',
        name: 'content',
        value: data,
        type: 'String',
        desc: '内容'
    }),
    content_html: (data) => ({
        typename: 'save',
        name: 'content_html',
        value: data,
        type: 'String',
        desc: '内容HTML'
    }),
    device: (data) => ({
        typename: 'save',
        name: 'device',
        value: data,
        type: 'String',
        desc: '设备id'
    })
};
// 更新
exports.updateComment = {
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
        value: data,
        role: 'admin',
        type: 'Boolean',
        desc: '删除'
    }),
    weaken: (data) => ({
        typename: 'save',
        name: 'weaken',
        value: data,
        role: 'admin',
        type: 'Boolean',
        desc: '削弱'
    }),
    recommend: (data) => ({
        typename: 'save',
        name: 'recommend',
        value: data,
        role: 'admin',
        type: 'Boolean',
        desc: '推荐'
    }),
    content: (data) => ({
        typename: 'save',
        name: 'content',
        value: data,
        type: 'String',
        desc: '评论DraftJS JSON'
    }),
    content_html: (data) => ({
        typename: 'save',
        name: 'content_html',
        value: data,
        type: 'String',
        desc: '评论HTML'
    })
};

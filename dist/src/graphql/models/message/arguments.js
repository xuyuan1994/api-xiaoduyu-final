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
exports.messages = {
    _id: (data) => ({
        typename: 'query',
        name: '_id',
        value: ParseParams.id(data),
        type: 'ID',
        desc: 'id、ids、exists、not-exists'
    }),
    user_id: (data) => ({
        typename: 'query',
        name: 'user_id',
        value: ParseParams.id(data),
        type: 'ID',
        desc: 'id、ids、exists、not-exists'
    }),
    addressee_id: (data) => ({
        typename: 'query',
        name: 'addressee_id',
        value: ParseParams.id(data),
        type: 'ID',
        desc: 'id、ids、exists、not-exists'
    }),
    has_read: (data) => ({
        typename: 'query',
        name: 'has_read',
        value: data,
        type: 'Boolean',
        desc: '是否读'
    }),
    type: (data) => ({
        typename: 'query',
        name: 'type',
        value: data,
        type: 'Int',
        desc: '删除'
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
exports.addMessage = {
    addressee_id: (data) => ({
        typename: 'save',
        name: 'addressee_id',
        value: data,
        type: 'ID',
        desc: '收件人用户ID'
    }),
    type: (data) => ({
        typename: 'save',
        name: 'type',
        value: data,
        type: 'Int',
        desc: '消息类型'
    }),
    content: (data) => ({
        typename: 'save',
        name: 'content',
        value: data,
        type: 'String',
        desc: '内容文本原始格式'
    }),
    content_html: (data) => ({
        typename: 'save',
        name: 'content_html',
        value: data,
        type: 'String',
        desc: '内容展示格式'
    }),
    device: (data) => ({
        typename: 'save',
        name: 'device',
        value: data,
        type: 'Int',
        desc: '设备id'
    })
};

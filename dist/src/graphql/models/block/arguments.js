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
exports.blocks = {
    people_id: (data) => ({
        typename: 'query',
        name: 'people_id',
        value: ParseParams.id(data),
        type: 'ID',
        desc: 'id、ids、exists、not-exists'
    }),
    posts_id: (data) => ({
        typename: 'query',
        name: 'posts_id',
        value: ParseParams.id(data),
        type: 'ID',
        desc: 'id、ids、exists、not-exists'
    }),
    comment_id: (data) => ({
        typename: 'query',
        name: 'comment_id',
        value: ParseParams.id(data),
        type: 'ID',
        desc: 'id、ids、exists、not-exists'
    }),
    page_number: (data) => ({
        typename: 'options',
        name: 'skip',
        value: data - 1 >= 0 ? data - 1 : 0,
        type: 'Int',
        desc: '第几页，从1开始'
    }),
    page_size: (data) => ({
        typename: 'options',
        name: 'limit',
        value: data,
        type: 'Int',
        desc: '每页数量'
    }),
    sort_by: (data) => ({
        typename: 'options',
        name: 'sort',
        value: ParseParams.sortBy(data),
        type: 'String',
        desc: '排序方式，例如：create_at:1'
    })
};
// 储存
exports.addBlock = {
    posts_id: (data) => ({
        typename: 'save',
        name: 'posts_id',
        value: data,
        type: 'ID',
        desc: '帖子ID'
    }),
    comment_id: (data) => ({
        typename: 'save',
        name: 'comment_id',
        value: data,
        type: 'ID',
        desc: '评论ID'
    }),
    people_id: (data) => ({
        typename: 'save',
        name: 'people_id',
        value: data,
        type: 'ID',
        desc: '用户ID'
    })
};
// 更新
exports.removeBlock = {
    posts_id: (data) => ({
        typename: 'query',
        name: 'posts_id',
        value: data,
        type: 'ID',
        desc: '帖子ID'
    }),
    comment_id: (data) => ({
        typename: 'query',
        name: 'comment_id',
        value: data,
        type: 'ID',
        desc: '评论ID'
    }),
    people_id: (data) => ({
        typename: 'query',
        name: 'people_id',
        value: data,
        type: 'ID',
        desc: '用户ID'
    })
};

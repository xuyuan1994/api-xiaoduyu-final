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
exports.reports = {
    user_id: (data) => ({
        typename: 'query',
        name: 'user_id',
        value: ParseParams.id(data),
        type: 'ID',
        desc: '用户ID'
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
    people_id: (data) => ({
        typename: 'query',
        name: 'people_id',
        value: ParseParams.id(data),
        type: 'ID',
        desc: '用户ID'
    }),
    // 因为int类型长度大于11位，graphql 会认为格式不是int
    start_create_at: (data) => ({
        typename: 'query',
        name: 'create_at',
        value: { '$gte': data },
        type: 'String',
        desc: '开始日期'
    }),
    end_create_at: (data) => ({
        typename: 'query',
        name: 'create_at',
        value: { '$lte': data },
        type: 'String',
        desc: '结束日期'
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
exports.addReport = {
    posts_id: (data) => ({
        typename: 'save',
        name: 'posts_id',
        value: ParseParams.id(data),
        type: 'ID',
        desc: '帖子id'
    }),
    people_id: (data) => ({
        typename: 'save',
        name: 'people_id',
        value: ParseParams.id(data),
        type: 'ID',
        desc: '用户id'
    }),
    comment_id: (data) => ({
        typename: 'save',
        name: 'comment_id',
        value: ParseParams.id(data),
        type: 'ID',
        desc: '评论id'
    }),
    report_id: (data) => ({
        typename: 'save',
        name: 'report_id',
        value: ParseParams.id(data),
        type: 'ID',
        desc: '评论id'
    }),
    detail: (data) => ({
        typename: 'save',
        name: 'detail',
        value: data,
        type: 'String',
        desc: '详情'
    })
};

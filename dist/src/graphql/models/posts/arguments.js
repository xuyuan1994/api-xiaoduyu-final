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
exports.posts = {
    _id: (data) => ({
        typename: 'query',
        name: '_id',
        value: ParseParams.id(data),
        type: 'ID',
        desc: 'ID'
    }),
    user_id: (data) => ({
        typename: 'query',
        name: 'user_id',
        value: ParseParams.id(data),
        type: 'ID',
        desc: '用户ID'
    }),
    topic_id: (data) => ({
        typename: 'query',
        name: 'topic_id',
        value: ParseParams.id(data),
        type: 'ID',
        desc: '话题ID'
    }),
    title: (data) => ({
        typename: 'query',
        name: 'title',
        value: ParseParams.search(data),
        type: 'String',
        desc: '标题'
    }),
    deleted: (data) => ({
        typename: 'query',
        name: 'deleted',
        value: data,
        type: 'Boolean',
        desc: '删除'
    }),
    weaken: (data) => ({
        typename: 'query',
        name: 'weaken',
        value: data,
        type: 'Boolean',
        desc: '削弱'
    }),
    recommend: (data) => ({
        typename: 'query',
        name: 'recommend',
        value: data,
        type: 'Boolean',
        desc: '推荐'
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
        desc: '排序方式: create_at:1,comment_count:-1,like_count:1'
    })
};
// 储存
exports.addPosts = {
    title: (data) => ({
        typename: 'save',
        name: 'title',
        value: data,
        type: 'String!',
        desc: '标题'
    }),
    content: (data) => ({
        typename: 'save',
        name: 'content',
        value: data,
        type: 'String!',
        desc: '正文JSON'
    }),
    content_html: (data) => ({
        typename: 'save',
        name: 'content_html',
        value: data,
        type: 'String!',
        desc: '文本HTML'
    }),
    topic_id: (data) => ({
        typename: 'save',
        name: 'topic_id',
        value: data,
        type: 'ID!',
        desc: '话题'
    }),
    device_id: (data) => ({
        typename: 'save',
        name: 'device_id',
        value: data,
        type: 'Int',
        desc: '设备'
    }),
    type: (data) => ({
        typename: 'save',
        name: 'type',
        value: data,
        type: 'Int',
        desc: '类型'
    })
};
// 更新
exports.updatePosts = {
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
    topic_id: (data) => ({
        typename: 'save',
        name: 'topic_id',
        value: data,
        type: 'ID',
        desc: '话题ID'
    }),
    type: (data) => ({
        typename: 'save',
        name: 'type',
        value: data,
        type: 'Int',
        desc: '类型'
    }),
    title: (data) => ({
        typename: 'save',
        name: 'title',
        value: data,
        type: 'String',
        desc: '标题'
    }),
    content: (data) => ({
        typename: 'save',
        name: 'content',
        value: data,
        type: 'String',
        desc: '正文JSON Draft'
    }),
    content_html: (data) => ({
        typename: 'save',
        name: 'content_html',
        value: data,
        type: 'String',
        desc: '正文HTML'
    }),
    verify: (data) => ({
        typename: 'save',
        name: 'verify',
        value: data,
        role: 'admin',
        type: 'Boolean',
        desc: '验证'
    }),
    recommend: (data) => ({
        typename: 'save',
        name: 'recommend',
        value: data,
        role: 'admin',
        type: 'Boolean',
        desc: '推荐'
    }),
    sort_by_date: (data) => ({
        typename: 'save',
        name: 'sort_by_date',
        value: data,
        role: 'admin',
        type: 'String',
        desc: '根据时间排序（越大越排前）'
    })
};

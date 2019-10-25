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
exports.users = {
    _id: (data) => ({
        typename: 'query',
        name: '_id',
        value: ParseParams.id(data),
        type: 'ID',
        desc: 'ID'
    }),
    nickname: (data) => ({
        typename: 'query',
        name: 'nickname',
        value: ParseParams.search(data),
        type: 'String',
        desc: '昵称'
    }),
    blocked: (data) => ({
        typename: 'query',
        name: 'deleted',
        value: data,
        role: 'admin',
        type: 'Boolean',
        desc: '屏蔽'
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
    banned_to_post: (data) => ({
        typename: 'query',
        name: 'banned_to_post',
        value: { '$gte': new Date() },
        role: 'admin',
        type: 'String',
        desc: '禁言的用户'
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
exports.addUser = {
    email: (data) => ({
        typename: 'save',
        name: 'email',
        value: data,
        type: 'String',
        desc: '邮箱'
    }),
    phone: (data) => ({
        typename: 'save',
        name: 'phone',
        value: data,
        type: 'String',
        desc: '手机'
    }),
    area_code: (data) => ({
        typename: 'save',
        name: 'area_code',
        value: data,
        type: 'String',
        desc: '手机区号'
    }),
    nickname: (data) => ({
        typename: 'save',
        name: 'nickname',
        value: data,
        type: 'String!',
        desc: '昵称'
    }),
    password: (data) => ({
        typename: 'save',
        name: 'password',
        value: data,
        type: 'String!',
        desc: '密码'
    }),
    captcha: (data) => ({
        typename: 'save',
        name: 'captcha',
        value: data,
        type: 'String!',
        desc: '验证码'
    }),
    source: (data) => ({
        typename: 'save',
        name: 'source',
        value: data,
        type: 'Int',
        desc: '来源id'
    }),
    gender: (data) => ({
        typename: 'save',
        name: 'gender',
        value: data,
        type: 'Int',
        desc: '性别 0女 / 1男'
    })
};
exports.updateUser = {
    _id: (data) => ({
        typename: 'query',
        name: '_id',
        value: data,
        type: 'ID!',
        desc: 'ID'
    }),
    blocked: (data) => ({
        typename: 'save',
        name: 'blocked',
        value: data,
        role: 'admin',
        type: 'Boolean',
        desc: '屏蔽用户'
    }),
    banned_to_post: (data) => ({
        typename: 'save',
        name: 'banned_to_post',
        value: data,
        role: 'admin',
        type: 'String',
        desc: '禁言时间'
    }),
    avatar: (data) => ({
        typename: 'save',
        name: 'avatar',
        value: data,
        type: 'String',
        desc: '头像'
    }),
    brief: (data) => ({
        typename: 'save',
        name: 'brief',
        value: data,
        type: 'String',
        desc: '一句话自我介绍'
    }),
    gender: (data) => ({
        typename: 'save',
        name: 'gender',
        value: data,
        type: 'Int',
        desc: '性别'
    }),
    nickname: (data) => ({
        typename: 'save',
        name: 'nickname',
        value: data,
        type: 'String',
        desc: '昵称'
    }),
    theme: (data) => ({
        typename: 'save',
        name: 'theme',
        value: data,
        type: 'Int',
        desc: '主题（0自动，1亮色，2暗色）'
    }),
};

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
exports.topics = {
    _id: (data) => ({
        typename: 'query',
        name: '_id',
        value: ParseParams.id(data),
        type: 'ID',
        desc: 'ID'
    }),
    parent_id: (data) => ({
        typename: 'query',
        name: 'parent_id',
        value: ParseParams.id(data),
        type: 'String',
        desc: '父评论id / exists / not-exists'
    }),
    deleted: (data) => ({
        typename: 'query',
        name: 'deleted',
        value: data, role: 'admin',
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
    type: (data) => ({
        typename: 'query',
        name: 'parent_id',
        value: { '$exists': data == 'parent' ? false : true },
        type: 'String',
        desc: '参数 parent，只查询父类'
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
exports.addTopic = {
    name: (data) => ({
        typename: 'save',
        name: 'name', value: data, role: 'admin',
        type: 'String!', desc: '名称'
    }),
    brief: (data) => ({
        typename: 'save',
        name: 'brief', value: data, role: 'admin',
        type: 'String!', desc: '简介'
    }),
    description: (data) => ({
        typename: 'save',
        name: 'description', value: data, role: 'admin',
        type: 'String!', desc: '描述'
    }),
    avatar: (data) => ({
        typename: 'save',
        name: 'avatar', value: data, role: 'admin',
        type: 'String!', desc: '头像url地址'
    }),
    background: (data) => ({
        typename: 'save',
        name: 'background', value: data, role: 'admin',
        type: 'String', desc: '背景图片'
    }),
    sort: (data) => ({
        typename: 'save',
        name: 'sort', value: data, role: 'admin',
        type: 'Int', desc: '排序'
    }),
    recommend: (data) => ({
        typename: 'save',
        name: 'recommend', value: data, role: 'admin',
        type: 'Boolean', desc: '推荐'
    }),
    parent_id: (data) => ({
        typename: 'save',
        name: 'parent_id', value: data, role: 'admin',
        type: 'ID', desc: '父类ID'
    })
};
// 更新
exports.updateTopic = {
    _id: (data) => ({
        typename: 'query',
        name: '_id', value: data, role: 'admin',
        type: 'String!', desc: 'ID'
    }),
    name: (data) => ({
        typename: 'save',
        name: 'name', value: data, role: 'admin',
        type: 'String', desc: '名称'
    }),
    brief: (data) => ({
        typename: 'save',
        name: 'brief', value: data, role: 'admin',
        type: 'String', desc: '简介'
    }),
    description: (data) => ({
        typename: 'save',
        name: 'description', value: data, role: 'admin',
        type: 'String', desc: '描述'
    }),
    avatar: (data) => ({
        typename: 'save',
        name: 'avatar', value: data, role: 'admin',
        type: 'String', desc: '头像url地址'
    }),
    background: (data) => ({
        typename: 'save',
        name: 'background', value: data, role: 'admin',
        type: 'String', desc: '背景图片'
    }),
    sort: (data) => ({
        typename: 'save',
        name: 'sort', value: data, role: 'admin',
        type: 'Int', desc: '排序'
    }),
    recommend: (data) => ({
        typename: 'save',
        name: 'recommend', value: data, role: 'admin',
        type: 'Boolean', desc: '推荐'
    }),
    parent_id: (data) => ({
        typename: 'save',
        name: 'parent_id', value: data, role: 'admin',
        type: 'ID', desc: '父类ID'
    })
};

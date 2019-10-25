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
exports.sessions = {
    _id: (data) => ({
        typename: 'query',
        name: '_id',
        value: ParseParams.id(data),
        type: 'ID',
        desc: 'id、ids、exists、not-exists'
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
exports.getSession = {
    people_id: (data) => ({
        typename: 'save',
        name: 'addressee_id',
        value: data,
        type: 'ID',
        desc: 'id'
    })
};
exports.readSession = {
    _id: (data) => ({
        typename: 'query',
        name: '_id',
        value: data,
        type: 'ID',
        desc: 'id'
    })
};

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
// 储存
exports.like = {
    type: (data) => ({
        typename: 'save',
        name: 'type',
        value: data,
        type: 'String',
        desc: '类型posts/comment/reply'
    }),
    target_id: (data) => ({
        typename: 'save',
        name: 'target_id',
        value: ParseParams.id(data),
        type: 'String',
        desc: '目标类型的id'
    }),
    mood: (data) => ({
        typename: 'save',
        name: 'mood',
        value: data,
        type: 'Int',
        desc: '心情：1是赞/2是踩'
    }),
    status: (data) => ({
        typename: 'save',
        name: 'status',
        value: data,
        type: 'Boolean',
        desc: '状态'
    })
};

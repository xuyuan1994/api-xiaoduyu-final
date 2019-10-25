"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 查询
exports.getCaptcha = {
    id: (data) => ({
        typename: 'query',
        name: '_id',
        value: data,
        type: 'ID',
        desc: 'ID'
    }),
    phone: (data) => ({
        typename: 'query',
        name: 'phone',
        value: data,
        type: 'String',
        desc: 'ID'
    }),
    email: (data) => ({
        typename: 'query',
        name: 'email',
        value: data,
        type: 'String',
        desc: 'ID'
    })
};
// 储存
exports.addCaptcha = {
    email: (data) => ({
        typename: 'save',
        name: 'email',
        value: data,
        type: 'String',
        desc: '邮箱[email]'
    }),
    phone: (data) => ({
        typename: 'save',
        name: 'phone',
        value: data,
        type: 'String',
        desc: '手机[phone]'
    }),
    area_code: (data) => ({
        typename: 'save',
        name: 'area_code',
        value: data,
        type: 'String',
        desc: '手机国家代码[phone]'
    }),
    type: (data) => ({
        typename: 'save',
        name: 'type',
        value: data,
        type: 'String!',
        desc: '类型 - sign-in、binding-email、reset-email、sign-up、forgot、binding-phone、reset-phone、unlock-token'
    })
};

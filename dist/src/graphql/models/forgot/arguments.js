"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgot = {
    phone: (data) => ({
        typename: 'query',
        name: 'phone',
        value: data,
        type: 'String',
        desc: '手机号'
    }),
    email: (data) => ({
        typename: 'query',
        name: 'email',
        value: data,
        type: 'String',
        desc: '邮箱'
    }),
    captcha: (data) => ({
        typename: 'query',
        name: 'captcha',
        value: data,
        type: 'String!',
        desc: '验证码'
    }),
    new_password: (data) => ({
        typename: 'save',
        name: 'new_password',
        value: data,
        type: 'String!',
        desc: '新密码'
    })
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 查询
exports.signIn = {
    email: (data) => ({
        typename: 'query',
        name: 'email',
        value: data,
        type: 'String',
        desc: '邮箱'
    }),
    phone: (data) => ({
        typename: 'query',
        name: 'phone',
        value: data,
        type: 'String',
        desc: '电话'
    }),
    password: (data) => ({
        typename: 'query',
        name: 'password',
        value: data,
        type: 'String!',
        desc: '密码'
    }),
    captcha: (data) => ({
        typename: 'query',
        name: 'captcha',
        value: data,
        type: 'String',
        desc: '验证码'
    }),
    captcha_id: (data) => ({
        typename: 'query',
        name: 'captcha_id',
        value: data,
        type: 'String',
        desc: '验证码id'
    })
};
// 储存
exports.addEmail = {
    email: (data) => ({
        typename: 'save',
        name: 'email',
        value: data,
        type: 'String!',
        desc: '邮箱地址'
    }),
    captcha: (data) => ({
        typename: 'save',
        name: 'captcha',
        value: data,
        type: 'String!',
        desc: '验证码'
    }),
    unlock_token: (data) => ({
        typename: 'save',
        name: 'unlock_token',
        value: data,
        type: 'String',
        desc: '解锁令牌（getUnlockToken），解锁身份后获得，用于修改已绑定的邮箱地址'
    })
};

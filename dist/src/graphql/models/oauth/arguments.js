"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QQOAuth = {
    // binding: (data: string) => ({
    //   value: data,
    //   type: 'Boolean',
    //   desc:'绑定QQ'
    // }),
    openid: (data) => ({
        typename: 'save',
        name: 'openid',
        value: data,
        type: 'String',
        desc: 'openid'
    }),
    access_token: (data) => ({
        typename: 'save',
        name: 'access_token',
        value: data,
        type: 'String',
        desc: '授权的token access_token'
    }),
    expires_in: (data) => ({
        typename: 'save',
        name: 'expires_in',
        value: parseInt(data),
        type: 'String',
        desc: 'expires_in'
    }),
    refresh_token: (data) => ({
        typename: 'save',
        name: 'refresh_token',
        value: data,
        type: 'String',
        desc: 'refresh_token'
    }),
    oauth_consumer_key: (data) => ({
        // typename: 'save',
        // name: 'refresh_token',
        value: data,
        type: 'String',
        desc: 'oauth_consumer_key'
    }),
};

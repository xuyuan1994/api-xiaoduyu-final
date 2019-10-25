"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tools_1 = require("../tools");
const arguments_1 = require("./arguments");
exports.Schema = `

# 取消绑定
type oAuthUnbinding {
  success: Boolean
}

# 登陆&注册、绑定（绑定账号需要在headers中附带access_token）
type QQOAuth {
  success: Boolean
  access_token: String
  expires: Int
}

`;
exports.Query = `

`;
exports.Mutation = `

oAuthUnbinding(name:String!): oAuthUnbinding

QQOAuth(${tools_1.getArguments(arguments_1.QQOAuth)}): QQOAuth

`;

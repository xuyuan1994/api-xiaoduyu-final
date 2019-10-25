"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const arguments_1 = require("./arguments");
const tools_1 = require("../tools");
exports.Schema = `
  # 绑定手机号
  type addPhone {
    success: Boolean
  }
`;
exports.Query = ``;
exports.Mutation = `

  # 绑定手机号
  addPhone(${tools_1.getArguments(arguments_1.addPhone)}): addPhone

`;

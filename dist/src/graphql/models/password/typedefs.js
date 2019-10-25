"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const arguments_1 = require("./arguments");
const tools_1 = require("../tools");
exports.Schema = `
  # 修改密码
  type updatePassword {
    # 结果
    success: Boolean
  }
`;
exports.Query = `
`;
exports.Mutation = `
  # 修改密码
  updatePassword(${tools_1.getArguments(arguments_1.updatePassword)}): updatePassword
`;

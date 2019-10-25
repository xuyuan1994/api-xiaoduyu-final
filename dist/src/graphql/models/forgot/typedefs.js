"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const arguments_1 = require("./arguments");
const tools_1 = require("../tools");
exports.Schema = `
  # 忘记密码
  type forgot {
    success: Boolean
  }
`;
exports.Query = `
`;
exports.Mutation = `
  # 忘记密码
  forgot(${tools_1.getArguments(arguments_1.forgot)}): forgot
`;

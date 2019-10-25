"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const arguments_1 = require("./arguments");
const tools_1 = require("../tools");
exports.Schema = `
  type like {
    success: Boolean
  }
`;
exports.Query = `
`;
exports.Mutation = `
  # 赞
  like(${tools_1.getArguments(arguments_1.like)}): like
`;

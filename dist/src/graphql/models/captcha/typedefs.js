"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const arguments_1 = require("./arguments");
const tools_1 = require("../tools");
exports.Schema = `

  # 返回图片验证码
  type captchaImg {
    success: Boolean
    _id: String
    url: String
  }

  # 获取验证码
  type captcha {
    captcha: String
  }
`;
exports.Query = `
  # 获取验证码【此API测试环境有效】
  getCaptcha(${tools_1.getArguments(arguments_1.getCaptcha)}): captcha
`;
exports.Mutation = `
  # 创建验证码
  addCaptcha(${tools_1.getArguments(arguments_1.addCaptcha)}): captchaImg
`;

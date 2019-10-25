"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const arguments_1 = require("./arguments");
const tools_1 = require("../tools");
exports.Schema = `

  type messages_user_id {
    _id: String
    nickname: String
    avatar_url: String
  }

  type messages {
    _id: String
    user_id: messages_user_id
    addressee_id: messages_user_id
    type: Int
    content: String
    content_html: String
    create_at: String
    ip: String
    blocked: Boolean
    deleted: Boolean
  }

  type countMessages {
    count: Int
  }

  # 添加私信
  type addMessage {
    # 结果
    success: Boolean
    # 私信id
    _id: ID
  }

`;
exports.Query = `
  # 查询私信
  messages(${tools_1.getArguments(arguments_1.messages)}): [messages]

  # 查询私信的总数
  countMessages(${tools_1.getArguments(arguments_1.messages)}): countMessages
`;
exports.Mutation = `
  # 添加私信
  addMessage(${tools_1.getArguments(arguments_1.addMessage)}): addMessage
`;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const arguments_1 = require("./arguments");
const tools_1 = require("../tools");
exports.Schema = `

  type sessions_user_id {
    _id: String
    nickname: String
    avatar_url: String
  }

  type sessions_last_message {
    content_html: String
    create_at: String
  }
  
  type sessions {
    _id: String
    user_id: sessions_user_id
    addressee_id: sessions_user_id
    last_message: sessions_last_message
    unread_count: Int
    create_at: String
    top_at: String
  }

  type countSessions {
    count: Int
  }
  
  type getSession {
    _id: String
  }

  type readSession{
    success: Boolean
  }

  type getUnreadSessions{
    count: Int
  }

`;
exports.Query = `
  # 查询私信
  sessions(${tools_1.getArguments(arguments_1.sessions)}): [sessions]

  # 查询私信的总数
  countSessions(${tools_1.getArguments(arguments_1.sessions)}): countSessions

  # 获取session
  getSession(${tools_1.getArguments(arguments_1.getSession)}): getSession

  # 获取未读会话
  getUnreadSessions: getUnreadSessions
`;
exports.Mutation = `
  # 设置session已阅
  readSession(${tools_1.getArguments(arguments_1.readSession)}): readSession
`;

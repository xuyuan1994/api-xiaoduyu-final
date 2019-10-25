"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const arguments_1 = require("./arguments");
const tools_1 = require("../tools");
exports.Schema = `

  type sender_id {
    create_at: String
    avatar: String
    _id: String
    nickname: String
    avatar_url: String
    id: ID
  }

  type addressee_id {
    create_at: String
    avatar: String
    _id: String
    nickname: String
    avatar_url: String
    id: ID
  }

  type posts_id {
    title: String
    content_html: String
    _id: ID
    content_trim: String
  }

  type un__comment {
    _id: ID
    content_html: String
    content_trim: String
  }

  type un_comment {
    _id: ID
    content_html: String
    posts_id: posts_id
    reply_id: un__comment
    parent_id: un__comment
    content_trim: String
  }

  # 话题
  type userNotification {
    has_read: Boolean
    deleted: Boolean
    create_at: String
    _id: String
    type: String
    comment_id: un_comment
    sender_id: sender_id
    addressee_id: addressee_id
    posts_id: posts_id
  }

  # 更新用户的通知
  type updateUserNotifaction {
    success: Boolean
  }

  # 用户通知计数
  type countUserNotifications {
    count: Int
  }

  # 获取未读的用户消息
  type fetchUnreadUserNotification {
    ids: [String]
  }

`;
exports.Query = `

  # 查询用户通知
  userNotifications(${tools_1.getArguments(arguments_1.userNotifications)}): [userNotification]

  # 用户通知计数
  countUserNotifications(${tools_1.getArguments(arguments_1.userNotifications)}): countUserNotifications

  # 获取未读的用户消息
  fetchUnreadUserNotification: fetchUnreadUserNotification

`;
exports.Mutation = `

  # 更新用户的通知
  updateUserNotifaction(${tools_1.getArguments(arguments_1.updateUserNotifaction)}): updateUserNotifaction

`;

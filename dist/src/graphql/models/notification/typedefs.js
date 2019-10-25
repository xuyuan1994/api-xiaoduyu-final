"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const arguments_1 = require("./arguments");
const tools_1 = require("../tools");
exports.Schema = `

  # 话题
  type notification {
    addressee_id: [String],
    deleted: Boolean,
    create_at: String,
    _id: String,
    type: String,
    sender_id: sender_id
    target: String
  }

  # 更新用户的通知1
  type updateNotifaction {
    success: Boolean
  }

  # 评论计数
  type countNotifications {
    count: Int
  }

`;
exports.Query = `

  # 查询用户通知
  notifications(${tools_1.getArguments(arguments_1.notifications)}): [notification]

  # 评论计数
  countNotifications(${tools_1.getArguments(arguments_1.notifications)}): countNotifications

`;
exports.Mutation = `

  # 更新用户的通知
  updateNotifaction(${tools_1.getArguments(arguments_1.updateNotifaction)}): updateNotifaction

`;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const arguments_1 = require("./arguments");
const tools_1 = require("../tools");
exports.Schema = `
  type _ReplyUser {
    _id: String
    content_html: String
    user_id: _User
  }

  type _Reply {
    content_html: String
    create_at: String
    like_count: Int
    device: Int
    ip: String
    blocked: Int
    deleted: Int
    verify: Int
    weaken: Int
    recommend: Int
    _id: String
    user_id: _User
    posts_id: String
    parent_id: String
    reply_id: _ReplyUser
    update_at: String
    like: Boolean
  }

  type _Posts {
    _id: String
    title: String
    content_html: String
  }

  # 评论
  type Comment {
    content: String
    content_html: String
    create_at: String
    reply_count: Int
    like_count: Int
    device: Int
    ip: String
    blocked: Int
    deleted: Int
    verify: Int
    weaken: Int
    recommend: Int
    _id: String
    user_id: _User
    posts_id: _Posts
    parent_id: String
    reply_id: _ReplyUser
    reply: [_Reply]
    update_at: String
    like: Boolean
  }

  # 更新评论
  type updateComment {
    success: Boolean
  }

  # 评论计数
  type countComments {
    count: Int
  }

  # 添加评论
  type addComment {
    # 结果
    success: Boolean
    # posts id
    _id: ID
  }
`;
exports.Query = `
  # 查询用户
  comments(${tools_1.getArguments(arguments_1.comments)}): [Comment]

  # 评论计数
  countComments(${tools_1.getArguments(arguments_1.comments)}): countComments
`;
exports.Mutation = `
  # 添加评论
  addComment(${tools_1.getArguments(arguments_1.addComment)}): addComment

  # 更新评论
  updateComment(${tools_1.getArguments(arguments_1.updateComment)}): updateComment
`;

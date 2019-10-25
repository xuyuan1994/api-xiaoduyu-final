"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const arguments_1 = require("./arguments");
const tools_1 = require("../tools");
exports.Schema = `

  type childrenTopic {
    _id: String
    name: String
    brief: String
    avatar: String
  }

  # 话题
  type Topic {
    _id: String
    name: String
    brief: String
    description: String
    avatar: String
    background: String
    follow_count: Int
    posts_count: Int
    comment_count: Int
    sort: Int
    create_at: String
    language: Int
    recommend: Boolean
    user_id: String
    follow: Boolean
    parent_id: childrenTopic
    children: [childrenTopic]
  }

  # 更新话题
  type updateTopic {
    success: Boolean
  }

  # 话题计数
  type countTopics {
    count: Int
  }

  # 添加话题
  type addTopic {
    success: Boolean
  }

`;
exports.Query = `

  # 查询帖子
  topics(${tools_1.getArguments(arguments_1.topics)}): [Topic]

  # 话题计数
  countTopics(${tools_1.getArguments(arguments_1.topics)}): countTopics

`;
exports.Mutation = `

  # 添加话题
  addTopic(${tools_1.getArguments(arguments_1.addTopic)}): addTopic

  # 更新话题
  updateTopic(${tools_1.getArguments(arguments_1.updateTopic)}): updateTopic

`;

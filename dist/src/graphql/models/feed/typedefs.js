"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const arguments_1 = require("./arguments");
const tools_1 = require("../tools");
exports.Schema = `

  type _Feed_User {
    _id: String
    nickname: String
    brief: String
    avatar: String
    avatar_url: String
  }

  type _Feed_Comment_Posts {
    _id: String
    user_id: _Feed_User
    title: String
    content_html: String
    create_at: String
  }

  type _Feed_Comment_Reply {
    _id: String
    user_id: _Feed_User
    content_html: String
    create_at: String
  }

  type _Feed_Comment {
    _id: String
    user_id: _Feed_User
    # posts_id: _Feed_Comment_Posts
    like_count: Int
    reply_count: Int
    create_at: String
    content_html: String
    like: Boolean
  }

  type _Feed_Comment_A {
    _id: String
    # user_id: _Feed_User
    # posts_id: _Feed_Comment_Posts
    like_count: Int
    reply_count: Int
    create_at: String
    content_html: String
    like: Boolean
    reply_id: _Feed_Comment_Reply
    parent_id: String
  }

  type _Feed_Topic {
    _id: String
    name: String
    avatar: String
  }

  type _Feed_Posts {
    _id: String
    user_id: _Feed_User
    like_count: Int
    comment_count: Int
    view_count: Int
    follow_count: Int
    create_at: String
    device: Int
    title: String
    content_html: String
    comment: [_Feed_Comment]
    topic_id: _Feed_Topic
  }

  type Feed {
    _id: ID
    user_id: _Feed_User
    posts_id: Posts
    comment_id: _Feed_Comment_A
    create_at: String
  }

  type countFeed {
    count: Int
  }

`;
exports.Query = `
  # 查询帖子
  feed(${tools_1.getArguments(arguments_1.feed)}): [Feed]

  countFeed(${tools_1.getArguments(arguments_1.feed)}): countFeed
`;
exports.Mutation = `
`;

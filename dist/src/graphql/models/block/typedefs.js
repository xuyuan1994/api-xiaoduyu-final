"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const arguments_1 = require("./arguments");
const tools_1 = require("../tools");
exports.Schema = `

  type blocks_comment {
    _id: ID
    content_html: String
    posts_id: ID
    parent_id: ID
  }

  type blocks {
    _id: String
    deleted: Boolean
    create_at: String
    ip: String
    user_id: ID
    comment_id: blocks_comment
    people_id: sender_id
    posts_id: posts_id
  }

  # 添加屏蔽
  type addBlock {
    success: Boolean
    _id: ID
  }

  # 移除屏蔽
  type removeBlock {
    success: Boolean
  }

  # 帖子计数
  type countBlocks {
    count: Int
  }

`;
exports.Query = `

  # 获取屏蔽列表
  blocks(${tools_1.getArguments(arguments_1.blocks)}): [blocks]

  # 帖子计数
  countBlocks(${tools_1.getArguments(arguments_1.blocks)}): countBlocks

`;
exports.Mutation = `

  # 添加屏蔽
  addBlock(${tools_1.getArguments(arguments_1.addBlock)}): addBlock

  # 移除屏蔽
  removeBlock(${tools_1.getArguments(arguments_1.removeBlock)}): removeBlock

`;

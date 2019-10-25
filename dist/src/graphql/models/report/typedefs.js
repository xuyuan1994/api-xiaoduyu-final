"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const arguments_1 = require("./arguments");
const tools_1 = require("../tools");
exports.Schema = `

  type report_user {
    _id: String
    nickname: String
    avatar_url: String
    blocked: Boolean
  }

  type report_posts {
    _id: String
    title: String
    content_html: String
    user_id: report_user
    deleted: Boolean
  }

  type report_comment {
    _id: String
    content_html: String
    user_id: report_user
    deleted: Boolean
  }

  type reports{
    _id: String
    user_id: report_user
    comment_id: report_comment
    posts_id: report_posts
    people_id: report_user
    create_at: String
    report_id: Int
    detail: String
  }

  # 修改密码
  type addRepory {
    # 结果
    success: Boolean
  }

  type report {
    id: Int
    text: String
  }

  type fetchReportTypes {
    success: Boolean
    data: [report]
  }

  type countReports {
    count: Int
  }
`;
exports.Query = `
  reports(${tools_1.getArguments(arguments_1.reports)}): [reports]
  countReports(${tools_1.getArguments(arguments_1.reports)}): countReports
  fetchReportTypes: fetchReportTypes
`;
exports.Mutation = `
  # 修改密码
  addReport(${tools_1.getArguments(arguments_1.addReport)}): addRepory
`;

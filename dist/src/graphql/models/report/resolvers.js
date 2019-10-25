"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../../models");
const to_1 = __importDefault(require("../../../utils/to"));
const errors_1 = __importDefault(require("../../common/errors"));
const report_1 = __importDefault(require("../../../../config/report"));
const Model = __importStar(require("./arguments"));
const tools_1 = require("../tools");
const reports = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role } = context;
    const { method } = args;
    let select = {}, err, postList, query, options;
    [err, query] = tools_1.getQuery({ args, model: Model.reports, role });
    [err, options] = tools_1.getOption({ args, model: Model.reports, role });
    // console.log(query);
    // console.log(options);
    // 用户隐私信息，仅对管理员可以返回
    if (role != 'admin') {
        throw errors_1.default({ message: '请求被拒绝' });
    }
    options.populate = [
        { path: 'user_id' },
        { path: 'comment_id' },
        { path: 'posts_id' },
        { path: 'people_id' }
    ];
    [err, postList] = yield to_1.default(models_1.Report.find({ query, select, options }));
    options = [
        {
            path: 'comment_id.user_id',
            model: 'User',
            select: { '_id': 1, 'avatar': 1, 'nickname': 1, 'brief': 1 },
            justOne: true
        },
        {
            path: 'posts_id.user_id',
            model: 'User',
            select: { '_id': 1, 'avatar': 1, 'nickname': 1, 'brief': 1 },
            justOne: true
        }
    ];
    [err, postList] = yield to_1.default(models_1.Posts.populate({ collections: postList, options }));
    return postList;
});
const countReports = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role } = context;
    const { method } = args;
    let select = {}, err, postList, query, options, count;
    [err, query] = tools_1.getQuery({ args, model: Model.reports, role });
    [err, options] = tools_1.getOption({ args, model: Model.reports, role });
    // console.log(query);
    // console.log(options);
    // 用户隐私信息，仅对管理员可以返回
    if (role != 'admin') {
        throw errors_1.default({ message: '请求被拒绝' });
    }
    // [ err, postList ] = await To(Report.count({ query }));
    [err, count] = yield to_1.default(models_1.Report.count({ query }));
    return count;
});
const fetchReportTypes = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    return {
        success: true,
        data: report_1.default
    };
});
const addReport = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role } = context;
    // 未登陆用户
    if (!user)
        throw errors_1.default({ message: '请求被拒绝' });
    let err, res, fields;
    [err, fields] = tools_1.getSave({ args, model: Model.addReport, role });
    if (err)
        throw errors_1.default({ message: err });
    if (!Reflect.has(fields, 'report_id')) {
        if (err)
            throw errors_1.default({ message: '缺少参数' });
    }
    let data = {};
    if (Reflect.has(fields, 'posts_id')) {
        [err, res] = yield to_1.default(models_1.Posts.findOne({
            query: { _id: fields.posts_id }
        }));
        data.posts_id = fields.posts_id;
    }
    else if (Reflect.has(fields, 'people_id')) {
        [err, res] = yield to_1.default(models_1.User.findOne({
            query: { _id: fields.people_id }
        }));
        data.people_id = fields.people_id;
    }
    else if (Reflect.has(fields, 'comment_id')) {
        [err, res] = yield to_1.default(models_1.Comment.findOne({
            query: { _id: fields.comment_id }
        }));
        data.comment_id = fields.comment_id;
    }
    if (Reflect.ownKeys(fields).length == 0) {
        if (err)
            throw errors_1.default({ message: '缺少目标参数' });
    }
    let query = {
        user_id: user._id,
        // 三天内不能重复提交
        create_at: { '$lt': new Date().getTime(), '$gt': new Date().getTime() - 1000 * 60 * 60 * 24 * 3 }
    };
    if (data.posts_id)
        query.posts_id = data.posts_id;
    if (data.people_id)
        query.people_id = data.people_id;
    if (data.comment_id)
        query.comment_id = data.comment_id;
    [err, res] = yield to_1.default(models_1.Report.findOne({ query }));
    if (res) {
        throw errors_1.default({ message: '你已经举报过了' });
    }
    data.user_id = user._id;
    data.report_id = fields.report_id;
    if (fields.detail)
        data.detail = fields.detail;
    [err, res] = yield to_1.default(models_1.Report.save({ data }));
    return { success: true };
});
exports.query = { reports, fetchReportTypes, countReports };
exports.mutation = { addReport };

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
// tools
const to_1 = __importDefault(require("../../../utils/to"));
const errors_1 = __importDefault(require("../../common/errors"));
const Model = __importStar(require("./arguments"));
const tools_1 = require("../tools");
const topics = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role } = context;
    const { method } = args;
    let select = {}, err, res, query = {}, options = {}, topicList;
    [err, query] = tools_1.getQuery({ args, model: Model.topics, role });
    [err, options] = tools_1.getOption({ args, model: Model.topics, role });
    // select
    schema.fieldNodes[0].selectionSet.selections.map((item) => select[item.name.value] = 1);
    //===
    // 如果需要返回 parent_id，则获取 parent_id 的详细信息
    if (Reflect.has(select, 'parent_id')) {
        if (!options.populate)
            options.populate = [];
        options.populate.push({
            path: 'parent_id',
            model: 'Topic',
            select: { '_id': 1, 'avatar': 1, 'name': 1 }
        });
    }
    if (Reflect.has(select, 'children')) {
        if (!options.populate)
            options.populate = [];
        options.populate.push({
            path: 'children',
            model: 'Topic',
            select: { '_id': 1, 'avatar': 1, 'name': 1 },
            options: {
                sort: {
                    recommend: -1,
                    sort: -1,
                    posts_count: -1
                }
            }
        });
    }
    [err, topicList] = yield to_1.default(models_1.Topic.find({ query, select, options }));
    if (err) {
        throw errors_1.default({
            message: '查询失败',
            data: { errorInfo: err.message }
        });
    }
    if (topicList) {
        topicList = JSON.parse(JSON.stringify(topicList));
        // 如果是登陆用户，显示是否关注了该话题
        if (user && topicList && Reflect.has(select, 'follow')) {
            topicList.map((node) => {
                node.follow = user.follow_topic.indexOf(node._id) != -1 ? true : false;
            });
        }
    }
    else {
        topicList = [];
    }
    return topicList;
});
const countTopics = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role } = context;
    let err, select = {}, query, options, count;
    [err, query] = tools_1.getQuery({ args, model: 'topic', role });
    [err, options] = tools_1.getOption({ args, model: 'topic', role });
    //===
    [err, count] = yield to_1.default(models_1.Topic.count({ query }));
    if (err) {
        throw errors_1.default({
            message: '查询失败',
            data: { errorInfo: err.message }
        });
    }
    return { count };
});
const addTopic = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role } = context;
    let err, result, save;
    [err, save] = tools_1.getSave({ args, model: Model.addTopic, role });
    if (!user || role != 'admin') {
        throw errors_1.default({
            message: '无权限',
            data: {}
        });
    }
    if (!save.name || !save.description || !save.brief) {
        let message = '名字不能为空';
        if (!save.name) {
            message = '名字不能为空';
        }
        else if (!save.description) {
            message = '描述不能为空';
        }
        else if (!save.brief) {
            message = '简介不能为空';
        }
        throw errors_1.default({
            message,
            data: {}
        });
    }
    ;
    [err, result] = yield to_1.default(models_1.Topic.findOne({ query: { name: save.name } }));
    if (err) {
        throw errors_1.default({
            message: '查询异常',
            data: { errorInfo: err.message }
        });
    }
    if (result) {
        throw errors_1.default({
            message: save.name + ' 名称已存在',
            data: {}
        });
    }
    // 如果有父类，检查父类是否存在
    if (save.parent_id) {
        [err, result] = yield to_1.default(models_1.Topic.findOne({ query: { _id: save.parent_id } }));
        if (err) {
            throw errors_1.default({
                message: '查询异常',
                data: { errorInfo: err.message }
            });
        }
        if (!result) {
            throw errors_1.default({
                message: save.parent_id + ' 父类不存在',
                data: {}
            });
        }
    }
    save.user_id = user._id + '';
    // if (!save.avatar) delete save.avatar
    // if (!save.parent_id) delete save.parent_id;
    // console.log(save);
    [err, result] = yield to_1.default(models_1.Topic.save({ data: save }));
    if (err) {
        throw errors_1.default({
            message: '储存失败',
            data: { errorInfo: err.message }
        });
    }
    if (save.parent_id) {
        uploadTopicChildren(save.parent_id);
    }
    return { success: true };
});
const updateTopic = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role } = context;
    let err, query, update, topic, result;
    [err, query] = tools_1.getQuery({ args, model: Model.updateTopic, role });
    [err, update] = tools_1.getSave({ args, model: Model.updateTopic, role });
    if (!user || role != 'admin') {
        throw errors_1.default({
            message: '无权限',
            data: {}
        });
    }
    // --------------------------------------
    [err, topic] = yield to_1.default(models_1.Topic.findOne({ query: { _id: query._id } }));
    if (err) {
        throw errors_1.default({
            message: '_id 查询失败',
            data: { errorInfo: err.message || '' }
        });
    }
    if (!topic) {
        throw errors_1.default({
            message: '_id 不存在',
            data: {}
        });
    }
    // 判断是否存在这个话题
    if (topic.name != update.name) {
        [err, result] = yield to_1.default(models_1.Topic.findOne({ query: { name: update.name } }));
        if (err) {
            throw errors_1.default({
                message: 'name 查询失败',
                data: { errorInfo: err.message || '' }
            });
        }
        if (result) {
            throw errors_1.default({
                message: '_id 已存在',
                data: {}
            });
        }
    }
    // 如果存在父类，必须选择一个父类
    if (topic && topic.parent_id && !update.parent_id) {
        throw errors_1.default({
            message: '必须提交 parent_id',
            data: {}
        });
    }
    else if (topic && !topic.parent_id && update.parent_id) {
        throw errors_1.default({
            message: '必须提交 parent_id',
            data: {}
        });
    }
    // 如果有父类，检查父类是否存在
    if (update.parent_id && topic.parent_id != update.parent_id) {
        if (update.parent_id) {
            [err, result] = yield to_1.default(models_1.Topic.findOne({ query: { _id: update.parent_id } }));
            if (err) {
                throw errors_1.default({
                    message: 'name 查询失败',
                    data: { errorInfo: err.message || '' }
                });
            }
            if (!result) {
                throw errors_1.default({
                    message: 'parent_id 不存在',
                    data: {}
                });
            }
        }
    }
    if (Reflect.has(update, 'parent_id')) {
        if (update.parent_id) {
        }
        else {
            update.parent_id = null;
        }
    }
    [err] = yield to_1.default(models_1.Topic.update({ query, update }));
    if (err) {
        throw errors_1.default({
            message: '更新失败',
            data: { errorInfo: err.message || '' }
        });
    }
    uploadTopicChildren(topic.parent_id ? topic.parent_id : topic._id);
    return { success: true };
});
const uploadTopicChildren = (topicId) => __awaiter(void 0, void 0, void 0, function* () {
    let [err, list] = yield to_1.default(models_1.Topic.find({ query: { parent_id: topicId } }));
    if (!list)
        return;
    let ids = [];
    list.map((item) => {
        ids.push(item._id);
    });
    models_1.Topic.update({
        query: { _id: topicId },
        update: { children: ids }
    });
});
exports.query = { topics, countTopics };
exports.mutation = { addTopic, updateTopic };

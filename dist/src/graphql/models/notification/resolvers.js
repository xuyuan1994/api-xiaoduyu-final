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
const Model = __importStar(require("./arguments"));
const tools_1 = require("../tools");
const notifications = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role } = context;
    const { method } = args;
    let err, select = {}, query, options, list;
    [err, query] = tools_1.getQuery({ args, model: Model.notifications, role });
    [err, options] = tools_1.getOption({ args, model: Model.notifications, role });
    // select
    schema.fieldNodes[0].selectionSet.selections.map((item) => select[item.name.value] = 1);
    //===
    options.populate = [
        {
            path: 'sender_id',
            select: {
                '_id': 1, 'avatar': 1, 'nickname': 1, 'brief': 1
            }
        }
    ];
    [err, list] = yield to_1.default(models_1.Notification.find({ query, select, options }));
    return list;
});
const countNotifications = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { role } = context;
    let err, query, count;
    [err, query] = tools_1.getQuery({ args, model: Model.notifications, role });
    [err, count] = yield to_1.default(models_1.Notification.count({ query }));
    return {
        count
    };
});
const updateNotifaction = (root, args, context, schema) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, role } = context;
    const { method } = args;
    let options = {}, err, query, update, result;
    [err, query] = tools_1.getQuery({ args, model: Model.updateNotifaction, role });
    [err, update] = tools_1.getSave({ args, model: Model.updateNotifaction, role });
    if (err) {
        throw errors_1.default({
            message: err,
            data: {}
        });
    }
    [err, result] = yield to_1.default(models_1.Notification.update({ query, update, options }));
    if (err) {
        throw errors_1.default({
            message: '更新失败',
            data: { errorInfo: err.message }
        });
    }
    return { success: true };
});
exports.query = { notifications, countNotifications };
exports.mutation = { updateNotifaction };

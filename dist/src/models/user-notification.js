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
Object.defineProperty(exports, "__esModule", { value: true });
const schemas_1 = require("../schemas");
const base_method_1 = __importDefault(require("./base-method"));
const to_1 = __importDefault(require("../utils/to"));
const socket_1 = require("../socket");
class Model extends base_method_1.default {
    // 添加一条用户通知，并触发推送通知
    addOneAndSendNotification({ data }) {
        const self = this;
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (!data)
                return reject('data is null');
            let [err, res] = yield to_1.default(self.findOne({ query: data }));
            if (err)
                return reject(err);
            if (res) {
                yield to_1.default(self.update({ query: res._id, update: { deleted: false } }));
                resolve(res);
            }
            else {
                [err, res] = yield to_1.default(self.save({ data }));
                err ? reject(err) : resolve(res);
            }
            // 触发消息，通知该用户查询新通知
            socket_1.emit(data.addressee_id, { type: 'notification' });
        }));
    }
}
exports.default = new Model(schemas_1.UserNotification);

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ObjectId = Schema.Types.ObjectId;
const TokenSchema = new Schema({
    // 用户
    user_id: { type: ObjectId, ref: 'User' },
    // 用户的访问令牌
    token: { type: String },
    // 兑换次数
    exchange_count: { type: Number, default: 0 },
    // ip
    ip: { type: String },
    // 创建日期，30天后自动删除
    create_at: { type: Date, expires: 60 * 60 * 24 * 30, default: Date.now }
});
TokenSchema.index({ user_id: 1, token: 1 });
mongoose_1.default.model('Token', TokenSchema);

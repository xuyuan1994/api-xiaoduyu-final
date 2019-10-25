"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ObjectId = Schema.Types.ObjectId;
/*
 * type:
 * feed
 * comment
 */
/*
 * mood
 * 0: 赞
 * 1: 喜欢
 */
const LikeSchema = new Schema({
    user_id: { type: ObjectId },
    type: { type: String },
    target_id: { type: ObjectId },
    mood: { type: Number, default: 0 },
    deleted: { type: Boolean, default: false },
    create_at: { type: Date, default: Date.now }
});
LikeSchema.index({ user_id: 1, type: 1, target_id: 1, mood: 1 }, { unique: true });
mongoose_1.default.model('Like', LikeSchema);

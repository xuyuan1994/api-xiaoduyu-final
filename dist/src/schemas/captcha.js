"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ObjectId = Schema.Types.ObjectId;
const CaptchaSchema = new Schema({
    user_id: { type: ObjectId, ref: 'User' },
    area_code: { type: String },
    phone: { type: String },
    email: { type: String, lowercase: true, trim: true },
    captcha: { type: String, required: true },
    ip: { type: String },
    type: { type: String },
    create_at: { type: Date, expires: 60 * 15, default: Date.now } // 半小时后自动删除
});
mongoose_1.default.model('Captcha', CaptchaSchema);

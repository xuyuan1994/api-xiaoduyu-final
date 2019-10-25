"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const ObjectId = Schema.Types.ObjectId;
const ReportSchema = new Schema({
    user_id: { type: ObjectId, ref: 'User' },
    posts_id: { type: ObjectId, ref: 'Posts' },
    comment_id: { type: ObjectId, ref: 'Comment' },
    people_id: { type: ObjectId, ref: 'User' },
    report_id: { type: Number },
    detail: { type: String },
    create_at: { type: Date, default: Date.now }
});
mongoose_1.default.model('Report', ReportSchema);

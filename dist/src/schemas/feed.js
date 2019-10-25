"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ObjectId = Schema.Types.ObjectId;
const socket_1 = require("../socket");
// 动态流
const Feed = new Schema({
    user_id: { type: ObjectId, ref: 'User' },
    topic_id: { type: ObjectId, ref: 'Topic' },
    posts_id: { type: ObjectId, ref: 'Posts' },
    comment_id: { type: ObjectId, ref: 'Comment' },
    recommend: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    create_at: { type: Date, default: Date.now }
});
Feed.pre('save', function (next) {
    socket_1.emit('member', { type: 'new-feed' });
    next();
});
Feed.index({ user_id: 1, topic_id: 1, posts_id: 1, comment_id: 1 }, { unique: true });
mongoose_1.default.model('Feed', Feed);

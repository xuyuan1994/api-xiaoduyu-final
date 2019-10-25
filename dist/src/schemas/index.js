"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../../config"));
const { mongodbDebug, mongodbURI } = config_1.default;
if (mongodbDebug)
    mongoose_1.default.set('debug', true);
mongoose_1.default.connect(mongodbURI, {
    useCreateIndex: true,
    useNewUrlParser: true
});
require("./user");
require("./account");
require("./oauth");
require("./comment");
require("./like");
require("./notification");
require("./user-notification");
require("./captcha");
require("./posts");
require("./topic");
require("./follow");
require("./token");
require("./phone");
require("./report");
require("./block");
require("./feed");
require("./message");
require("./session");
exports.User = mongoose_1.default.model('User');
exports.Account = mongoose_1.default.model('Account');
exports.Oauth = mongoose_1.default.model('Oauth');
exports.Captcha = mongoose_1.default.model('Captcha');
exports.Token = mongoose_1.default.model('Token');
exports.Phone = mongoose_1.default.model('Phone');
exports.Report = mongoose_1.default.model('Report');
exports.Posts = mongoose_1.default.model('Posts');
exports.Comment = mongoose_1.default.model('Comment');
exports.Topic = mongoose_1.default.model('Topic');
exports.Follow = mongoose_1.default.model('Follow');
exports.Like = mongoose_1.default.model('Like');
exports.Notification = mongoose_1.default.model('Notification');
exports.UserNotification = mongoose_1.default.model('UserNotification');
exports.Block = mongoose_1.default.model('Block');
exports.Feed = mongoose_1.default.model('Feed');
exports.Message = mongoose_1.default.model('Message');
exports.Session = mongoose_1.default.model('Session');

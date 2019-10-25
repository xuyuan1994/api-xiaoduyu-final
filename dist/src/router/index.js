"use strict";
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
const express_1 = __importDefault(require("express"));
const captcha = __importStar(require("./captcha"));
const weibo = __importStar(require("./oauth/weibo"));
const qq = __importStar(require("./oauth/qq"));
const github = __importStar(require("./oauth/github"));
const wechat = __importStar(require("./oauth/wechat"));
const config_1 = __importDefault(require("../../config"));
const { debug, oauth } = config_1.default;
exports.default = () => {
    const router = express_1.default.Router();
    router.get('/', (req, res) => {
        let text = `API服务运行中...${debug ? '<br /><a href="/graphql">GraphQL API文档(开发环境会打开，线上环境会关闭)</a>' : ''}`;
        res.send(text);
    });
    router.get('/captcha/:id', captcha.showImage);
    if (oauth.weibo.appid) {
        router.get('/oauth/weibo', weibo.signIn);
        router.get('/oauth/weibo-signin', weibo.signInCallback);
    }
    if (oauth.qq.appid) {
        router.get('/oauth/qq', qq.signIn);
        router.get('/oauth/qq-signin', qq.signInCallback);
    }
    if (oauth.github.appid) {
        router.get('/oauth/github', github.signIn);
        router.get('/oauth/github-signin', github.signInCallback);
    }
    if (oauth.wechat.appid) {
        router.get('/oauth/wechat', wechat.signIn);
        router.get('/oauth/wechat-signin', wechat.signInCallback);
    }
    if (oauth.wechatPC.appid) {
        router.get('/oauth/wechat-pc', wechat.PC_signIn);
        router.get('/oauth/wechat-pc-signin', wechat.PC_signInCallback);
    }
    return router;
};

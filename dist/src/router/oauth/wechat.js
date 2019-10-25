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
const request_1 = __importDefault(require("request"));
const node_uuid_1 = __importDefault(require("node-uuid"));
const to_1 = __importDefault(require("../../utils/to"));
const config_1 = __importDefault(require("../../../config"));
const oauth_class_1 = __importDefault(require("./oauth.class"));
class GithubClass extends oauth_class_1.default {
    signInCallback() {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var user = null;
            var code = req.query.code;
            var state = req.query.state;
            var user_access_token = req.cookies['access_token']; //req.session.access_token;
            // 避免csrf攻击
            if (req.cookies['csrf'] != state) {
                res.redirect(this.signInUrl);
                return;
            }
            if (user_access_token) {
                user = yield this.checkAccessToken(user_access_token);
                if (!user) {
                    this.goToNoticePage(req, res, 'wrong_token');
                    return;
                }
            }
            let err, result, userinfo, userId;
            // 获取第三放的访问令牌
            [err, result] = yield to_1.default(this.getAccessToken(code));
            if (err) {
                this.goToNoticePage(req, res, 'wrong_token');
                return;
            }
            if (!result) {
                res.redirect(this.redirectUri);
                return;
            }
            // 获取open id
            [err, userinfo] = yield to_1.default(this.getUserinfo(result.access_token, result.unionid));
            let socialInfo = {
                nickname: userinfo.nickname,
                avatar: userinfo.headimgurl || '',
                gender: userinfo.sex == 1 ? 1 : 0,
                access_token: node_uuid_1.default.v4()
            };
            let socialAccessToken = {
                openid: result.unionid,
                access_token: result.access_token,
                expires_in: result.expires_in,
                refresh_token: result.refresh_token
            };
            [err, userId] = yield to_1.default(this.handle({
                userId: user ? user._id : '',
                socialAccessToken,
                socialInfo,
                source: this.name
            }));
            if (err || !userId) {
                this.goToNoticePage(req, res, err);
            }
            else {
                this.goToAutoSignin(req, res, userId);
            }
        });
    }
    // 获取 access token
    getAccessToken(code) {
        return new Promise((resolve, reject) => {
            request_1.default.get('https://api.weixin.qq.com/sns/oauth2/access_token?' +
                'appid=' + this.appid +
                '&secret=' + this.appkey +
                '&code=' + code +
                '&grant_type=authorization_code', {}, function (error, response, body) {
                if (body)
                    body = JSON.parse(body);
                if (body && !body.errcode) {
                    resolve(body);
                }
                else {
                    reject(body.errcode);
                }
            });
        });
    }
    getUserinfo(access_token, openid) {
        return new Promise((resolve, reject) => {
            request_1.default.get('https://api.weixin.qq.com/sns/userinfo?access_token=' + access_token + '&openid=' + openid + '&lang=zh_CN', {}, function (error, response, body) {
                // console.log(response);
                // {"errcode":40001,"errmsg":"invalid credential, access_token is invalid or not latest, hints: [ req_id: MJbACoLoRa-CktJaA ]"}
                // console.log(body);
                if (body)
                    body = JSON.parse(body);
                // callback(body && !body.errcode ? body : null);
                if (body && !body.errcode) {
                    resolve(body);
                }
                else {
                    reject(body.errcode);
                }
            });
        });
    }
}
let wechat = new GithubClass({
    name: 'wechat',
    signInUrl: config_1.default.domain + '/oauth/wechat',
    appid: config_1.default.oauth.wechat.appid,
    appkey: config_1.default.oauth.wechat.appkey,
    redirectUri: config_1.default.domain + '/oauth/wechat-signin',
    scope: 'snsapi_userinfo',
    redirectSignInUri: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid={appid}&redirect_uri={redirectUri}&response_type=code&scope={scope}&state={csrf}#wechat_redirect'
});
let wechatPC = new GithubClass({
    name: 'wechat',
    signInUrl: config_1.default.domain + '/oauth/wechat-pc',
    appid: config_1.default.oauth.wechatPC.appid,
    appkey: config_1.default.oauth.wechatPC.appkey,
    redirectUri: config_1.default.domain + '/oauth/wechat-pc-signin',
    scope: 'snsapi_login',
    redirectSignInUri: 'https://open.weixin.qq.com/connect/qrconnect?appid={appid}&redirect_uri={redirectUri}&response_type=code&scope={scope}&state={csrf}#wechat_redirect'
});
// 重定向到第三方验证页面
exports.signIn = wechat.redirectSignIn();
exports.signInCallback = wechat.signInCallback();
exports.PC_signIn = wechatPC.redirectSignIn();
exports.PC_signInCallback = wechatPC.signInCallback();

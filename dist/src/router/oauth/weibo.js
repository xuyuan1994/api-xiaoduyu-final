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
            [err, userinfo] = yield to_1.default(this.getUserinfo(result.access_token, result.uid));
            let socialInfo = {
                nickname: userinfo.screen_name,
                avatar: userinfo.avatar_hd || '',
                gender: (userinfo.gender === 'm' ? 1 : 0),
                access_token: node_uuid_1.default.v4()
            };
            let socialAccessToken = {
                openid: result.uid,
                access_token: result.access_token,
                expires_in: result.expires_in
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
        return new Promise((resolve, rejects) => {
            request_1.default.post('https://api.weibo.com/oauth2/access_token?client_id=' + this.appid + '&client_secret=' + this.appkey + '&grant_type=authorization_code&redirect_uri=' + encodeURIComponent(this.redirectUri) + '&code=' + code, {}, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var info = JSON.parse(body);
                    resolve(info);
                }
                else {
                    rejects(error);
                }
            });
        });
    }
    getUserinfo(access_token, uid) {
        return new Promise((resolve, reject) => {
            request_1.default.get('https://api.weibo.com/2/users/show.json?access_token=' + access_token + '&uid=' + uid + '&source=' + this.appid, {}, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var info = JSON.parse(body);
                    resolve(info);
                }
                else {
                    reject(null);
                }
            });
        });
    }
}
let weibo = new GithubClass({
    name: 'weibo',
    signInUrl: config_1.default.domain + '/oauth/weibo',
    appid: config_1.default.oauth.weibo.appid + '',
    appkey: config_1.default.oauth.weibo.appSecret,
    redirectUri: config_1.default.domain + '/oauth/weibo-signin',
    scope: 'user',
    redirectSignInUri: 'https://api.weibo.com/oauth2/authorize?response_type=code&state={csrf}&client_id={appid}&redirect_uri={redirectUri}&scope={scope}'
});
// 重定向到第三方验证页面
exports.signIn = weibo.redirectSignIn();
exports.signInCallback = weibo.signInCallback();

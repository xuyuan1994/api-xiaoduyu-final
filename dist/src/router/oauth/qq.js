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
class QQClass extends oauth_class_1.default {
    /**
     * web，登陆、注册、绑定
     */
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
            let err, result, userinfo, userId, openid;
            // 获取第三放的访问令牌
            [err, result] = yield to_1.default(this.getAccessToken(code, state));
            if (err) {
                this.goToNoticePage(req, res, 'wrong_token');
                return;
            }
            if (!result) {
                res.redirect(this.redirectUri);
                return;
            }
            [err, openid] = yield to_1.default(this.getOpenId(result.access_token));
            // 获取open id
            [err, userinfo] = yield to_1.default(this.getUserinfo(result.access_token, openid));
            let socialInfo = {
                nickname: userinfo.nickname,
                avatar: userinfo.figureurl_qq_2,
                gender: userinfo.gender == '男' ? 1 : 0,
                access_token: node_uuid_1.default.v4()
            };
            let socialAccessToken = {
                openid: openid,
                access_token: result.access_token,
                expires_in: result.expires_in,
                refresh_token: result.refresh_token || ''
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
    /**
     * app客户端，登陆、注册、绑定
     */
    signIn() {
        return (data) => {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const { ip, user, token } = data;
                let err, userinfo, userId;
                // 获取用户的信息
                [err, userinfo] = yield to_1.default(this.getUserinfo(token.access_token, token.openid, token.oauth_consumer_key));
                let socialInfo = {
                    nickname: userinfo.nickname,
                    avatar: userinfo.figureurl_qq_2,
                    gender: userinfo.gender == '男' ? 1 : 0,
                    access_token: node_uuid_1.default.v4()
                };
                let socialAccessToken = {
                    openid: token.openid,
                    access_token: token.access_token,
                    expires_in: token.expires_in,
                    refresh_token: token.refresh_token || ''
                };
                [err, userId] = yield to_1.default(this.handle({
                    userId: user ? user._id : '',
                    socialAccessToken,
                    socialInfo,
                    source: this.name
                }));
                if (err && err == 'binding_finished') {
                    resolve(true);
                }
                else if (err || !userId) {
                    reject(err);
                }
                else {
                    if (user) {
                        resolve(true);
                    }
                    else {
                        let token = yield this.createAccessToken(ip, userId);
                        resolve(token);
                    }
                }
            }));
        };
    }
    // 获取 access token
    getAccessToken(code, state) {
        return new Promise((resolve, rejects) => {
            request_1.default.get('https://graph.qq.com/oauth2.0/token?grant_type=authorization_code&client_id=' + this.appid + '&client_secret=' + this.appkey + '&code=' + code + '&redirect_uri=' + encodeURIComponent(this.redirectUri), {}, function (error, response, body) {
                if (error || response.statusCode != 200) {
                    // 获取失败
                    rejects(error || response.statusCode);
                    return;
                }
                var params = {};
                var str = body;
                var strs = str.split("&");
                for (var i = 0, max = strs.length; i < max; i++) {
                    var a = strs[i].split("=");
                    params[a[0]] = a[1];
                }
                resolve(params);
            });
        });
    }
    getOpenId(access_token) {
        return new Promise((resolve, reject) => {
            request_1.default.get('https://graph.qq.com/oauth2.0/me?access_token=' + access_token, {}, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var star = body.indexOf('(') + 1;
                    var end = body.lastIndexOf(')');
                    var body = body.substring(star, end);
                    var info = JSON.parse(body);
                    if (info.openid) {
                        resolve(info.openid);
                    }
                    else {
                        reject('openid get failed');
                    }
                }
                else {
                    reject(error || response.statusCode);
                }
            });
        });
    }
    getUserinfo(access_token, openid, oauth_consumer_key) {
        return new Promise((resolve, reject) => {
            request_1.default.get('https://graph.qq.com/user/get_user_info?access_token=' + access_token + '&oauth_consumer_key=' + (oauth_consumer_key || this.appid) + '&openid=' + openid, {}, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var info = JSON.parse(body);
                    resolve(info);
                }
                else {
                    reject(error);
                }
            });
        });
    }
}
let qq = new QQClass({
    name: 'qq',
    signInUrl: config_1.default.domain + '/oauth/qq',
    appid: config_1.default.oauth.qq.appid + '',
    appkey: config_1.default.oauth.qq.appkey,
    redirectUri: config_1.default.domain + '/oauth/qq-signin',
    scope: 'get_user_info',
    redirectSignInUri: 'https://graph.qq.com/oauth2.0/authorize?response_type=code&state={csrf}&client_id={appid}&redirect_uri={redirectUri}&scope={scope}'
});
// 重定向到第三方验证页面
exports.signIn = qq.redirectSignIn();
exports.signInCallback = qq.signInCallback();
exports.signInAPI = qq.signIn();

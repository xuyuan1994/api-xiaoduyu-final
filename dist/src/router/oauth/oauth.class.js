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
const xss_1 = __importDefault(require("xss"));
const config_1 = __importDefault(require("../../../config"));
const models_1 = require("../../models");
const synthesis_1 = __importDefault(require("../../utils/synthesis"));
const to_1 = __importDefault(require("../../utils/to"));
const social_1 = __importDefault(require("../../../config/social"));
const tools_1 = require("../../utils/tools");
const check_token_1 = __importDefault(require("../../graphql/common/check-token"));
const resolvers_1 = require("../../graphql/models/qiniu/resolvers");
class OAuthClass {
    constructor(data) {
        this.name = data.name;
        this.signInUrl = data.signInUrl;
        this.appid = data.appid;
        this.appkey = data.appkey;
        this.redirectUri = data.redirectUri;
        this.scope = data.scope;
        this.redirectSignInUri = data.redirectSignInUri;
    }
    // 重定向登录
    redirectSignIn() {
        return (req, res) => {
            // 跨站请求伪造
            const csrf = Math.round(900000 * Math.random() + 100000), 
            // cookie 设置
            opts = { httpOnly: true, path: '/', maxAge: 1000 * 60 * 15 }, 
            // 着陆网站页面，登陆成功后跳转到该页面
            landingPage = req.headers.referer || config_1.default.oauth.landingPage, 
            // domain:Array<string> = [],
            // 储存访问令牌
            accessToken = req.query.access_token || '', 
            // 着陆网站的域名，获取的token或传到 xiaoduyu.com/oauth?token=***
            landingPageDomain = landingPage.split('/').slice(0, 3).join('/');
            res.cookie('csrf', csrf, opts);
            res.cookie('access_token', accessToken, opts);
            res.cookie('landing_page_domain', landingPageDomain, opts);
            res.cookie('landing_page', landingPage, opts);
            let url = synthesis_1.default(this.redirectSignInUri, {
                appid: this.appid,
                scope: this.scope,
                csrf,
                redirectUri: encodeURIComponent(this.redirectUri)
            });
            res.redirect(url);
        };
    }
    checkAccessToken(user_access_token) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            let result = yield check_token_1.default({ token: user_access_token, role: '' });
            if (result && result.user) {
                resolve(result.user);
            }
            else {
                resolve();
            }
            // var decoded = JWT.decode(user_access_token), user;
            // if (decoded && decoded.expires > new Date().getTime()) {
            //   let [ err, _user ] = await To(User.findOne({ query: { _id: decoded.user_id } }));
            //   if (err) console.log(err);
            //   if (_user && _user[0]) user = _user[0]
            // }
            // resolve(user)
        }));
    }
    /**
     *
     * @param param0
     */
    handle({ userId, socialAccessToken, socialInfo, source }) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let err, oauth;
            // 通过 openid 获取 oauth
            [err, oauth] = yield to_1.default(models_1.Oauth.fetchByOpenIdAndSource(socialAccessToken.openid, source));
            if (err)
                console.log(err);
            // 绑定失败，账号已绑定
            if (userId && oauth && oauth.deleted == false) {
                reject('has_been_binding');
                return;
            }
            // 将已解除绑定的账号，重新绑定用户
            if (userId && oauth && oauth.deleted == true) {
                let [err] = yield to_1.default(models_1.Oauth.update({
                    query: { _id: oauth._id },
                    update: {
                        access_token: socialAccessToken.access_token,
                        expires_in: socialAccessToken.expires_in || 0,
                        refresh_token: socialAccessToken.refresh_token || '',
                        user_id: userId,
                        deleted: false
                    }
                }));
                if (err) {
                    reject('binding_failed');
                    return;
                }
                else {
                    reject('binding_finished');
                    return;
                }
            }
            // 已注册用户绑定微信
            if (userId && !oauth) {
                yield to_1.default(models_1.Oauth.save({
                    data: Object.assign(Object.assign({}, socialAccessToken), { user_id: userId, source: social_1.default[source] })
                }));
                reject('binding_finished');
                return;
            }
            // 登陆
            if (!userId && oauth && oauth.deleted == false) {
                return resolve(oauth.user_id);
            }
            // 创新新的用户
            if (!userId && !oauth) {
                // 如果有头像，那么上传头像
                if (socialInfo.avatar) {
                    let [err, avatar] = yield to_1.default(resolvers_1.downloadImgAndUploadToQiniu(socialInfo.avatar));
                    if (avatar)
                        socialInfo.avatar = avatar;
                }
                ;
                let [err, user] = yield to_1.default(this.createUser(Object.assign(Object.assign({}, socialInfo), { createDate: new Date() })));
                if (err || !user) {
                    reject('create_user_failed');
                    return;
                }
                [err] = yield to_1.default(models_1.Oauth.save({
                    data: Object.assign(Object.assign({}, socialAccessToken), { user_id: user._id, source: social_1.default[source] })
                }));
                if (err) {
                    // console.log(err);
                    reject('create_oauth_failed');
                    return;
                }
                resolve(user._id);
                return;
            }
            // oauth 是删除状态，绑定新账户，并恢复成可用状态
            if (!userId && oauth && oauth.deleted == true) {
                // 如果有头像，那么上传头像
                if (socialInfo.avatar) {
                    let [err, avatar] = yield to_1.default(resolvers_1.downloadImgAndUploadToQiniu(socialInfo.avatar));
                    if (avatar)
                        socialInfo.avatar = avatar;
                }
                ;
                let [err, user] = yield to_1.default(this.createUser(Object.assign(Object.assign({}, socialInfo), { createDate: new Date() })));
                if (err || !user) {
                    return reject('create_oauth_failed');
                }
                yield to_1.default(models_1.Oauth.update({
                    query: { _id: oauth._id },
                    update: {
                        user_id: user._id,
                        deleted: false
                    }
                }));
                resolve(user._id);
            }
        }));
    }
    goToNoticePage(req, res, string) {
        var landingPageDomain = req.cookies['landing_page_domain'];
        res.redirect(landingPageDomain + '/notice?notice=' + string);
    }
    // 创建token
    createAccessToken(ip, userId) {
        return models_1.Token.create({ userId, ip });
    }
    goToAutoSignin(req, res, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let ip = tools_1.getIP(req);
            var result = yield this.createAccessToken(ip, userId);
            var landingPage = req.cookies['landing_page'] || config_1.default.oauth.landingPage;
            var landingPageDomain = req.cookies['landing_page_domain'] || config_1.default.oauth.landingPage;
            res.redirect(landingPageDomain + '/oauth?access_token=' + result.access_token + '&expires=' + result.expires + '&landing_page=' + landingPage);
        });
    }
    // 创建用户
    createUser(user) {
        // xss过滤
        user.nickname = xss_1.default(user.nickname, {
            whiteList: {},
            stripIgnoreTag: true,
            onTagAttr: () => ''
        });
        return models_1.User.save({ data: user });
    }
}
exports.default = OAuthClass;

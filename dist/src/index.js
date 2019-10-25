"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
// 用于微信验证
const crypto_1 = __importDefault(require("crypto"));
// 抵御一些比较常见的安全web安全隐患
// https://cnodejs.org/topic/56f3b0e8dd3dade17726fe85
// https://github.com/helmetjs/helmet
const helmet_1 = __importDefault(require("helmet"));
// 安全机制限制客户端api请求频率
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const rate_limit_mongo_1 = __importDefault(require("rate-limit-mongo"));
// 日志记录
const log4js_1 = __importDefault(require("./utils/log4js"));
const config_1 = __importDefault(require("../config"));
const graphql_1 = __importDefault(require("./graphql"));
const router_1 = __importDefault(require("./router"));
const socket_1 = __importDefault(require("./socket"));
const app = express_1.default();
// 启动日志
log4js_1.default(app);
app.use(helmet_1.default());
// 开发环境生产,在控制台打印出请求记录
if (config_1.default.debug)
    app.use(morgan_1.default('dev'));
// http://www.cnblogs.com/vipstone/p/4865079.html
app.use(body_parser_1.default.json({ limit: '20mb' }));
app.use(body_parser_1.default.urlencoded({ limit: '20mb', extended: true }));
app.use(cookie_parser_1.default(config_1.default.cookieSecret));
// 可以支持X-Forwarded-Proto(协议代理) X-Forwarded-For(ip代理), X-Forwarded-Host(主机代理)
app.set('trust proxy', 1);
// [所有请求]限制每个ip，一小时最多1500次请求
app.use(express_rate_limit_1.default({
    store: new rate_limit_mongo_1.default({
        uri: config_1.default.mongodbURI,
        expireTimeMs: 60 * 60 * 1000
    }),
    windowMs: 60 * 60 * 1000,
    max: 1500
}));
// 设置静态文件，存放一些对外的静态文件
app.use(express_1.default.static(path_1.default.join(__dirname, '../../public')));
app.use(express_1.default.static(path_1.default.join(__dirname, '../../assets')));
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, AccessToken, Role, X-Requested-With');
    // res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With ,yourHeaderFeild, AccessToken');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (req.method == 'OPTIONS') {
        // 跨域并设置headers的请求，所有请求需要两步完成！
        // 第一步：发送预请求 OPTIONS 请求。此时 服务器端需要对于OPTIONS请求作出响应 一般使用202响应即可 不用返回任何内容信息。
        // res.status(200);
        res.sendStatus(204);
    }
    else if (req.method === 'GET') {
        if (!config_1.default.oauth.wechat.token) {
            next();
            return;
        }
        // 微信验证
        // https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421135319
        // https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=jsapisign
        const { signature, timestamp, nonce, echostr } = req.query;
        if (signature && timestamp && nonce) {
            let sha1 = crypto_1.default.createHash('sha1'), sha1Str = sha1.update([config_1.default.oauth.wechat.token, timestamp, nonce].sort().join('')).digest('hex');
            res.send((sha1Str === signature) ? echostr : '');
            return;
        }
        else {
            next();
        }
    }
    else {
        next();
    }
});
// 设置路由
app.use('/', router_1.default());
graphql_1.default(app);
app.use(function (req, res, next) {
    res.status(404);
    res.send('404 not found');
});
const server = app.listen(config_1.default.port, () => {
    console.log('server started on port ' + config_1.default.port);
});
// 启动 websocket
socket_1.default(server);

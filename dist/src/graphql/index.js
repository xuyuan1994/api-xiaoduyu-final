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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const apollo_errors_1 = require("apollo-errors");
const graphql_tools_1 = require("graphql-tools");
const check_token_1 = __importDefault(require("./common/check-token"));
const Models = __importStar(require("./models/index"));
const schema = graphql_tools_1.makeExecutableSchema(Models);
/**
 * 启动 graphql
 * @param  {Object} app - express 的 app
 */
exports.default = (app) => {
    const server = new apollo_server_express_1.ApolloServer({
        schema,
        formatError: apollo_errors_1.formatError,
        context: ({ req }) => {
            // 获取客户端请求ip
            let ip;
            if (req.headers['x-forwarded-for']) {
                ip = req.headers['x-forwarded-for'].toString().split(",")[0];
            }
            else {
                ip = req.connection.remoteAddress;
            }
            return {
                user: req.user || null,
                role: req.role || '',
                ip
            };
        },
        // https://www.apollographql.com/docs/apollo-server/features/graphql-playground.html#Enabling-GraphQL-Playground-in-production
        introspection: true,
        playground: true //config.debug
    });
    app.all('*', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // 如果header中，包含access token，那么判断是否有效，无效则拒绝请求
        let token = req.headers.accesstoken || '';
        let role = req.headers.role || '';
        if (!token) {
            next();
        }
        else {
            let result = yield check_token_1.default({ token, role });
            if (!result.user) {
                res.send({
                    errors: [{ message: "invalid token" }]
                });
            }
            else if (result.user.blocked) {
                res.send({
                    errors: [{ message: "您的账号被禁止使用", blocked: true }]
                });
            }
            else {
                req.user = result.user;
                req.role = result.role;
                next();
            }
        }
    }));
    server.applyMiddleware({ app, path: '/graphql' });
};

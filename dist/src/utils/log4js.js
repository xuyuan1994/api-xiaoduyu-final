"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// https://github.com/log4js-node/log4js-node
const log4js_1 = __importDefault(require("log4js"));
exports.default = (app) => {
    // ALL < TRACE < DEBUG < INFO < WARN < ERROR < FATAL < MARK < OFF
    log4js_1.default.configure({
        appenders: {
            // console: {
            //   type: "console"
            // },
            // 输出trace、debug
            _trace: {
                type: 'file',
                filename: 'logs/trace',
                pattern: "yyyy-MM-dd.log",
                alwaysIncludePattern: true,
                maxLogSize: 31457280
            },
            trace: {
                type: "logLevelFilter",
                appender: "_trace",
                level: "trace",
                maxLevel: "debug"
            },
            // 输出 info。请求日志
            _info: {
                type: 'file',
                filename: 'logs/info',
                pattern: "yyyy-MM-dd.log",
                alwaysIncludePattern: true,
                maxLogSize: 31457280
            },
            info: {
                type: "logLevelFilter",
                appender: "_info",
                level: "info",
                maxLevel: "info"
            },
            // 输出 warn、error、fatal
            _error: {
                type: 'file',
                filename: 'logs/error',
                pattern: "yyyy-MM-dd.log",
                alwaysIncludePattern: true,
                maxLogSize: 31457280
            },
            error: {
                type: "logLevelFilter",
                appender: "_error",
                level: "warn",
                maxLevel: "fatal"
            }
        },
        categories: {
            default: {
                // 在控制台显示
                appenders: ['trace', 'info', 'error'],
                level: 'all'
            }
        }
    });
    app.use(log4js_1.default.connectLogger(log4js_1.default.getLogger("http"), { level: 'auto' }));
    // var log = log4js.getLogger("app");
    // log.trace('Entering cheese testing');
    // log.debug('Got cheese.');
    // log.info('Cheese is Comté.');
    // log.warn('Cheese is quite smelly.');
    // log.error('Cheese is too ripe!');
    // log.fatal('Cheese was breeding ground for listeria.');
};

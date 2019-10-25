"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
const config_1 = __importDefault(require("../../config"));
const synthesis_1 = __importDefault(require("../utils/synthesis"));
const { yunpian } = config_1.default;
exports.sendSMS = ({ PhoneNumbers, TemplateParam }) => {
    return new Promise((resolve, reject) => {
        if (!yunpian.international ||
            yunpian.international.apikey ||
            yunpian.international.text) {
            return reject('未配置云片国际短信');
        }
        request_1.default.post({
            url: 'https://sms.yunpian.com/v2/sms/single_send.json',
            form: {
                apikey: yunpian.international.apikey,
                mobile: PhoneNumbers,
                text: synthesis_1.default(yunpian.international.text, { code: TemplateParam.code })
            }
        }, function (err, httpResponse, body) {
            if (body) {
                try {
                    body = JSON.parse(body);
                    if (typeof body.code != 'undefined' && body.code == 0) {
                        resolve();
                    }
                    else {
                        reject(body.detail || body.http_status_code);
                    }
                }
                catch (err) {
                    reject('短信发送失败');
                }
                return;
            }
            reject('短信发送失败');
        });
    });
};

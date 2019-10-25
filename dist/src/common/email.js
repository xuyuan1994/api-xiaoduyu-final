"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config"));
const sendcloud_client_1 = __importDefault(require("sendcloud-client"));
let sendCloudConfig = config_1.default.email.sendCloud;
let client;
if (sendCloudConfig &&
    sendCloudConfig.from &&
    sendCloudConfig.apiUser &&
    sendCloudConfig.apiKey) {
    client = sendcloud_client_1.default.create({
        from: config_1.default.name + ' <' + sendCloudConfig.from + '>',
        apiUser: sendCloudConfig.apiUser,
        apiKey: sendCloudConfig.apiKey
    });
}
exports.send = (param) => {
    return new Promise((resolve, reject) => {
        if (!client) {
            return reject('没有配置SendCloud');
        }
        let res = client.send({
            to: [param.to],
            subject: param.subject,
            html: param.html || param.text
        });
        if (res.message == 'success') {
            resolve();
        }
        else {
            reject(JSON.stringify(res));
        }
    });
};
/*
var nodemailer = require("nodemailer");
var config = require('../../configs/settings');

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP", {
  host: config.mail_opts.host,
  secureConnection: true, // 使用 SSL
  use_authentication: true,  //使用qq等邮箱需要配置
  port: config.mail_opts.port, // SMTP 端口
  auth: {
    user: config.mail_opts.auth.user,
    pass: config.mail_opts.auth.pass
  }
});

// 发送邮件
exports.send = function(options, callback){
  smtpTransport.sendMail({
    from: config.name+" <"+config.mail_opts.auth.user+">",
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html // html body
  }, callback);
};
*/

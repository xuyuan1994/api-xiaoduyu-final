"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 大鱼短信sdk
const sms_sdk_1 = __importDefault(require("@alicloud/sms-sdk"));
const aliyun_sdk_1 = __importDefault(require("aliyun-sdk"));
const config_1 = __importDefault(require("../../config"));
const { alicloud } = config_1.default;
// 短信
if (alicloud.sms && alicloud.accessKeyId && alicloud.secretAccessKey) {
    var smsClient = new sms_sdk_1.default({
        accessKeyId: alicloud.accessKeyId,
        secretAccessKey: alicloud.secretAccessKey
    });
}
exports.sendSMS = ({ PhoneNumbers, TemplateParam }) => {
    return new Promise((resolve, reject) => {
        if (!smsClient)
            return reject('未配置阿里云SMS');
        smsClient.sendSMS({
            PhoneNumbers,
            SignName: alicloud.sms.signName,
            TemplateCode: alicloud.sms.templateCode,
            TemplateParam: JSON.stringify(TemplateParam)
        }).then(function (res) {
            let { Code } = res;
            if (Code === 'OK') {
                //处理返回参数
                resolve();
            }
        }, function (err) {
            if (err && err.code == 'isv.MOBILE_NUMBER_ILLEGAL') {
                reject('无效的手机号');
            }
            else {
                reject('短信发送失败');
            }
        });
    });
};
// 推送通知
var push = null;
// 短信
if (alicloud.push && alicloud.accessKeyId && alicloud.secretAccessKey) {
    push = new aliyun_sdk_1.default.PUSH({
        accessKeyId: config_1.default.alicloud.accessKeyId,
        secretAccessKey: config_1.default.alicloud.secretAccessKey,
        endpoint: 'http://cloudpush.aliyuncs.com',
        apiVersion: '2016-08-01'
    });
}
// 给用户发送通知
exports.pushToAccount = ({ userId, title, body, summary, params }) => {
    if (!push)
        return;
    // https://help.aliyun.com/document_detail/32402.html
    // https://help.aliyun.com/document_detail/30084.html?spm=a2c4g.11186623.6.569.3452103beRtJhm
    // https://help.aliyun.com/document_detail/32402.html?spm=a2c4g.11186623.6.584.1cc44840FH9p2J
    // https://github.com/aliyun/alicloud-ams-demo/blob/master/OpenApi2.0/push-openapi-nodejs-demo/Push.js
    // ios
    push.push({
        AppKey: alicloud.push.iOSAppKey,
        Action: 'Push',
        //推送目标: DEVICE:按设备推送 ALIAS : 按别名推送 ACCOUNT:按帐号推送  TAG:按标签推送; ALL: 广播推送
        Target: 'ACCOUNT',
        //根据Target来设定，如Target=DEVICE, 则对应的值为 设备id1,设备id2. 多个值使用逗号分隔.(帐号与设备有一次最多100个的限制)
        TargetValue: userId,
        PushType: "NOTICE",
        //设备类型 ANDROID iOS ALL.
        DeviceType: "iOS",
        Title: title,
        Body: body,
        //iOS相关配置
        // iOSBadge: 5,//iOS应用图标右上角角标
        iOSSilentNotification: false,
        iOSMusic: 'default',
        iOSApnsEnv: config_1.default.debug ? 'DEV' : 'PRODUCT',
        iOSRemind: true,
        iOSRemindBody: "iOSReminfBody",
        iOSExtParameters: JSON.stringify(params),
    }, function (err, res) {
        if (err)
            console.log(err);
        // console.log(err, res);
    });
    // android
    push.push({
        AppKey: alicloud.push.androidAppKey,
        Action: 'Push',
        //推送目标: DEVICE:按设备推送 ALIAS : 按别名推送 ACCOUNT:按帐号推送  TAG:按标签推送; ALL: 广播推送
        Target: 'ACCOUNT',
        //根据Target来设定，如Target=DEVICE, 则对应的值为 设备id1,设备id2. 多个值使用逗号分隔.(帐号与设备有一次最多100个的限制)
        TargetValue: userId,
        PushType: "NOTICE",
        //设备类型 ANDROID iOS ALL.
        DeviceType: "ANDROID",
        Title: title,
        Body: body,
        //android相关配置
        AndroidNotifyType: "SOUND",
        AndroidNotificationBarType: 50,
        AndroidNotificationBarPriority: 2,
        AndroidOpenType: "APPLICATION",
        // AndroidOpenUrl: "http://www.aliyun.com", //Android收到推送后打开对应的url,仅当AndroidOpenType="URL"有效
        AndroidActivity: "com.xiaoduyureactnative.MainActivity",
        AndroidExtParameters: JSON.stringify(params),
        AndroidNotificationChannel: '1',
        AndroidPopupActivity: 'com.xiaoduyureactnative.MainActivity',
        AndroidPopupTitle: title,
        AndroidPopupBody: body,
        //推送控制
        //可以设置成你指定固定时间
        // PushTime: (new Date((new Date()).getTime() + 3600 * 1000)).toISOString().replace(/\.\d\d\d/g,''),
        // 离线消息的过期时间，过期则不会再被发送。离线消息最长保存72小时，过期时间时长不会超过发送时间加72小时。时间格式按照ISO8601标准表示，并需要使用UTC时间，格式为YYYY-MM-DDThh:mm:ssZ
        // ExpireTime: (new Date((new Date()).getTime() + 12 * 3600 * 1000)).toISOString().replace(/\.\d\d\d/g,''),
        StoreOffline: true //离线消息是否保存,若保存, 在推送时候，用户即使不在线，下一次上线则会收到
    }, function (err, res) {
        if (err)
            console.log(err);
        // console.log(err, res);
    });
    /*
    // ios
    push.push({
      AppKey: alicloud.push.iOSAppKey,
      DeviceType: 0,
      Target: 'account',
      TargetValue: userId,
      Type:1,
      Title: title,
      Body: body,
      ApnsEnv: config.debug ? 'DEV' : 'PRODUCT',
      // iOSMutableContent: true,
      iOSExtParameters: JSON.stringify(params),
      Summary: summary
    }, function (err: any, res: any) {
      console.log(err, res);
    });
    
    // android
    push.push({
      AppKey: alicloud.push.androidAppKey,
      DeviceType: 1,
      Target: 'account',
      TargetValue: userId,
      Type:1,
      Title: title,
      Body: body,
      ApnsEnv: config.debug ? 'DEV' : 'PRODUCT',
      AndroidExtParameters: JSON.stringify(params),
      Summary: summary
      // AndroidNotificationChannel: 1
    }, function (err: any, res: any) {
      console.log(err, res);
    });
    */
};

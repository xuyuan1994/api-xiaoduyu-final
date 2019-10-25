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
const captchapng_1 = __importDefault(require("captchapng"));
const models_1 = require("../models");
const to_1 = __importDefault(require("../utils/to"));
// 显示验证码图片
exports.showImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    let [err, result] = yield to_1.default(models_1.Captcha.findOne({
        query: { _id: id }
    }));
    if (err || !result) {
        res.status(404);
        res.send('404 not found');
        return;
    }
    var p = new captchapng_1.default(80, 30, result.captcha); // width,height,numeric captcha
    p.color(0, 0, 0, 0); // First color: background (red, green, blue, alpha)
    p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)
    var img = p.getBase64();
    var imgbase64 = new Buffer(img, 'base64');
    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(imgbase64);
    // const { token, buffer } = await captcha()
    // var imgbase64 = new Buffer(buffer,'base64');
    // res.writeHead(200, { 'Content-Type': 'image/png' });
    // res.end(imgbase64);
    /*
    var captcha = svgCaptcha.create({
      size: 6,
      text: '123333'
    });
  
    res.type('svg'); // 使用ejs等模板时如果报错 res.type('html')
      res.status(200).send(captcha.data);
    */
});

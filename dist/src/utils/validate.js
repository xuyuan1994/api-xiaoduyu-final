"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var validate = {
    /*
      * 昵称格式检测
      * @param  {string} string 昵称
      * @return {string}        结果信息
      */
    nickname: function (string) {
        var result = 'ok';
        // var regex = /^[a-z\d\u4E00-\u9FA5\-\_\.]+$/i;
        // var regex2 = /^([a-z\d\u4E00-\u9FA5])(.*)([a-z\d\u4E00-\u9FA5])$/i;
        switch (true) {
            case !string:
                result = 'blank error';
                break;
            case string.replace(/ /g, '').length == 0:
                result = 'blank error';
                break;
            case string.replace(/[^\x00-\xff]/g, 'xx').length > 20:
                result = 'invalid error';
                break;
            /*
            case !regex2.test(string):
              result = 'format error';
              break;
            case !regex.test(string):
              result = 'format error';
              break;
            */
        }
        return result;
    },
    /*
      * 邮箱地址格式检测
      * @param  {string} string 邮箱地址
      * @return {string}        结果信息
      */
    email: function (string) {
        var regex = /^([a-z0-9]{1,})([a-z0-9\.\_\-]{0,})@([a-z0-9\-]{1,})\.(?:[a-z]{2,}\.[a-z]{2,}|[a-z]{2,})$/;
        var result = 'ok';
        switch (true) {
            case !string:
                result = 'blank error';
                break;
            case string.length > 30:
                result = 'too long error';
                break;
            case !regex.test(string):
                result = 'invalid error';
                break;
        }
        return result;
    },
    /*
      * 密码格式检测
      * @param  {string} string 密码
      * @return {string}        结果信息
      */
    password: function (string) {
        var result = 'ok';
        switch (true) {
            case !string:
                result = 'blank error';
                break;
            case string.length < 6:
                result = 'invalid error';
                break;
            case string.length > 30:
                result = 'too long error';
                break;
        }
        return result;
    },
    /*
      * 日期检测
      * @param  {string} date 日期格式2014-11-29
      * @return {string}      结果信息
      */
    date: function (date) {
        var regex = /^(\d{4})\-(\d{2})\-(\d{2})$/;
        var year = new Date(date).getFullYear();
        var month = new Date(date).getMonth() + 1;
        var day = new Date(year).getDate();
        var days = new Date(year, parseInt(month, 10), 0).getDate();
        var result = 'ok';
        if (!regex.test(date) ||
            isNaN(year) || isNaN(month) || isNaN(day) || isNaN(days) ||
            year <= 0 || month <= 0 || month > 12 || day <= 0 || day > 31 || day > days) {
            result = 'invalid error';
        }
        return result;
    },
    /*
      * 日期格式检测
      * @param  {number} year 年
      * @param  {number} month 月
      * @param  {number} day 日
      * @return {string}        结果信息
      */
    birthday: function (date) {
        var result = validate.date(date);
        if (result === 'ok') {
            var currentYear = new Date().getFullYear();
            var year = new Date(date).getFullYear();
            if (year > currentYear || year < currentYear - 110) {
                result = 'invalid error';
            }
        }
        return result;
    },
    /*
      * 身高范围检测
      * @param  {number} height 身高
      * @return {string}        结果信息
      */
    /*
    height: function(height) {
  
      var result = 'ok';
  
      if (isNaN(height) || height <= 54 || height > 272) {
        result = 'invalid error';
      }
      return result;
    },
    */
    /*
      * 体重范围检测
      * @param  {number} weight 体重
      * @return {string}        结果信息
      */
    /*
    weight: function(weight) {
  
      var result = 'ok';
  
      if (isNaN(weight) || weight <= 2 || weight > 635) {
        result = 'invalid error';
      }
      return result;
    },
    */
    /*
      * 血型
      * @param  {string} blood 体重
      * @return {string}        结果信息
      */
    blood: function (blood) {
        var result = 'ok';
        if (!blood || blood === 'A' || blood === 'B' || blood === 'AB' || blood === 'O') {
        }
        else {
            result = 'invalid error';
        }
        return result;
    },
    /*
      * 性别
      * @param  {string or number} gender 性别, 1男／0女
      * @return {string}        结果信息
      */
    gender: function (gender) {
        var result = 'ok';
        if (gender === 1 || gender === 0) {
        }
        else {
            result = 'invalid error';
        }
        return result;
    },
};
exports.default = validate;

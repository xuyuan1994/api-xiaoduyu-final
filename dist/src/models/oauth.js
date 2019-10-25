"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schemas_1 = require("../schemas");
const base_method_1 = __importDefault(require("./base-method"));
const social_1 = __importDefault(require("../../config/social"));
/*
const sources = {
  'qq': 0,
  'weibo': 1,
  'github': 2,
  'wechat': 3
};
*/
/**
 * Oauth 查询类
 * @extends Model
 */
class OauthModel extends base_method_1.default {
    /**
     * 通过用户id和来源条件查询用户
     * @param  {String} userId  用户的id
     * @param  {Int} _source 来源id
     * @return {Object} Promise
     */
    fetchByUserIdAndSource(userId, _source) {
        return this.findOne({
            query: { user_id: userId, source: social_1.default[_source] }
        });
    }
    fetchByOpenIdAndSource(openid, _source) {
        return this.findOne({
            query: { openid, source: social_1.default[_source] }
        });
    }
}
exports.default = new OauthModel(schemas_1.Oauth);

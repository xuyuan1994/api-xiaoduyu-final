"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schemas_1 = require("../schemas");
const base_method_1 = __importDefault(require("./base-method"));
class Model extends base_method_1.default {
    create(data) {
        data.captcha = Math.round(900000 * Math.random() + 100000);
        return this.save({ data });
    }
}
exports.default = new Model(schemas_1.Captcha);

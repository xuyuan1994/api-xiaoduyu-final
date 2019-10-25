"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schemas_1 = require("../schemas");
const base_method_1 = __importDefault(require("./base-method"));
exports.default = new base_method_1.default(schemas_1.Account);

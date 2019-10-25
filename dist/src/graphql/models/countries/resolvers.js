"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const countries_1 = __importDefault(require("../../../../config/countries"));
const countries = () => countries_1.default;
exports.query = { countries };
exports.mutation = {};

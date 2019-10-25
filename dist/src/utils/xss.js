"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const xss_1 = __importDefault(require("xss"));
exports.default = (content_html) => {
    content_html = xss_1.default(content_html, {
        whiteList: {
            a: ['href', 'title', 'target', 'rel'],
            img: ['src', 'alt'],
            p: [],
            div: [],
            br: [],
            blockquote: [],
            li: [],
            ol: [],
            ul: [],
            strong: [],
            em: [],
            u: [],
            pre: [],
            b: [],
            h1: [],
            h2: [],
            h3: [],
            h4: [],
            h5: [],
            h6: [],
            h7: [],
            video: []
        },
        stripIgnoreTag: true,
        onIgnoreTagAttr: function (tag, name, value, isWhiteAttr) {
            if (tag == 'div' && name.substr(0, 5) === 'data-') {
                // 通过内置的escapeAttrValue函数来对属性值进行转义
                return name + '="' + xss_1.default.escapeAttrValue(value) + '"';
            }
        }
    });
    return content_html;
};

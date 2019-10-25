"use strict";
/**
 * [合成]将字符串中的变量，替换成值
 *
 * @param  {String}  str      合成的字符串
 * @param  {object}  values   合成的对象
 * @return {String}
 *
 * 使用例子
 * @example
 * synthesis(
 *   'hello {name} {test}',
 *   {
 *     name: 'world',
 *     test: '!!!'
 *   }
 * );
 *
 * @output
 * hello world !!!
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
const synthesis = (str, key, value) => {
    return str.replace(new RegExp("({" + key + "})", "g"), value);
};
exports.default = (str, values) => {
    Reflect.ownKeys(values).map((key) => {
        str = synthesis(str, key, values[key]);
    });
    return str;
};

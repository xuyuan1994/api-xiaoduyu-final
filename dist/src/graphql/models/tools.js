"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArguments = (params) => {
    let schema = ``;
    for (let i in params) {
        schema += `
      #${params[i]().desc}${params[i]().role == 'admin' ? ' (管理员)' : ''}
      ${i}:${params[i]().type}
    `;
    }
    return schema;
};
const get = (type) => {
    return ({ args = {}, model, role = '' }) => {
        let err, params = {};
        for (let i in args) {
            if (!model[i]) {
                err = i + ' is invalid';
                break;
            }
            let result = model[i](args[i]);
            if (result.typename != type) {
                continue;
            }
            if (result.role && role != result.role) {
                err = i + ' no access';
                break;
            }
            if (result.name) {
                if (typeof result.value == 'object') {
                    if (!params[result.name])
                        params[result.name] = {};
                    for (let n in result.value)
                        params[result.name][n] = result.value[n];
                }
                else {
                    params[result.name] = result.value;
                }
            }
        }
        if (type == 'option') {
            // limit默认值
            if (!params.limit) {
                params.limit = 30;
            }
            else if (params.limit > 300) {
                // limit 最大值
                params.limit = 300;
            }
            params.skip = !params.skip ? 0 : params.skip * params.limit;
        }
        return [err, params];
    };
};
exports.getQuery = get('query');
exports.getOption = get('option');
exports.getSave = get('save');

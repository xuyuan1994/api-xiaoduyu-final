"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_errors_1 = require("apollo-errors");
/*
export const FooError = createError('FooError', {
  message: 'A foo error has occurred'
});

// 更新错误
export const UpdateError = createError('updateError', {
  message: 'update error'
});

export const RejectedError = createError('rejectedError', {
  message: 'the request was rejected'
});
*/
exports.default = ({ message, data = {} }) => {
    let error = apollo_errors_1.createError('error', {
        message,
        data
    });
    return new error(data);
};

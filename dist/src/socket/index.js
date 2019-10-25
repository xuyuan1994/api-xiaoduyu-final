"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = __importDefault(require("socket.io"));
const JWT = __importStar(require("../utils/jwt"));
// 总连接数
let connectCount = 0, 
// 在线用户id
onlineMember = [], 
// 在线游客
onlineVisitor = [], io;
exports.default = (server) => {
    io = socket_io_1.default.listen(server);
    // io.set('transports', ['websocket', 'xhr-polling', 'jsonp-polling', 'htmlfile', 'flashsocket']);
    // io.set('origins', 'http://127.0.0.1:4000');
    // 广播在线用户
    const updateOnline = (sockets = io.sockets) => {
        sockets.emit('online-user', {
            // 连接数
            connect: connectCount,
            // 在线会员
            member: Array.from(new Set([...onlineMember])).length,
            // 在线游客
            visitor: Array.from(new Set([...onlineVisitor])).length
        });
    };
    let timer = function () {
        setTimeout(() => {
            updateOnline();
            timer();
        }, 1000 * 60);
    };
    timer();
    io.on('connection', function (socket) {
        // 获取客户端用户的id
        const { accessToken } = socket.handshake.query;
        let userId = '';
        if (accessToken) {
            // 解码JWT获取用户的id
            let res = JWT.decode(accessToken);
            userId = res && res.user_id ? res.user_id : '';
        }
        let address = '';
        try {
            address = socket.handshake.headers["x-real-ip"];
        }
        catch (err) {
            console.log(err);
            address = socket.handshake.address;
            address = address.replace(/^.*:/, '');
        }
        // 获取客户端ip
        // let address = socket.handshake.address;
        // console.log(address);
        // address = address.replace(/^.*:/, '');
        if (userId) {
            onlineMember.push(userId);
        }
        else {
            onlineVisitor.push(address);
        }
        connectCount += 1;
        // updateOnline();
        socket.on('disconnect', function (res) {
            connectCount -= 1;
            if (userId) {
                onlineMember.some((id, index) => {
                    if (id == userId) {
                        onlineMember.splice(index, 1);
                        return true;
                    }
                    return false;
                });
            }
            else {
                onlineVisitor.some((ip, index) => {
                    if (ip == address) {
                        onlineVisitor.splice(index, 1);
                        return true;
                    }
                    return false;
                });
            }
            // updateOnline();
        });
        updateOnline(socket);
    });
};
exports.emit = (target, params) => {
    if (io) {
        io.sockets.emit(target, JSON.stringify(params));
    }
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocketConnection = exports.socketHelper = void 0;
const colors_1 = __importDefault(require("colors"));
const logger_1 = require("../shared/logger");
const socket = (io) => {
    io.on('connection', socket => {
        logger_1.logger.info(colors_1.default.blue('A user connected'));
        //disconnect
        socket.on('disconnect', () => {
            logger_1.logger.info(colors_1.default.red('A user disconnect'));
        });
    });
};
exports.socketHelper = { socket };
const initializeSocketConnection = (io) => {
    io.on('connection', socket => {
        logger_1.logger.info(colors_1.default.blue('A user connected with chat'));
        //send msg
        socket.on('message', (data) => {
            console.log(data);
            io.emit('receive', data);
        });
        //disconnect
        socket.on('disconnect', () => {
            logger_1.logger.info(colors_1.default.red('A user disconnect with chat'));
        });
    });
};
exports.initializeSocketConnection = initializeSocketConnection;

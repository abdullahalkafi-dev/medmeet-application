"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = require("./app");
const config_1 = __importDefault(require("./config"));
const DB_1 = __importDefault(require("./DB"));
const logger_1 = require("./shared/logger");
const socket_1 = require("./app/socket/socket");
//uncaught exception
process.on('uncaughtException', error => {
    logger_1.errorLogger.error('UnhandledException Detected', error, error);
    process.exit(1);
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, DB_1.default)();
            mongoose_1.default.connect(config_1.default.database_url);
            logger_1.logger.info(colors_1.default.green('🚀 Database connected successfully'));
            const port = typeof config_1.default.port === 'number' ? config_1.default.port : Number(config_1.default.port);
            app_1.server.listen(port, config_1.default.ip_address, () => {
                logger_1.logger.info(colors_1.default.yellow(`♻️  Application listening on port:${config_1.default.port}`));
            });
            //socket
            (0, socket_1.setupSocket)(app_1.server);
        }
        catch (error) {
            console.log(error);
            logger_1.errorLogger.error(colors_1.default.red('🤢 Failed to connect Database'));
        }
        //handle unhandledRejection
        process.on('unhandledRejection', error => {
            if (app_1.server) {
                app_1.server.close(() => {
                    logger_1.errorLogger.error('UnhandledRejection Detected', error, error);
                    process.exit(1);
                });
            }
            else {
                process.exit(1);
            }
        });
    });
}
main();
//SIGTERM
process.on('SIGTERM', () => {
    logger_1.logger.info('SIGTERM IS RECEIVE');
    if (app_1.server) {
        app_1.server.close();
    }
});

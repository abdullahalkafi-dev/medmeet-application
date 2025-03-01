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
exports.checkExpiredSubscriptions = void 0;
const cors_1 = __importDefault(require("cors"));
const colors_1 = __importDefault(require("colors"));
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = require("http-status-codes");
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const routes_1 = __importDefault(require("./routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgen_1 = require("./shared/morgen");
const subscribtion_model_1 = require("./app/modules/subscribtion/subscribtion.model");
const cornJobHelper_1 = require("./util/cornJobHelper");
const node_cron_1 = __importDefault(require("node-cron"));
const user_model_1 = require("./app/modules/user/user.model");
const logger_1 = require("./shared/logger");
const AppError_1 = __importDefault(require("./app/errors/AppError"));
const app = (0, express_1.default)();
//morgan
app.use(morgen_1.Morgan.successHandler);
app.use(morgen_1.Morgan.errorHandler);
//body parser
// app.use(cors());
app.use((0, cors_1.default)({
    origin: '*',
    credentials: true,
}));
//webhook
// app.post(
//   '/webhook',
//   express.raw({ type: 'application/json' }),
//   SubscriptationController.stripeWebhookController
// );
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
//file retrieve
app.use(express_1.default.static('uploads'));
//router
app.use('/api/v1', routes_1.default);
const checkExpiredSubscriptions = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentDate = new Date();
        const subscriptions = yield subscribtion_model_1.Subscribation.find({ status: 'active' }).exec();
        for (const subscription of subscriptions) {
            const currentPeriodEnd = subscription.currentPeriodEnd;
            if (currentPeriodEnd) {
                try {
                    const expirationDate = (0, cornJobHelper_1.parseCustomDateFormat)(currentPeriodEnd);
                    // Check if the subscription's current period has expired
                    if (expirationDate <= currentDate) {
                        // Expire the subscription
                        yield subscribtion_model_1.Subscribation.updateOne({ _id: subscription._id }, { status: 'expired' });
                        const user = yield user_model_1.User.findOneAndUpdate({ _id: subscription.user }, { $set: { subscription: false } }, { new: true });
                        // Check if the user update was successful
                        if (user) {
                            logger_1.logger.info(colors_1.default.green(`User ${user._id} subscription set to false.`));
                        }
                        else {
                            logger_1.logger.info(colors_1.default.red(`Failed to update user subscription for subscription ${subscription._id}.`));
                        }
                        logger_1.logger.info(colors_1.default.yellow(`Subscription ${subscription._id} updated to expired.`));
                    }
                }
                catch (error) {
                    logger_1.logger.info(colors_1.default.red(`Error parsing date for subscription ${subscription._id}: ${error}`));
                }
            }
        }
    }
    catch (error) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, `Error updating subscriptions: ${error}`);
    }
});
exports.checkExpiredSubscriptions = checkExpiredSubscriptions;
// Schedule the cron job to run every hour
node_cron_1.default.schedule('* * * * *', exports.checkExpiredSubscriptions);
//live response
app.get('/', (req, res) => {
    res.send('<h1 style="text-align:center; color:#A55FEF; font-family:Verdana;">Hey, How can I assist you today!</h1>');
});
//global error handle
app.use(globalErrorHandler_1.default);
//handle not found route;
app.use((req, res) => {
    res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Not found',
        errorMessages: [
            {
                path: req.originalUrl,
                message: "API DOESN'T EXIST",
            },
        ],
    });
});
exports.default = app;

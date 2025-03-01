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
exports.SubscriptionController = void 0;
const subscribtion_service_1 = require("./subscribtion.service");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const createSession = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { plan } = req.query;
    // Check if 'plan' is not undefined and is a string
    if (!plan || typeof plan !== 'string') {
        return res.status(400).send('Plan is required and must be a single string');
    }
    const result = yield subscribtion_service_1.subscriptionService.createCheckoutSession(plan.toLowerCase() // This is safe now as we have confirmed 'plan' is a string
    );
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Subscription created successfully',
        data: result,
    });
}));
const Success = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscribtion_service_1.subscriptionService.retrieveSession(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Subscription successful',
        data: result,
    });
}));
const customerPortal = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscribtion_service_1.subscriptionService.createBillingPortal(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'createBillingPortal successful',
        data: result,
    });
}));
const webhookHandler = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const signature = req.headers['stripe-signature'];
    const result = yield subscribtion_service_1.subscriptionService.handleWebhook(req.body);
    console.log({ result });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'webhookHandler successful',
        data: result,
    });
}));
// subscribtion.controller.ts
const createSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { packages, user } = req.body;
    try {
        const result = yield subscribtion_service_1.subscriptionService.createCustomerAndSubscription(user, packages);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Subscription created successfully',
            data: result,
        });
    }
    catch (error) {
        return res.status(500);
    }
}));
const handlePaymentSuccess = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, subscriptionId } = req.body;
    try {
        const result = yield subscribtion_service_1.subscriptionService.handlePaymentSuccess(userId, subscriptionId);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'payment successfully',
            data: result,
        });
    }
    catch (error) {
        return res.status(500);
    }
}));
// const updateSubscription = catchAsync(async (req: Request, res: Response) => {
//   const { subscriptionId, newPriceId } = req.body;
//   const result = await subscriptionService.updateustomerAndSubscription(
//     newPriceId,
//     subscriptionId
//   );
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: 'Subscription updated successfully',
//     data: result,
//   });
// });
const updateSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const userId = req.user.id;
    const { packages, userId } = req.body;
    const result = yield subscribtion_service_1.subscriptionService.updateustomerAndSubscription(packages, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Subscription updated successfully',
        data: result,
    });
}));
// const CancelSubscription = catchAsync(async (req, res) => {
//   const { subscriptionId } = req.body;
//   const result = await subscriptionService.cancelSubscription(subscriptionId);
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: 'Subscription canceled successfully',
//     data: result,
//   });
// });
const CancelSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    const result = yield subscribtion_service_1.subscriptionService.cancelSubscription(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Subscription canceled successfully',
        data: result,
    });
}));
// const renewExpiredSubscription = catchAsync(async (req, res) => {
//   const { subscriptionId, newPriceId } = req.body;
//   const result = await subscriptionService.renewExpiredSubscriptions(
//     subscriptionId,
//     newPriceId
//   );
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: 'Expired subscriptions renewed successfully',
//     data: result,
//   });
// });
const renewExpiredSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const userId = req.user.id;
    const { packages, userId } = req.body;
    const result = yield subscribtion_service_1.subscriptionService.renewExpiredSubscriptions(userId, packages);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Expired subscriptions renewed successfully',
        data: result,
    });
}));
const getAllSubscriptation = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscribtion_service_1.subscriptionService.getAllSubscriptation();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'subscriptions retrived successfully',
        data: result,
    });
}));
const getAllSubscriptationForBrand = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const query = Object.assign(Object.assign({}, req.query), { userId });
    const result = yield subscribtion_service_1.subscriptionService.getAllSubscriptationForBrand(query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'subscriptions for brand retrived successfully',
        data: result,
    });
}));
exports.SubscriptionController = {
    createSession,
    Success,
    customerPortal,
    webhookHandler,
    createSubscription,
    updateSubscription,
    CancelSubscription,
    renewExpiredSubscription,
    getAllSubscriptation,
    getAllSubscriptationForBrand,
    handlePaymentSuccess,
};

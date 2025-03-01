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
exports.SubscriptationController = void 0;
const stripe_1 = require("../../../shared/stripe");
const config_1 = __importDefault(require("../../../config"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const subs_service_1 = require("./subs.service");
const createCheckoutSessionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, planId } = req.body;
    try {
        const sessionUrl = yield subs_service_1.SubscriptationService.createCheckoutSessionService(userId, planId);
        res.status(200).json({ url: sessionUrl });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create checkout session' });
    }
});
const stripeWebhookController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sig = req.headers['stripe-signature'];
    try {
        const event = stripe_1.stripe.webhooks.constructEvent(req.body, sig, config_1.default.webhook_secret);
        yield subs_service_1.SubscriptationService.handleStripeWebhookService(event);
        res.status(200).send({ received: true });
    }
    catch (err) {
        console.error('Error in Stripe webhook');
        res.status(400).send(`Webhook Error:`);
    }
});
const getAllSubscriptation = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const result = yield subs_service_1.SubscriptationService.getSubscribtionService(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Subscriptation retrived successfully',
        data: result,
    });
}));
const cancelSubscriptation = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subs_service_1.SubscriptationService.cancelSubscriptation(req.params.userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Subscriptation canceled successfully',
        data: result,
    });
}));
const getAllSubs = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subs_service_1.SubscriptationService.getAllSubs(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Subscriptation retrived successfully',
        data: result,
    });
}));
const updateSubs = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, newPlanId } = req.body;
    const result = yield subs_service_1.SubscriptationService.updateSubscriptionPlanService(userId, newPlanId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Subscriptation updated successfully',
        data: result,
    });
}));
exports.SubscriptationController = {
    createCheckoutSessionController,
    stripeWebhookController,
    getAllSubscriptation,
    cancelSubscriptation,
    getAllSubs,
    updateSubs,
};

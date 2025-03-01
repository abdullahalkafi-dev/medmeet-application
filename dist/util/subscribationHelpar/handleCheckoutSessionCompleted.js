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
Object.defineProperty(exports, "__esModule", { value: true });
const subscribtion_model_1 = require("../../app/modules/subscribtion/subscribtion.model");
const subscribtion_service_1 = require("../../app/modules/subscribtion/subscribtion.service");
const timeFormat_1 = require("../../app/modules/subscribtion/timeFormat");
const handleCheckoutSessionCompleted = (session) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const customerId = session.customer;
        const subscriptionId = session.subscription;
        const plan = session.subscription || 'unknown';
        const status = 'active';
        const stripeSubscription = yield subscribtion_service_1.stripe.subscriptions.retrieve(subscriptionId);
        const { current_period_end, current_period_start } = stripeSubscription;
        // Divide amount_total by 100 to convert from cents to dollars
        const priceAmount = (session.amount_total || 0) / 100;
        const email = session.customer_email;
        const name = ((_a = session.customer_details) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown';
        yield subscribtion_model_1.Subscribation.create({
            subscriptionId,
            status,
            priceAmount,
            currentPeriodEnd: (0, timeFormat_1.formatDate)(new Date(current_period_end * 1000)),
            currentPeriodStart: (0, timeFormat_1.formatDate)(new Date(current_period_start * 1000)),
        });
    }
    catch (error) {
        console.error('Error handling checkout session completed:', error);
    }
});
exports.default = handleCheckoutSessionCompleted;

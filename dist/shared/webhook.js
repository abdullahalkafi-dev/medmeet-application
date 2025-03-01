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
exports.WebhookService = void 0;
const stripe_1 = require("./stripe");
const subs_model_1 = require("../app/modules/subs/subs.model");
const mongoose_1 = require("mongoose");
const user_model_1 = require("../app/modules/user/user.model");
const handleCheckoutSessionCompleted = (session) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount_total, metadata, payment_intent } = session;
    const userId = metadata === null || metadata === void 0 ? void 0 : metadata.userId;
    const planId = metadata === null || metadata === void 0 ? void 0 : metadata.planId;
    const products = JSON.parse((metadata === null || metadata === void 0 ? void 0 : metadata.products) || '[]');
    const email = session.customer_email || '';
    const amountTotal = (amount_total !== null && amount_total !== void 0 ? amount_total : 0) / 100;
    const subscription = yield stripe_1.stripe.subscriptions.retrieve(session.subscription);
    const startDate = new Date(subscription.start_date * 1000);
    const endDate = new Date(subscription.current_period_end * 1000);
    const paymentRecord = new subs_model_1.Subscribtion({
        amount: amountTotal,
        user: new mongoose_1.Types.ObjectId(userId),
        plan: new mongoose_1.Types.ObjectId(planId),
        products,
        email,
        transactionId: payment_intent,
        startDate,
        endDate,
        status: 'Pending',
        subscriptionId: session.subscription,
        stripeCustomerId: session.customer,
    });
    yield paymentRecord.save();
});
// Function to handle invoice.payment_succeeded event
const handleInvoicePaymentSucceeded = (invoice) => __awaiter(void 0, void 0, void 0, function* () {
    const subscription = yield subs_model_1.Subscribtion.findOne({
        subscriptionId: invoice.subscription,
    });
    if (subscription) {
        subscription.status = 'active';
        yield subscription.save();
    }
    const user = yield user_model_1.User.findById(subscription === null || subscription === void 0 ? void 0 : subscription.user);
    yield user_model_1.User.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user._id, {
        $set: { subscription: true },
    });
});
// Function to handle invoice.payment_failed event
const handleInvoicePaymentFailed = (invoice) => __awaiter(void 0, void 0, void 0, function* () {
    const subscription = yield subs_model_1.Subscribtion.findOne({
        subscriptionId: invoice.subscription,
    });
    if (subscription) {
        subscription.status = 'expired'; // Update status to expired
        yield subscription.save();
    }
    const user = yield user_model_1.User.findById(subscription === null || subscription === void 0 ? void 0 : subscription.user);
    if (user) {
        yield user_model_1.User.findByIdAndUpdate(user._id, {
            $set: { subscription: false }, // Update user subscription status
        });
    }
});
// Function to handle checkout.session.async_payment_failed event
const handleAsyncPaymentFailed = (session) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield subs_model_1.Subscribtion.findOne({
        stripeCustomerId: session.customer,
    });
    if (payment) {
        payment.status = 'Failed';
        yield payment.save();
    }
});
// Function to handle customer.subscription.deleted event
const handleSubscriptionDeleted = (subscription) => __awaiter(void 0, void 0, void 0, function* () {
    const existingSubscription = yield subs_model_1.Subscribtion.findOne({
        subscriptionId: subscription.id,
    });
    if (existingSubscription) {
        existingSubscription.status = 'expired'; // Mark as expired
        yield existingSubscription.save();
        const user = yield user_model_1.User.findById(existingSubscription.user);
        if (user) {
            yield user_model_1.User.findByIdAndUpdate(user._id, {
                $set: { subscription: false },
            });
        }
    }
});
exports.WebhookService = {
    handleCheckoutSessionCompleted,
    handleInvoicePaymentSucceeded,
    handleInvoicePaymentFailed,
    handleAsyncPaymentFailed,
    handleSubscriptionDeleted,
};

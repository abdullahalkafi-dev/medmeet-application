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
exports.SubscriptationService = void 0;
const stripe_1 = require("../../../shared/stripe");
const plan_model_1 = require("../plan/plan.model");
const user_model_1 = require("../user/user.model");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const http_status_codes_1 = require("http-status-codes");
const webhook_1 = require("../../../shared/webhook");
const subs_model_1 = require("./subs.model");
const createCheckoutSessionService = (userId, planId) => __awaiter(void 0, void 0, void 0, function* () {
    const isUser = yield user_model_1.User.findById(userId);
    try {
        const plan = yield plan_model_1.Plan.findById(planId);
        if (!plan) {
            throw new Error('Plan not found');
        }
        // Create a checkout session for a subscription
        const session = yield stripe_1.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: plan.priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: 'https://yourapp.com/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'https://yourapp.com/cancel',
            metadata: {
                userId,
                planId,
            },
            customer_email: isUser === null || isUser === void 0 ? void 0 : isUser.email,
        });
        // Return the checkout session URL
        return session.url;
    }
    catch (error) {
        throw new Error('Failed to create checkout session');
    }
});
const handleStripeWebhookService = (event) => __awaiter(void 0, void 0, void 0, function* () {
    switch (event.type) {
        case 'checkout.session.completed':
            webhook_1.WebhookService.handleCheckoutSessionCompleted(event.data.object);
            break;
        case 'invoice.payment_succeeded':
            webhook_1.WebhookService.handleInvoicePaymentSucceeded(event.data.object);
            break;
        case 'invoice.payment_failed':
            webhook_1.WebhookService.handleInvoicePaymentFailed(event.data.object);
            break;
        case 'checkout.session.async_payment_failed':
            webhook_1.WebhookService.handleAsyncPaymentFailed(event.data.object);
            break;
        case 'customer.subscription.deleted':
            webhook_1.WebhookService.handleSubscriptionDeleted(event.data.object);
            break;
        default:
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid event type');
    }
});
const getSubscribtionService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const subscription = yield subs_model_1.Subs.findOne({ user: userId });
    if (!subscription) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Subscribtion not found');
    }
    return subscription;
});
const cancelSubscriptation = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isUser = yield user_model_1.User.findById(userId);
    if (!isUser) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User not found');
    }
    const subscription = yield subs_model_1.Subs.findOne({ user: userId });
    if (!subscription) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Subscribtion not found');
    }
    const updatedSubscription = yield stripe_1.stripe.subscriptions.update(subscription.subscriptionId, {
        cancel_at_period_end: true,
    });
    if (!updatedSubscription) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Subscribtion not cancel');
    }
    const updatedSub = yield subs_model_1.Subs.findOneAndUpdate({ user: userId }, { status: 'cancel' }, { new: true });
    return updatedSub;
});
const getAllSubs = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit } = query;
    const anyConditions = [{ status: 'active' }];
    const whereConditions = anyConditions.length > 0 ? { $and: anyConditions } : {};
    // Pagination setup
    const pages = parseInt(page) || 1;
    const size = parseInt(limit) || 10;
    const skip = (pages - 1) * size;
    // Fetch campaigns
    const result = yield subs_model_1.Subs.find(whereConditions)
        .populate('user', 'fullName')
        .populate('plan', 'name unitAmount interval')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(size)
        .lean();
    const count = yield subs_model_1.Subs.countDocuments(whereConditions);
    return {
        result,
        meta: {
            page: pages,
            total: count,
        },
    };
});
const updateSubscriptionPlanService = (userId, newPlanId) => __awaiter(void 0, void 0, void 0, function* () {
    // Step 1: Fetch the user
    const isUser = yield user_model_1.User.findById(userId);
    if (!isUser) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User not found');
    }
    // Step 2: Fetch the user's subscription
    const subscription = yield subs_model_1.Subs.findOne({ user: userId });
    if (!subscription) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Subscription not found');
    }
    // Step 3: Fetch the new plan details
    const newPlan = yield plan_model_1.Plan.findById(newPlanId);
    if (!newPlan) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'New plan not found');
    }
    // Step 4: Fetch the current subscription from Stripe
    const stripeSubscription = yield stripe_1.stripe.subscriptions.retrieve(subscription.subscriptionId);
    if (!stripeSubscription) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Stripe subscription not found');
    }
    // Step 5: Update the subscription in Stripe
    const updatedStripeSubscription = yield stripe_1.stripe.subscriptions.update(subscription.subscriptionId, {
        items: [
            {
                id: stripeSubscription.items.data[0].id,
                price: newPlan.priceId, // The new plan's price ID
            },
        ],
        proration_behavior: 'create_prorations', // Optional: set based on your requirements
    });
    if (!updatedStripeSubscription) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Stripe subscription update failed');
    }
    // // Step 6: Retrieve the upcoming invoice to calculate proration
    const invoicePreview = yield stripe_1.stripe.invoices.retrieveUpcoming({
        customer: updatedStripeSubscription.customer,
        subscription: updatedStripeSubscription.id,
    });
    const prorationAmount = (invoicePreview.total || 0) / 100;
    // Step 7: Update the local database with the actual charged amount (proration)
    const updatedSub = yield subs_model_1.Subs.findByIdAndUpdate(subscription._id, {
        plan: newPlanId,
        amount: prorationAmount,
        startDate: new Date(invoicePreview.period_start * 1000),
        endDate: new Date(invoicePreview.period_end * 1000),
    }, { new: true });
    if (updatedSub) {
        updatedSub.status = 'active';
        yield updatedSub.save();
    }
    return updatedSub;
});
exports.SubscriptationService = {
    createCheckoutSessionService,
    handleStripeWebhookService,
    getSubscribtionService,
    cancelSubscriptation,
    getAllSubs,
    updateSubscriptionPlanService,
};

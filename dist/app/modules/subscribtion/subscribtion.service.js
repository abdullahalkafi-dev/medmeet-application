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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionService = exports.stripe = void 0;
const stripe_1 = __importDefault(require("stripe"));
const config_1 = __importDefault(require("../../../config"));
const handleCheckoutSessionCompleted_1 = __importDefault(require("../../../util/subscribationHelpar/handleCheckoutSessionCompleted"));
const handleInvoicePaymentSucceeded_1 = __importDefault(require("../../../util/subscribationHelpar/handleInvoicePaymentSucceeded"));
const handleSubscriptionUpdated_1 = __importDefault(require("../../../util/subscribationHelpar/handleSubscriptionUpdated"));
const subscribtion_model_1 = require("./subscribtion.model");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const http_status_codes_1 = require("http-status-codes");
const timeFormat_1 = require("./timeFormat");
const user_model_1 = require("../user/user.model");
const package_model_1 = require("../package/package.model");
exports.stripe = new stripe_1.default(config_1.default.stripe_secret_key, {
    apiVersion: '2024-09-30.acacia',
});
const createCheckoutSession = (plan) => __awaiter(void 0, void 0, void 0, function* () {
    let priceId;
    switch (plan) {
        case 'silver':
            priceId = 'price_1QMpqdLMVhw2FMhmPIUvtr7X';
            break;
        case 'gold':
            priceId = 'price_1QMppyLMVhw2FMhmQTrE5gIZ';
            break;
        case 'discount':
            priceId = 'price_1QCEloLMVhw2FMhmnDUnFb5C';
            break;
        default:
            throw new Error('Subscribe plan not found');
    }
    // golde=price_1QBC03LMVhw2FMhm8Cz0srZZ
    // silver=price_1QBBzCLMVhw2FMhmLXzkcML7
    // pro=price_1QBagbLMVhw2FMhmsaXzQPsn
    const session = yield exports.stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'http://localhost:3000/cancel',
    });
    return session;
});
const retrieveSession = (sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield exports.stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['subscription'],
    });
});
const createBillingPortal = (customerId) => __awaiter(void 0, void 0, void 0, function* () {
    const portalSession = yield exports.stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `http://localhost:3000/`,
    });
    return portalSession;
});
const handleWebhook = (event) => __awaiter(void 0, void 0, void 0, function* () {
    switch (event.type) {
        case 'checkout.session.completed':
            yield (0, handleCheckoutSessionCompleted_1.default)(event.data.object);
            break;
        case 'invoice.payment_succeeded':
            yield (0, handleInvoicePaymentSucceeded_1.default)(event.data.object);
            break;
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
            yield (0, handleSubscriptionUpdated_1.default)(event.data.object);
            break;
        default:
            console.log('Unhandled event type: ', event.type);
            break;
    }
});
const createCustomerAndSubscription = (user, packages) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const pack = yield package_model_1.Package.findById(packages);
    const priceId = pack === null || pack === void 0 ? void 0 : pack.productId;
    const users = yield user_model_1.User.findById(user);
    const email = users === null || users === void 0 ? void 0 : users.email;
    // Create customer
    const customer = yield exports.stripe.customers.create({
        email,
    });
    // Create subscription
    const subscription = yield exports.stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
    });
    const priceAmount = (_c = (_b = (_a = subscription.items.data[0]) === null || _a === void 0 ? void 0 : _a.price) === null || _b === void 0 ? void 0 : _b.unit_amount) !== null && _c !== void 0 ? _c : 0;
    const price = priceAmount / 100;
    // Check if latest_invoice exists and is of type Invoice
    const latestInvoice = subscription.latest_invoice;
    if (!latestInvoice || typeof latestInvoice === 'string') {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Invalid latest invoice format.');
    }
    // Check if payment_intent exists and is of type PaymentIntent
    const paymentIntent = latestInvoice.payment_intent;
    if (!paymentIntent || typeof paymentIntent === 'string') {
        throw new Error('Failed to retrieve payment intent from latest_invoice.');
    }
    const allSubscriptationValue = {
        transactionId: paymentIntent.id,
        subscriptionId: subscription.id,
        clientSecret: paymentIntent.client_secret,
    };
    console.log(allSubscriptationValue);
    const createSub = yield subscribtion_model_1.Subscribation.create({
        // transactionId: paymentIntent.id,
        subscriptionId: subscription.id,
        status: subscription.status,
        // clientSecret: paymentIntent.client_secret,
        currentPeriodStart: (0, timeFormat_1.formatDate)(new Date(subscription.current_period_start * 1000)),
        currentPeriodEnd: (0, timeFormat_1.formatDate)(new Date(subscription.current_period_end * 1000)),
        priceAmount: price,
        user,
        packages,
    });
    return {
        allSubscriptationValue,
        createSub,
    };
});
const handlePaymentSuccess = (userId, subscriptionId) => __awaiter(void 0, void 0, void 0, function* () {
    // Retrieve the PaymentIntent from Stripe
    // Update the subscription status to 'active' in your Subscribation model
    const updatedSub = yield subscribtion_model_1.Subscribation.updateOne({ user: userId }, { status: 'active' } // Mark as 'active' after successful payment
    );
    const issubs = yield subscribtion_model_1.Subscribation.findOne({
        user: userId,
    });
    const packages = issubs === null || issubs === void 0 ? void 0 : issubs.packages;
    const isPackageExist = yield package_model_1.Package.findOne({ _id: packages });
    const isPackage = isPackageExist === null || isPackageExist === void 0 ? void 0 : isPackageExist.title;
    if (updatedSub) {
        // Find and update the user based on the id
        const updateUserSubs = yield user_model_1.User.findByIdAndUpdate(userId, { $set: { subscription: true, title: isPackage } }, { new: true });
        if (!updateUserSubs) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to update user subscription.');
        }
        if (!updatedSub) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to create subscription.');
        }
    }
    return updatedSub;
});
const getAllSubscriptation = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscribtion_model_1.Subscribation.find({ status: 'active' })
        .populate({
        path: 'user',
        populate: {
            path: 'brand',
        },
    })
        .populate('packages');
    return result;
});
const getAllSubscriptationForBrand = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, page, limit, userId } = query, filterData = __rest(query, ["searchTerm", "page", "limit", "userId"]);
    const anyConditions = [];
    // Add searchTerm condition if present
    if (userId) {
        anyConditions.push({ user: userId });
    }
    // Filter by additional filterData fields
    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.entries(filterData).map(([field, value]) => ({ [field]: value }));
        anyConditions.push({ $and: filterConditions });
    }
    // Combine all conditions
    const whereConditions = anyConditions.length > 0 ? { $and: anyConditions } : {};
    // Pagination setup
    const pages = parseInt(page) || 1;
    const size = parseInt(limit) || 10;
    const skip = (pages - 1) * size;
    // Fetch Category data
    const result = yield subscribtion_model_1.Subscribation.find(whereConditions)
        .populate({
        path: 'user',
        populate: {
            path: 'brand',
        },
    })
        .populate('packages')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(size)
        .lean();
    const count = yield subscribtion_model_1.Subscribation.countDocuments(whereConditions);
    return {
        result,
        meta: {
            page: pages,
            total: count,
        },
    };
});
const updateustomerAndSubscription = (packages, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const subs = yield subscribtion_model_1.Subscribation.findOne({ user: userId });
    const pack = yield package_model_1.Package.findById(packages);
    const newPriceId = pack === null || pack === void 0 ? void 0 : pack.productId;
    const subsId = subs === null || subs === void 0 ? void 0 : subs.subscriptionId;
    // Check if the subscription exists in the database
    const isExistSubId = yield subscribtion_model_1.Subscribation.findOne({ user: userId });
    if (!isExistSubId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Subscription not found in the database.');
    }
    // Retrieve the existing subscription from Stripe
    const subscription = yield exports.stripe.subscriptions.retrieve(subsId);
    if (!subscription) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Subscription not found in Stripe.');
    }
    if (subscription.status === 'incomplete') {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Cannot update subscription in incomplete status. Finalize the payment first.');
    }
    // Update the subscription in Stripe with the new priceId
    const updatedSubscription = yield exports.stripe.subscriptions.update(subsId, {
        items: [
            {
                id: subscription.items.data[0].id,
                price: newPriceId,
            },
        ],
        expand: ['latest_invoice.payment_intent'],
    });
    // Check if the latest_invoice and payment_intent exist in the updated subscription
    const latestInvoice = updatedSubscription.latest_invoice;
    if (!latestInvoice || typeof latestInvoice === 'string') {
        throw new Error('Failed to update subscription; latest_invoice is missing or is invalid.');
    }
    const paymentIntent = latestInvoice.payment_intent;
    if (!paymentIntent || typeof paymentIntent === 'string') {
        throw new Error('Failed to retrieve payment intent from latest_invoice.');
    }
    // Update the subscription details in the database
    const updatedSub = yield subscribtion_model_1.Subscribation.findOneAndUpdate({ subscriptionId: subsId }, {
        // priceId: newPriceId, // Update to the new price ID
        status: updatedSubscription.status,
        priceAmount: paymentIntent.amount / 100,
        currentPeriodEnd: (0, timeFormat_1.formatDate)(new Date(updatedSubscription.current_period_end * 1000)),
        currentPeriodStart: (0, timeFormat_1.formatDate)(new Date(updatedSubscription.current_period_start * 1000)),
    }, { new: true } // Return the updated document
    );
    if (!updatedSub) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to update subscription record in the database.');
    }
    const isPackageExist = yield package_model_1.Package.findOne({ _id: packages });
    const isPackage = isPackageExist === null || isPackageExist === void 0 ? void 0 : isPackageExist.title;
    if (updatedSub) {
        // Find and update the user based on the id
        const updateUserSubs = yield user_model_1.User.findByIdAndUpdate(userId, { $set: { subscription: true, title: isPackage } }, { new: true });
        if (!updateUserSubs) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to update user subscription.');
        }
        if (!updateUserSubs) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to create subscription.');
        }
    }
    return {
        subscriptionId: updatedSubscription.id,
        transactionId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        status: updatedSubscription.status,
        updatedSub,
    };
});
const cancelSubscription = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const subs = yield subscribtion_model_1.Subscribation.findOne({ user: userId });
    const subsId = subs === null || subs === void 0 ? void 0 : subs.subscriptionId;
    // Check if the subscription exists in the database
    const isExistSubId = yield subscribtion_model_1.Subscribation.findOne({ user: userId });
    if (!isExistSubId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Subscription not found in the database.');
    }
    // Update the subscription to cancel at the end of the period
    const updatedSubscription = yield exports.stripe.subscriptions.update(subsId, {
        cancel_at_period_end: true,
    });
    // Update the subscription details in the database
    const updatedSub = yield subscribtion_model_1.Subscribation.findOneAndUpdate({ subscriptionId: subsId }, {
        status: (_a = updatedSubscription.cancellation_details) === null || _a === void 0 ? void 0 : _a.reason,
        currentPeriodStart: (0, timeFormat_1.formatDate)(new Date(updatedSubscription.current_period_start * 1000)),
        currentPeriodEnd: (0, timeFormat_1.formatDate)(new Date(updatedSubscription.current_period_end * 1000)),
    }, { new: true });
    if (!updatedSub) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to update subscription record in the database.');
    }
    return {
        subscriptionId: updatedSubscription.id,
        status: updatedSubscription.status,
        updatedSub,
    };
});
const renewExpiredSubscriptions = (userId, packages // Make newPriceId optional
) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const pack = yield package_model_1.Package.findById(packages);
    const newPriceId = pack === null || pack === void 0 ? void 0 : pack.productId;
    const subs = yield subscribtion_model_1.Subscribation.findOne({ user: userId });
    const subsId = subs === null || subs === void 0 ? void 0 : subs.subscriptionId;
    // Find subscription record in the database
    const subscriptionRecord = yield subscribtion_model_1.Subscribation.findOne({ user: userId });
    if (!subscriptionRecord) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Subscription not found in the database.');
    }
    // Check if the status is "expired"
    if (subscriptionRecord.status !== 'expired') {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Subscription is not expired and cannot be renewed.');
    }
    // Retrieve the existing subscription from Stripe
    const stripeSubscription = yield exports.stripe.subscriptions.retrieve(subsId);
    // Check if the subscription is valid
    if (!stripeSubscription || stripeSubscription.status !== 'active') {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid or inactive subscription.');
    }
    // Prepare the customer ID
    const customerId = typeof stripeSubscription.customer === 'string'
        ? stripeSubscription.customer
        : (_a = stripeSubscription.customer) === null || _a === void 0 ? void 0 : _a.id;
    // Ensure a customer ID is available
    if (!customerId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'No valid customer found for the subscription.');
    }
    let amountToCharge;
    let currency;
    if (newPriceId) {
        // If a new price ID is provided, retrieve the new price details
        const newPrice = yield exports.stripe.prices.retrieve(newPriceId);
        // Ensure newPrice and its unit_amount are valid
        if (!newPrice || newPrice.unit_amount === null) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid new price ID or unit amount is null.');
        }
        amountToCharge = newPrice.unit_amount;
        currency = newPrice.currency;
    }
    else {
        // If no new price ID, use the existing invoice
        const latestInvoice = stripeSubscription.latest_invoice;
        if (!latestInvoice || typeof latestInvoice === 'string') {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'No latest invoice found for the subscription.');
        }
        if (latestInvoice.amount_due === null) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Latest invoice amount_due is null.');
        }
        amountToCharge = latestInvoice.amount_due;
        currency = latestInvoice.currency;
    }
    // Retrieve the default payment method
    const paymentMethodId = typeof stripeSubscription.default_payment_method === 'string'
        ? stripeSubscription.default_payment_method
        : undefined;
    // Ensure paymentMethodId is valid
    if (!paymentMethodId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'No valid payment method found for the subscription.');
    }
    // Create the payment intent
    const paymentIntent = yield exports.stripe.paymentIntents.create({
        amount: amountToCharge,
        currency: currency,
        customer: customerId,
        // payment_method: 'Subscription creation',
        payment_method: paymentMethodId,
        off_session: true,
        confirm: true,
    });
    // Check if the payment was successful
    if (paymentIntent.status !== 'succeeded') {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Payment failed. Please try again.');
    }
    const updatedSub = yield subscribtion_model_1.Subscribation.findOneAndUpdate({ subscriptionId: subsId }, {
        status: 'active',
        priceAmount: amountToCharge / 100,
        currentPeriodStart: (0, timeFormat_1.formatDate)(new Date()),
        currentPeriodEnd: (0, timeFormat_1.formatDate)(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
    }, { new: true });
    if (!updatedSub) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to update subscription record in the database.');
    }
    return {
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
        updatedSub,
    };
});
exports.subscriptionService = {
    createCheckoutSession,
    retrieveSession,
    createBillingPortal,
    handleWebhook,
    createCustomerAndSubscription,
    updateustomerAndSubscription,
    cancelSubscription,
    renewExpiredSubscriptions,
    getAllSubscriptation,
    getAllSubscriptationForBrand,
    handlePaymentSuccess,
};

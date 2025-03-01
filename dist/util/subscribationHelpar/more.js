"use strict";
// import Stripe from 'stripe';
// import { Subscribation } from '../../app/modules/subscribtion/subscribtion.model';
// import { User } from '../../app/modules/user/user.model';
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
exports.subscriptionServicessss = void 0;
const subscribtion_service_1 = require("../../app/modules/subscribtion/subscribtion.service");
const subscribtion_model_1 = require("../../app/modules/subscribtion/subscribtion.model");
const user_model_1 = require("../../app/modules/user/user.model");
// async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
//   const { userId, packageId } = subscription.metadata;
//   await Subscribation.findOneAndUpdate(
//     { subscriptionId: subscription.id },
//     {
//       status: subscription.status,
//       currentPeriodStart: new Date(subscription.current_period_start * 1000),
//       currentPeriodEnd: new Date(subscription.current_period_end * 1000),
//     },
//     { new: true }
//   );
// }
// async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
//   const { userId } = subscription.metadata;
//   await Subscribation.findOneAndUpdate(
//     { subscriptionId: subscription.id },
//     {
//       status: subscription.status,
//       currentPeriodStart: new Date(subscription.current_period_start * 1000),
//       currentPeriodEnd: new Date(subscription.current_period_end * 1000),
//     }
//   );
//   // Update user subscription status if necessary
//   if (subscription.status === 'active') {
//     await User.findByIdAndUpdate(userId, { $set: { subscription: true } });
//   } else if (
//     subscription.status === 'canceled' ||
//     subscription.status === 'unpaid'
//   ) {
//     await User.findByIdAndUpdate(userId, { $set: { subscription: false } });
//   }
// }
// async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
//   const { userId } = subscription.metadata;
//   await Subscribation.findOneAndUpdate(
//     { subscriptionId: subscription.id },
//     { status: 'cancelled' }
//   );
//   await User.findByIdAndUpdate(userId, {
//     $set: {
//       subscription: false,
//       title: 'free', // Reset to free tier
//     },
//   });
// }
// async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
//   if (!invoice.subscription) return;
//   const subscription = await Subscribation.findOne({
//     subscriptionId: invoice.subscription,
//   });
//   if (!subscription) return;
//   await Subscribation.findByIdAndUpdate(subscription._id, {
//     status: 'active',
//     lastPaymentStatus: 'succeeded',
//     lastPaymentDate: new Date(),
//   });
// }
// async function handlePaymentFailed(invoice: Stripe.Invoice) {
//   if (!invoice.subscription) return;
//   const subscription = await Subscribation.findOne({
//     subscriptionId: invoice.subscription,
//   });
//   if (!subscription) return;
//   await Subscribation.findByIdAndUpdate(subscription._id, {
//     status: 'past_due',
//     lastPaymentStatus: 'failed',
//     lastPaymentAttempt: new Date(),
//   });
//   // Optionally notify the user about payment failure
//   // await notifyUserAboutPaymentFailure(subscription.user);
// }
// export const SubscribationHelper = {
//   handleSubscriptionCreated,
//   handlePaymentFailed,
//   handlePaymentSucceeded,
//   handleSubscriptionUpdated,
//   handleSubscriptionCancelled,
// };
const handleSubscriptionCreated = (subscription) => __awaiter(void 0, void 0, void 0, function* () {
    const customerId = subscription.customer;
    const customer = yield subscribtion_service_1.stripe.customers.retrieve(customerId);
    if ('deleted' in customer)
        return null;
    const subscriptionData = yield subscribtion_model_1.Subscribation.findOneAndUpdate({ subscriptionId: subscription.id }, {
        subscriptionId: subscription.id,
        customerId: customerId,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        customerEmail: customer.email,
    }, { upsert: true, new: true });
    return subscriptionData;
});
const handleSubscriptionUpdated = (subscription) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = subscription.metadata;
    const updatedSubscription = yield subscribtion_model_1.Subscribation.findOneAndUpdate({ subscriptionId: subscription.id }, {
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    }, { new: true });
    if (userId) {
        yield user_model_1.User.findByIdAndUpdate(userId, { subscription: subscription.status === 'active' }, { new: true });
    }
    return updatedSubscription;
});
const handleSubscriptionDeleted = (subscription) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = subscription.metadata;
    const cancelledSubscription = yield subscribtion_model_1.Subscribation.findOneAndUpdate({ subscriptionId: subscription.id }, { status: 'cancelled' }, { new: true });
    if (userId) {
        yield user_model_1.User.findByIdAndUpdate(userId, {
            subscription: false,
            title: 'free',
        }, { new: true });
    }
    return cancelledSubscription;
});
const handleInvoicePaid = (invoice) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof invoice.subscription === 'string') {
        const updatedSubscription = yield subscribtion_model_1.Subscribation.findOneAndUpdate({ subscriptionId: invoice.subscription }, {
            status: 'active',
            lastPaymentStatus: 'succeeded',
            lastPaymentDate: new Date(),
        }, { new: true });
        return updatedSubscription;
    }
    return null;
});
const handleInvoicePaymentFailed = (invoice) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof invoice.subscription === 'string') {
        const updatedSubscription = yield subscribtion_model_1.Subscribation.findOneAndUpdate({ subscriptionId: invoice.subscription }, {
            status: 'past_due',
            lastPaymentStatus: 'failed',
            lastPaymentAttempt: new Date(),
        }, { new: true });
        return updatedSubscription;
    }
    return null;
});
exports.subscriptionServicessss = {
    handleSubscriptionCreated,
    handleSubscriptionUpdated,
    handleSubscriptionDeleted,
    handleInvoicePaid,
    handleInvoicePaymentFailed,
};

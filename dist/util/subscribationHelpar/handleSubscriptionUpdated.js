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
const timeFormat_1 = require("../../app/modules/subscribtion/timeFormat");
const subscribtion_service_1 = require("../../app/modules/subscribtion/subscribtion.service");
const handleSubscriptionUpdated = (session) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, customer, subscription } = session;
        const subscriptionId = subscription; // Subscription ID is stored here
        const customerId = customer;
        // Fetch the actual subscription from Stripe
        const stripeSubscription = yield subscribtion_service_1.stripe.subscriptions.retrieve(subscriptionId);
        const { status, current_period_end, current_period_start } = stripeSubscription;
        // currentPeriodStart: formatDate(
        //   new Date(updatedSubscription.current_period_start * 1000)
        // ),
        // Find and update the subscription in the database
        yield subscribtion_model_1.Subscribation.findOneAndUpdate({ subscriptionId }, {
            status,
            currentPeriodEnd: (0, timeFormat_1.formatDate)(new Date(current_period_end * 1000)),
            currentPeriodStart: (0, timeFormat_1.formatDate)(new Date(current_period_start * 1000)),
        }, { new: true, upsert: true } // If not found, create a new record
        );
    }
    catch (error) {
        console.error('Error handling subscription update:', error);
    }
});
exports.default = handleSubscriptionUpdated;
// : subscription.cancellation_details?.reason

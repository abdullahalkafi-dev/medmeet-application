"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subs = void 0;
const mongoose_1 = require("mongoose");
const subscribtionSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    plan: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Plan',
    },
    subscriptionId: {
        type: String,
    },
    stripeCustomerId: {
        type: String,
    },
    status: {
        type: String,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    email: {
        type: String,
    },
    amount: {
        type: Number,
    },
});
exports.Subs = (0, mongoose_1.model)('Subscribtion', subscribtionSchema);

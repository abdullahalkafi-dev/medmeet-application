"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscribation = void 0;
const mongoose_1 = require("mongoose");
const subscribationSchema = new mongoose_1.Schema({
    status: {
        type: String,
        // enum: ['expired', 'active', 'incomplete', 'cancellation_requested'],
    },
    customerId: {
        type: String,
    },
    plan: {
        type: String,
    },
    subscriptionId: {
        type: String,
    },
    priceId: {
        type: String,
    },
    priceAmount: {
        type: Number,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    packages: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Package',
    },
    clientSecret: {
        type: String,
    },
    transactionId: {
        type: String,
    },
    currentPeriodEnd: {
        type: String,
    },
    currentPeriodStart: {
        type: String,
    },
}, {
    timestamps: true,
});
exports.Subscribation = (0, mongoose_1.model)('subscribation', subscribationSchema);

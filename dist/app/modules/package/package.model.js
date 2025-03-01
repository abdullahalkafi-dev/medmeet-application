"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Package = void 0;
const mongoose_1 = require("mongoose");
const packageSchema = new mongoose_1.Schema({
    category: {
        type: String,
        enum: ['Monthly', 'HalfYearly', 'Yearly'],
        required: true,
    },
    title: {
        type: String,
        enum: ['Gold', 'Silver', 'Discount'],
        required: true,
    },
    // duration: {
    //   type: String,
    //   enum: ['Monthly', 'Yearly', 'HalfYearly'],
    //   required: true,
    // },
    limit: {
        type: String,
    },
    productId: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    features: {
        type: [String],
        required: true,
    },
}, {
    timestamps: true,
});
exports.Package = (0, mongoose_1.model)('Package', packageSchema);

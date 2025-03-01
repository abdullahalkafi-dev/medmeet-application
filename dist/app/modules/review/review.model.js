"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    brand: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    influencer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    details: {
        type: String,
        required: true,
        trim: true,
    },
    rating: {
        type: Number,
    },
    status: {
        type: String,
        enum: ['active', 'delete'],
        default: 'active',
    },
}, {
    timestamps: true,
});
exports.Review = (0, mongoose_1.model)('review', reviewSchema);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contact = void 0;
const mongoose_1 = require("mongoose");
const contactSchema = new mongoose_1.Schema({
    details: {
        type: String,
        required: true,
        trim: true,
    },
    image: [
        {
            type: String,
        },
    ],
    whatAppNum: {
        type: Number,
    },
    email: {
        type: String,
    },
    status: {
        type: String,
        enum: ['active', 'delete'],
        default: 'active',
    },
}, {
    timestamps: true,
});
exports.Contact = (0, mongoose_1.model)('Contact', contactSchema);

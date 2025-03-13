"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    _id: { type: String, required: true },
    appointmentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Appointment' },
}, { strict: false }); // strict: false allows for additional dynamic fields
exports.OrderModel = (0, mongoose_1.model)('Order', orderSchema);

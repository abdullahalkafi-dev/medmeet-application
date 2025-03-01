"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Medicine = void 0;
const mongoose_1 = require("mongoose");
const medicineSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        index: true,
    },
});
exports.Medicine = (0, mongoose_1.model)('Medicine', medicineSchema);

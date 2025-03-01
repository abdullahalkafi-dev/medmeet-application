"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicineValidation = void 0;
const zod_1 = require("zod");
const createMedicineZodValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Medicine name is required' }),
    }),
});
const updateMedicineZodValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string(),
    }),
});
exports.MedicineValidation = {
    createMedicineZodValidation,
    updateMedicineZodValidation,
};

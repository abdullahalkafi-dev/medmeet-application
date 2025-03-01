"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryValidation = void 0;
const zod_1 = require("zod");
const createCategoryZodSchema = zod_1.z.object({
    data: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Name is required' }),
    }),
});
const updateCategoryZodSchema = zod_1.z.object({
    data: zod_1.z.object({
        name: zod_1.z.string().optional(),
        image: zod_1.z.string().optional(),
    }),
});
exports.CategoryValidation = {
    createCategoryZodSchema,
    updateCategoryZodSchema,
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewValiationZodSchema = exports.createReviewValiation = void 0;
const zod_1 = require("zod");
exports.createReviewValiation = zod_1.z.object({
    body: zod_1.z.object({
        brand: zod_1.z.string({ required_error: 'Brand is required' }),
        influencer: zod_1.z.string({ required_error: 'Influencer is required' }),
        details: zod_1.z.string({ required_error: 'Details is required' }),
        rating: zod_1.z.number().max(5).min(0),
    }),
});
exports.reviewValiationZodSchema = {
    createReviewValiation: exports.createReviewValiation,
};

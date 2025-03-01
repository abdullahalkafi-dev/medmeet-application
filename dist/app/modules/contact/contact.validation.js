"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactValiationZodSchema = exports.updatedContactValiation = exports.ContactValiation = void 0;
const zod_1 = require("zod");
exports.ContactValiation = zod_1.z.object({
    details: zod_1.z.string({ required_error: 'Details is required' }),
    whatAppNum: zod_1.z.number({ required_error: 'Whatapp number is required ' }),
    email: zod_1.z.string({ required_error: 'Email number is required ' }),
});
exports.updatedContactValiation = zod_1.z.object({
    details: zod_1.z.string().optional(),
    whatAppNum: zod_1.z.number().optional(),
    email: zod_1.z.string().optional(),
});
exports.ContactValiationZodSchema = {
    ContactValiation: exports.ContactValiation,
    updatedContactValiation: exports.updatedContactValiation,
};

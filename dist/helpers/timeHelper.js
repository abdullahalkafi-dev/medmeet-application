"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDateFilter = void 0;
const buildDateFilter = (endTime) => {
    const specifiedDate = new Date(endTime);
    if (isNaN(specifiedDate.getTime()))
        return null;
    const startOfDay = new Date(specifiedDate.getFullYear(), specifiedDate.getMonth(), specifiedDate.getDate());
    const endOfDay = new Date(specifiedDate.getFullYear(), specifiedDate.getMonth(), specifiedDate.getDate(), 23, 59, 59, 999);
    return {
        endTime: {
            $gte: startOfDay.toISOString(),
            $lte: endOfDay.toISOString(),
        },
    };
};
exports.buildDateFilter = buildDateFilter;

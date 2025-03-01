"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const notification_model_1 = require("./notification.model");
const getNotificationToDb = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notification_model_1.Notification.find({ receiver: user.id }).sort({
        createdAt: -1,
    });
    const unredCount = yield notification_model_1.Notification.countDocuments({
        receiver: user.id,
        read: false,
    });
    const data = {
        result,
        unredCount,
    };
    return data;
});
const readNotification = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notification_model_1.Notification.updateMany({ receiver: user.id }, { read: true });
    return result;
});
const adminNotification = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, page, limit } = query, filterData = __rest(query, ["searchTerm", "page", "limit"]);
    const anyConditions = [{ type: 'ADMIN' }];
    // Add filters based on additional fields in filterData
    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.entries(filterData).map(([field, value]) => ({ [field]: value }));
        anyConditions.push({ $and: filterConditions });
    }
    // Combine all conditions
    const whereConditions = anyConditions.length > 0 ? { $and: anyConditions } : {};
    // Pagination setup
    const pages = parseInt(page, 10) || 1;
    const size = parseInt(limit, 10) || 10;
    const skip = (pages - 1) * size;
    // Fetch notifications
    const result = yield notification_model_1.Notification.find(whereConditions)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(size)
        .lean();
    const count = yield notification_model_1.Notification.countDocuments(whereConditions);
    return {
        result,
        meta: {
            page: pages,
            total: count,
        },
    };
});
const adminReadNotification = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notification_model_1.Notification.updateMany({ type: 'ADMIN' }, { read: true });
    return result;
});
exports.NotificationService = {
    getNotificationToDb,
    readNotification,
    adminNotification,
    adminReadNotification,
};

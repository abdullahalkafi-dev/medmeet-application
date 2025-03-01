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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const influencer_model_1 = require("./../influencer/influencer.model");
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const review_model_1 = require("./review.model");
const user_model_1 = require("../user/user.model");
const createReviewToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_model_1.Review.create(payload);
    const users = yield user_model_1.User.findById(payload.influencer);
    const infoId = users === null || users === void 0 ? void 0 : users.influencer;
    if (!infoId) {
        throw new Error('Influencer not found or invalid ID');
    }
    const Influencers = yield influencer_model_1.Influencer.findOne({ _id: infoId });
    if (!Influencers) {
        throw new Error('Influencer not found or invalid ID');
    }
    const reviews = yield review_model_1.Review.find({ influencer: payload.influencer });
    const totalRatings = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    const reviewCount = reviews.length;
    // Check if there are reviews to prevent division by zero
    const averageRating = reviewCount > 0 ? Math.round(totalRatings / reviewCount) : 0;
    const influencer = yield influencer_model_1.Influencer.updateOne({ _id: infoId }, {
        $set: {
            rating: averageRating,
            count: reviewCount,
        },
    });
    return { result, influencer };
});
const getAllReview = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, page, limit } = query, filterData = __rest(query, ["searchTerm", "page", "limit"]);
    const anyConditions = [{ status: 'active' }];
    // Filter by additional filterData fields
    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.entries(filterData).map(([field, value]) => ({ [field]: value }));
        anyConditions.push({ $and: filterConditions });
    }
    // Combine all conditions
    const whereConditions = anyConditions.length > 0 ? { $and: anyConditions } : {};
    // Pagination setup
    const pages = parseInt(page) || 1;
    const size = parseInt(limit) || 10;
    const skip = (pages - 1) * size;
    // Fetch DiscountClub data
    const result = yield review_model_1.Review.find(whereConditions)
        .populate({
        path: 'brand',
        select: 'brand',
        populate: {
            path: 'brand',
            select: 'image owner',
        },
    })
        .populate({
        path: 'influencer',
        select: 'influencer',
        populate: {
            path: 'influencer',
            select: 'fullName image',
        },
    })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(size)
        .lean();
    const count = yield review_model_1.Review.countDocuments(whereConditions);
    return {
        result,
        meta: {
            page: pages,
            total: count,
        },
    };
});
const getSingleReview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_model_1.Review.findOne({ _id: id, status: 'active' })
        .populate({
        path: 'brand',
        populate: {
            path: 'brand',
        },
    })
        .populate({
        path: 'influencer',
        populate: {
            path: 'influencer',
        },
    });
    if (!(result === null || result === void 0 ? void 0 : result.brand) || !(result === null || result === void 0 ? void 0 : result.influencer)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Review not found');
    }
    if (!result === null) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Review not found');
    }
    return result;
});
const updateReviewToDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield review_model_1.Review.findById(id);
    if (!review) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Review not found');
    }
    if (review.status !== 'active') {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Review is not active, cannot be updated');
    }
    const result = yield review_model_1.Review.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteReviewToDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_model_1.Review.findByIdAndDelete(id, {
        status: 'delete',
        new: true,
        runValidators: true,
    });
    return result;
});
exports.ReviewService = {
    createReviewToDB,
    getAllReview,
    getSingleReview,
    updateReviewToDB,
    deleteReviewToDB,
};

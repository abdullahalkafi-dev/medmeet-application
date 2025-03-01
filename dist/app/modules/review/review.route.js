"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const review_controller_1 = require("./review.controller");
const review_validation_1 = require("./review.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
router.post('/create-review', (0, auth_1.default)(user_1.USER_ROLES.BRAND, user_1.USER_ROLES.INFLUENCER, user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), (0, validateRequest_1.default)(review_validation_1.reviewValiationZodSchema.createReviewValiation), review_controller_1.ReviewController.createReviewToDB);
router.get('/', (0, auth_1.default)(user_1.USER_ROLES.BRAND, user_1.USER_ROLES.INFLUENCER, user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), review_controller_1.ReviewController.getAllReview);
router.get('/:id', (0, auth_1.default)(user_1.USER_ROLES.BRAND, user_1.USER_ROLES.INFLUENCER, user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), review_controller_1.ReviewController.getSingleReview);
router.patch('/:id', (0, auth_1.default)(user_1.USER_ROLES.BRAND, user_1.USER_ROLES.INFLUENCER, user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), review_controller_1.ReviewController.updatedReview);
router.delete('/:id', (0, auth_1.default)(user_1.USER_ROLES.BRAND, user_1.USER_ROLES.INFLUENCER, user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), review_controller_1.ReviewController.deletedReview);
exports.ReviewRoutes = router;

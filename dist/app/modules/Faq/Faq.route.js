"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaqRoutes = void 0;
const express_1 = __importDefault(require("express"));
const Faq_controller_1 = require("./Faq.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const Faq_validation_1 = require("./Faq.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
router.post('/create-faq', (0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), (0, validateRequest_1.default)(Faq_validation_1.FaqValidation.createFaqSchema), Faq_controller_1.FaqController.createFaqToDB);
router.get('/', Faq_controller_1.FaqController.getAllFaq);
router.get('/:id', Faq_controller_1.FaqController.getSingleFaq);
router.post('/:id', (0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), (0, validateRequest_1.default)(Faq_validation_1.FaqValidation.updatedFaqSchema), Faq_controller_1.FaqController.updatedFaq);
router.delete('/:id', (0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), Faq_controller_1.FaqController.deletedFaq);
exports.FaqRoutes = router;

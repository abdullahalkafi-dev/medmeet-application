"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const fileUploadHandler_1 = __importDefault(require("../../middlewares/fileUploadHandler"));
const contact_validation_1 = require("./contact.validation");
const contact_controller_1 = require("./contact.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
router.post('/create-contact', (0, fileUploadHandler_1.default)(), (0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), (req, res, next) => {
    req.body = contact_validation_1.ContactValiationZodSchema.ContactValiation.parse(JSON.parse(req.body.data));
    return contact_controller_1.ContactController.createContactToDB(req, res, next);
});
router.get('/', contact_controller_1.ContactController.getAllContacts);
exports.ContactsRoutes = router;

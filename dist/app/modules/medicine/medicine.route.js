"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicineRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const medicine_controller_1 = require("./medicine.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const medicine_validation_1 = require("./medicine.validation");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), (0, validateRequest_1.default)(medicine_validation_1.MedicineValidation.createMedicineZodValidation), medicine_controller_1.MedicineController.createMedicine);
router.get('/', (0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.USER, user_1.USER_ROLES.DOCTOR), medicine_controller_1.MedicineController.getAllMedicines);
router.delete('/:id', (0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), medicine_controller_1.MedicineController.deleteMedicine);
router.post('/update-medicine/:id', (0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), (0, validateRequest_1.default)(medicine_validation_1.MedicineValidation.updateMedicineZodValidation), medicine_controller_1.MedicineController.updateMedicine);
exports.MedicineRoutes = router;

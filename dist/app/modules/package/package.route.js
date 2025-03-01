"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageRoutes = void 0;
const express_1 = __importDefault(require("express"));
const package_controller_1 = require("./package.controller");
const router = express_1.default.Router();
router.post('/create-package', 
// auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
package_controller_1.PackageController.createPackage);
router.get('/get-all', package_controller_1.PackageController.getAllPackage);
router.patch('/:id', package_controller_1.PackageController.updatePackage);
exports.PackageRoutes = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionRoutes = void 0;
const express_1 = require("express");
const express_2 = __importDefault(require("express"));
const subscribtion_controller_1 = require("./subscribtion.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const router = (0, express_1.Router)();
router.post('/subscribe', 
// auth(USER_ROLES.BRAND),
subscribtion_controller_1.SubscriptionController.createSubscription);
router.post('/payment-success', 
// auth(USER_ROLES.BRAND),
subscribtion_controller_1.SubscriptionController.handlePaymentSuccess);
router.post('/renew', (0, auth_1.default)(user_1.USER_ROLES.BRAND), subscribtion_controller_1.SubscriptionController.renewExpiredSubscription);
router.patch('/update', (0, auth_1.default)(user_1.USER_ROLES.BRAND), subscribtion_controller_1.SubscriptionController.updateSubscription);
router.delete('/cancel', (0, auth_1.default)(user_1.USER_ROLES.BRAND), subscribtion_controller_1.SubscriptionController.CancelSubscription);
router.get('/get', (0, auth_1.default)(user_1.USER_ROLES.BRAND, user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), subscribtion_controller_1.SubscriptionController.getAllSubscriptation);
router.get('/get/:userId', (0, auth_1.default)(user_1.USER_ROLES.BRAND), subscribtion_controller_1.SubscriptionController.getAllSubscriptationForBrand);
router.post('/webhook', (0, auth_1.default)(user_1.USER_ROLES.BRAND), express_2.default.raw({ type: 'application/json' }), subscribtion_controller_1.SubscriptionController.webhookHandler);
router.get('/subscribe', subscribtion_controller_1.SubscriptionController.createSession);
router.get('/success', subscribtion_controller_1.SubscriptionController.Success);
router.get('/customers/:id', subscribtion_controller_1.SubscriptionController.customerPortal);
exports.SubscriptionRoutes = router;

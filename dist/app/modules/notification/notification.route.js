"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRoutes = void 0;
const express_1 = require("express");
const notification_controller_1 = require("./notification.controller");
const route = (0, express_1.Router)();
route.post("/", notification_controller_1.NotificationController.createNotification);
route.get("/:userId", notification_controller_1.NotificationController.getUserNotification);
exports.NotificationRoutes = route;

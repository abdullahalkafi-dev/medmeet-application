import { Router } from "express";
import { NotificationController } from "./notification.controller";

const route = Router();

route.post("/",NotificationController.createNotification);
route.get("/:userId",NotificationController.getUserNotification);
export const NotificationRoutes = route;
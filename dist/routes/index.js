"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const doctor_route_1 = require("../app/modules/doctor/doctor.route");
const user_route_1 = require("../app/modules/user/user.route");
const category_route_1 = require("../app/modules/category/category.route");
const setting_route_1 = require("../app/modules/setting/setting.route");
const medicine_route_1 = require("../app/modules/medicine/medicine.route");
const doctorSchema_router_1 = require("../app/modules/doctorSchedule/doctorSchema.router");
const appointment_route_1 = require("../app/modules/appointment/appointment.route");
const medicalRecord_route_1 = require("../app/modules/medicalRecord/medicalRecord.route");
const chat_route_1 = require("../app/modules/chat/chat.route");
const notification_route_1 = require("../app/modules/notification/notification.route");
const router = express_1.default.Router();
const apiRoutes = [
    { path: '/user', route: user_route_1.UserRoutes },
    { path: '/doctor', route: doctor_route_1.DoctorRoutes },
    { path: '/category', route: category_route_1.CategoryRoutes },
    { path: '/setting', route: setting_route_1.SettingRoutes },
    { path: '/medicine', route: medicine_route_1.MedicineRoutes },
    { path: '/schedule', route: doctorSchema_router_1.DoctorScheduleRouter },
    { path: '/appointment', route: appointment_route_1.AppointmentRouter },
    { path: '/medical-record', route: medicalRecord_route_1.MedicalRecordRoutes },
    { path: '/chat', route: chat_route_1.ChatRoutes },
    { path: '/notification', route: notification_route_1.NotificationRoutes },
];
apiRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;

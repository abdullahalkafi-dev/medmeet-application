import express from 'express';

import { DoctorRoutes } from '../app/modules/doctor/doctor.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { CategoryRoutes } from '../app/modules/category/category.route';
import { SettingRoutes } from '../app/modules/setting/setting.route';
import { MedicineRoutes } from '../app/modules/medicine/medicine.route';
import { DoctorScheduleRouter } from '../app/modules/doctorSchedule/doctorSchema.router';
import { AppointmentRouter } from '../app/modules/appointment/appointment.route';
import { MedicalRecordRoutes } from '../app/modules/medicalRecord/medicalRecord.route';
import { ChatRoutes } from '../app/modules/chat/chat.route';
import { NotificationRoutes } from '../app/modules/notification/notification.route';

const router = express.Router();

const apiRoutes = [
  { path: '/user', route: UserRoutes },
  { path: '/doctor', route: DoctorRoutes },
  { path: '/category', route: CategoryRoutes },
  { path: '/setting', route: SettingRoutes },
  { path: '/medicine', route: MedicineRoutes },
  { path: '/schedule', route: DoctorScheduleRouter },
  { path: '/appointment', route: AppointmentRouter },
  { path: '/medical-record', route: MedicalRecordRoutes },
  { path: '/chat', route: ChatRoutes },
  { path: '/notification', route: NotificationRoutes },
];
apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;

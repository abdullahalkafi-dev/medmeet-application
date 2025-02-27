import express from 'express';



import { FaqRoutes } from '../app/modules/Faq/Faq.route';
import { ReviewRoutes } from '../app/modules/review/review.route';


import { SubscriptionRoutes } from '../app/modules/subscribtion/subscribtion.route';
import { PackageRoutes } from '../app/modules/package/package.route';
import { NotificationRoutes } from '../app/modules/notification/notification.route';

import { ContactsRoutes } from '../app/modules/contact/contact.route';
import { DoctorRoutes } from '../app/modules/doctor/doctor.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { CategoryRoutes } from '../app/modules/category/category.route';
import { SettingRoutes } from '../app/modules/setting/setting.route';
import { MedicineRoutes } from '../app/modules/medicine/medicine.route';
import { DoctorScheduleRouter } from '../app/modules/doctorSchedule/doctorSchema.router';
import { AppointmentRouter } from '../app/modules/appointment/appointment.route';
import { MedicalRecordRoutes } from '../app/modules/medicalRecord/medicalRecord.route';

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
  

  // { path: '/faq', route: FaqRoutes },
  // { path: '/review', route: ReviewRoutes },

  // { path: '/terms', route: TermsAndConditionRoutes },
  // { path: '/subscribtion', route: SubscriptionRoutes },

  // { path: '/package', route: PackageRoutes },
  // { path: '/notification', route: NotificationRoutes },

  // { path: '/contact', route: ContactsRoutes },
];
apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;

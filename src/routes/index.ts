import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';

import { AdminRoutes } from '../app/modules/admin/admin.routes';

import { FaqRoutes } from '../app/modules/Faq/Faq.route';
import { ReviewRoutes } from '../app/modules/review/review.route';

import { TermsAndConditionRoutes } from '../app/modules/termsAndCondition/termsAndCondition.route';

import { SubscriptionRoutes } from '../app/modules/subscribtion/subscribtion.route';
import { PackageRoutes } from '../app/modules/package/package.route';
import { NotificationRoutes } from '../app/modules/notification/notification.route';

import { ContactsRoutes } from '../app/modules/contact/contact.route';
import { DoctorRoutes } from '../app/modules/doctor/doctor.route';
import { UserRoutes } from '../app/modules/user/user.route';

const router = express.Router();

const apiRoutes = [
  { path: '/user', route: UserRoutes },
  { path: '/doctor', route: DoctorRoutes },
  // { path: '/auth', route: AuthRoutes },
  // { path: '/admin', route: AdminRoutes },

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

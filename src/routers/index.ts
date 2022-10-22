import {
  RouteRecordRaw,
} from 'vue-router';

import router404 from '@/routers/404';
import routerAlerts from '@/routers/alerts';
import routerDashboard from '@/routers/dashboard';
import routerEntrance from '@/routers/entrance';
import routerFeedbacks from '@/routers/feedbacks';
import routerLogs from '@/routers/logs';
import routerProfile from '@/routers/profile';
import routerPublications from '@/routers/publications';
import routerUsers from '@/routers/users';

const routes: Array<RouteRecordRaw> = [
  ...routerEntrance,
  ...routerDashboard,
  ...routerUsers,
  ...routerProfile,
  ...routerAlerts,
  ...routerPublications,
  ...routerFeedbacks,
  ...routerLogs,
  ...router404,
];

export default routes;

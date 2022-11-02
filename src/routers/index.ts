import {
  RouteRecordRaw,
} from 'vue-router';

import router404 from '@/routers/404';
import routerAlerts from '@/routers/alerts';
import routerCategories from '@/routers/categories';
import routerDashboard from '@/routers/dashboard';
import routerDirections from '@/routers/directions';
import routerEntrance from '@/routers/entrance';
import routerFeedbacks from '@/routers/feedbacks';
import routerLogs from '@/routers/logs';
import routerProfessions from '@/routers/professions';
import routerProfile from '@/routers/profile';
import routerPublications from '@/routers/publications';
import routerSalaries from '@/routers/salaries';
import routerSchools from '@/routers/schools';
import routerSkills from '@/routers/skills';
import routerTeachers from '@/routers/teachers';
import routerTools from '@/routers/tools';
import routerUsers from '@/routers/users';

const routes: Array<RouteRecordRaw> = [
  ...routerEntrance,
  ...routerDashboard,
  ...routerUsers,
  ...routerProfile,
  ...routerAlerts,
  ...routerPublications,
  ...routerDirections,
  ...routerCategories,
  ...routerProfessions,
  ...routerSkills,
  ...routerTools,
  ...routerFeedbacks,
  ...routerSchools,
  ...routerTeachers,
  ...routerSalaries,
  ...routerLogs,
  ...router404,
];

export default routes;

import {
  RouteRecordRaw,
} from 'vue-router';

import router404 from '@/routers/404';
import routerAlerts from '@/routers/alerts';
import routerArticles from '@/routers/articles';
import routerCategories from '@/routers/categories';
import routerCourses from '@/routers/courses';
import routerDashboard from '@/routers/dashboard';
import routerDirections from '@/routers/directions';
import routerEmployments from '@/routers/employments';
import routerEntrance from '@/routers/entrance';
import routerFaqs from '@/routers/faqs';
import routerFeedbacks from '@/routers/feedbacks';
import routerLogs from '@/routers/logs';
import routerProcesses from '@/routers/processes';
import routerProfessions from '@/routers/professions';
import routerProfile from '@/routers/profile';
import routerPublications from '@/routers/publications';
import routerReviews from '@/routers/reviews';
import routerSalaries from '@/routers/salaries';
import routerSchools from '@/routers/schools';
import routerSkills from '@/routers/skills';
import routerTeachers from '@/routers/teachers';
import routerTools from '@/routers/tools';
import routerUsers from '@/routers/users';

const routes: Array<RouteRecordRaw> = [
  ...routerEntrance,
  ...routerDashboard,
  ...routerCourses,
  ...routerUsers,
  ...routerProfile,
  ...routerAlerts,
  ...routerPublications,
  ...routerDirections,
  ...routerCategories,
  ...routerProfessions,
  ...routerSkills,
  ...routerTools,
  ...routerEmployments,
  ...routerProcesses,
  ...routerFeedbacks,
  ...routerSchools,
  ...routerTeachers,
  ...routerSalaries,
  ...routerReviews,
  ...routerFaqs,
  ...routerLogs,
  ...routerArticles,
  ...router404,
];

export default routes;

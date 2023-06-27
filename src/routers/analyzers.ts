import { RouteRecordRaw } from 'vue-router';

import ERole from '@/enums/modules/user/role';
import auth from '@/middleware/auth';
import tokenRefresh from '@/middleware/tokenRefresh';

export default [
  {
    path: '/dashboard/analyzers',
    name: 'Analyzers',
    component: () => import('@/pages/dashboard/analyzers/Index.vue'),
    meta: {
      layout: 'default-layout',
      middleware: [
        tokenRefresh,
        auth,
      ],
      roles: [ERole.ADMIN, ERole.MANAGER],
      redirect: '/',
    },
  },
  {
    path: '/dashboard/analyzers/analyze',
    name: 'AnalyzerAnalyze',
    component: () => import('@/pages/dashboard/analyzers/Analyze.vue'),
    meta: {
      layout: 'default-layout',
      middleware: [
        tokenRefresh,
        auth,
      ],
      roles: [ERole.ADMIN, ERole.MANAGER],
      redirect: '/',
    },
  },
] as Array<RouteRecordRaw>;

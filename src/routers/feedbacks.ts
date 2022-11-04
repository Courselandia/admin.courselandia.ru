import { RouteRecordRaw } from 'vue-router';

import ERole from '@/enums/modules/user/role';
import auth from '@/middleware/auth';
import tokenRefresh from '@/middleware/tokenRefresh';
import feedback from '@/store/feedback';
import TId from '@/types/id';

export default [
  {
    path: '/dashboard/feedbacks',
    name: 'Feedbacks',
    component: () => import('@/pages/dashboard/feedbacks/Index.vue'),
    meta: {
      layout: 'default-layout',
      middleware: [
        tokenRefresh,
        auth,
      ],
      roles: [ERole.ADMIN],
      redirect: '/',
    },
  },
  {
    path: '/dashboard/feedbacks/:id',
    name: 'FeedbackShow',
    component: () => import('@/pages/dashboard/feedbacks/Show.vue'),
    meta: {
      layout: 'default-layout',
      middleware: [
        tokenRefresh,
        auth,
      ],
      roles: [ERole.ADMIN, ERole.MANAGER],
      redirect: '/',
    },
    beforeEnter: async (to, from, next) => {
      const { get } = feedback();

      try {
        await get(to.params.id as TId);
        next();
      } catch (error: Error | any) {
        // eslint-disable-next-line no-param-reassign
        to.meta.layout = 'center-layout';
        next();
      }
    },
  },
] as Array<RouteRecordRaw>;

import { RouteRecordRaw } from 'vue-router';

import guest from '@/middleware/guest';

export default [
  {
    path: '',
    name: 'Entrance',
    component: () => import('@/pages/Entrance.vue'),
    meta: {
      layout: 'center-layout',
      middleware: [guest],
      redirect: '/dashboard',
    },
  },
] as Array<RouteRecordRaw>;

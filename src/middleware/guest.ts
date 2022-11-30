import cookies from 'js-cookie';
import { RouteLocationNormalized } from 'vue-router';

import access from '@/store/access';

export default async (to: RouteLocationNormalized): Promise<boolean | string> => {
  if (!cookies.get('accessToken')) {
    return true;
  }

  if (to?.meta?.redirect) {
    const store = access();

    try {
      await store.getGate();

      return to.meta.redirect as string;
    } catch (error) {
      console.warn('');
    }
  }

  return false;
};

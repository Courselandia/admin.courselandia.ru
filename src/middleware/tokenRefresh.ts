import { storeToRefs } from 'pinia';

import access from '@/stores/access';

export default async (): Promise<boolean | string> => {
  const { getRefreshToken, remember } = access();
  const { intervalTokenRefresh } = storeToRefs(access());

  const toRefresh = async () => {
    const { refreshToken } = access();

    if (refreshToken) {
      try {
        await getRefreshToken(refreshToken, remember || false);
      } catch (error) {
        console.warn('Ошибка регенерации токена.');
      }
    }
  };

  if (!intervalTokenRefresh.value) {
    intervalTokenRefresh.value = window.setInterval(toRefresh, 1000 * 10);
  }

  return true;
};

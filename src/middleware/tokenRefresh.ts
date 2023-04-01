import access from '@/stores/access';

export default async (): Promise<boolean | string> => {
  const { getRefreshToken, remember } = access();

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

  window.setInterval(toRefresh, 1000 * 60 * 5);

  return true;
};

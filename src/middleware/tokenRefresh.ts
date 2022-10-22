import access from '@/store/access';

export default async (): Promise<boolean | string> => {
  const { getRefreshToken, refreshToken, remember } = access();

  const toRefresh = async () => {
    if (refreshToken) {
      try {
        await getRefreshToken(refreshToken, remember || false);
      } catch (error) {
        console.warn('Ошибка регенерации токена.');
      }
    }
  };

  // await toRefresh();
  window.setInterval(toRefresh, 1000 * 60 * 5);

  return true;
};

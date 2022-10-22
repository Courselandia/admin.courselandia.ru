import { defineStore } from 'pinia';

import axios from '@/helpers/axios';
import { IResponseItem } from '@/interfaces/response';
import access from '@/store/access';

export default defineStore('cache', {
  actions: {
    async clean(): Promise<IResponseItem<null>> {
      const response = await axios.post<IResponseItem<null>>('/api/private/admin/core/clean', null, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
  },
});

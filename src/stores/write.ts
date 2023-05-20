import { defineStore } from 'pinia';

import axios from '@/helpers/axios';
import IWrite from '@/interfaces/modules/write/write';
import { IResponseItem } from '@/interfaces/response';
import access from '@/stores/access';
import TId from '@/types/id';

export default defineStore('write', {
  state: () => ({
    item: null as IWrite | null,
  }),
  actions: {
    async request(request: string): Promise<IResponseItem<IWrite>> {
      const response = await axios.put<IResponseItem<IWrite>>('/api/private/admin/write/write', {
        request,
      }, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async result(id: TId): Promise<IResponseItem<IWrite>> {
      const response = await axios.put<IResponseItem<IWrite>>(`/api/private/admin/write/result/${id}`, {}, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      this.item = response.data.data;

      return response.data;
    },
  },
});
